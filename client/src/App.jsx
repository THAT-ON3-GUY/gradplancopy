import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import PlannerSection from './components/Planner/PlannerSection';
import RequirementsPanel from './components/Requirements/RequirementsPanel';
import CourseChip from './components/Sidebar/CourseChip';
import Footer from './components/Footer';
import AddCourseModal from './components/Modals/AddCourseModal';
import CourseDetailModal from './components/Modals/CourseDetailModal';
import AdjustCreditsModal from './components/Modals/AdjustCreditsModal';
import SeeDetailsPanel from './components/SeeDetailsPanel';
import { getSemesterStatus } from './components/Planner/PlannedCourseCard';
import * as api from './api';

export default function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajorId, setSelectedMajorId] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [planId, setPlanId] = useState(null);
  const [planCourses, setPlanCourses] = useState([]);
  const [transferCredits, setTransferCredits] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);

  // Modal / panel state
  const [addCourseModal, setAddCourseModal] = useState(null); // { course, mode, planCourseId? }
  const [detailModal, setDetailModal] = useState(null);       // { planCourse, status }
  const [adjustModal, setAdjustModal] = useState(null);       // { planCourse }
  const [showDetails, setShowDetails] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    api.getMajors().then((data) => {
      setMajors(data);
      if (data.length) setSelectedMajorId(data[0].id);
    });
    api.getCourses().then(setAllCourses);
  }, []);

  useEffect(() => {
    if (!selectedMajorId) return;
    api.getRequirements(selectedMajorId).then(setRequirements);
  }, [selectedMajorId]);

  useEffect(() => {
    if (!selectedMajorId) return;
    api.getPlans().then((plans) => {
      const match = plans.find((p) => p.major_id === selectedMajorId);
      if (match) {
        setPlanId(match.id);
      } else {
        api.createPlan('My Graduation Plan', selectedMajorId).then((p) => setPlanId(p.id));
      }
    });
  }, [selectedMajorId]);

  const loadPlanCourses = useCallback(() => {
    if (!planId) return;
    api.getPlanCourses(planId).then(setPlanCourses);
  }, [planId]);

  const loadTransferCredits = useCallback(() => {
    if (!planId) return;
    api.getTransferCredits(planId).then(setTransferCredits);
  }, [planId]);

  useEffect(() => { loadPlanCourses(); }, [loadPlanCourses]);
  useEffect(() => { loadTransferCredits(); }, [loadTransferCredits]);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (event) => {
    setActiveItem(event.active);
    setValidation(null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith('sem-')) return;

    const parts = overId.split('-');
    const semYear = parseInt(parts[1]);
    const semTerm = parts[2];
    const activeId = String(active.id);

    if (activeId.startsWith('catalog-')) {
      const courseId = parseInt(activeId.replace('catalog-', ''));
      await api.addCourseToPlan(planId, courseId, semYear, semTerm);
      loadPlanCourses();
    } else if (activeId.startsWith('planned-')) {
      const planCourseId = parseInt(activeId.replace('planned-', ''));
      await api.moveCourse(planId, planCourseId, semYear, semTerm);
      loadPlanCourses();
    }
  };

  // ── Plan actions ──────────────────────────────────────────────────────────
  const removeCourseFromPlan = async (planCourseId) => {
    await api.removeCourse(planId, planCourseId);
    loadPlanCourses();
    setValidation(null);
  };

  const validatePlan = async () => {
    setValidating(true);
    const result = await api.validatePlan(planId);
    setValidation(result);
    setValidating(false);
  };

  // ── Modal handlers ─────────────────────────────────────────────────────────
  const handleAddCourse = (course) => {
    setAddCourseModal({ course, mode: 'add' });
  };

  const handleMoveCourse = (planCourse) => {
    setAddCourseModal({ course: planCourse.course, mode: 'move', planCourseId: planCourse.plan_course_id });
  };

  const handleAdjustCredits = async (planCourseId, newCredits) => {
    await api.adjustCredits(planId, planCourseId, newCredits);
    loadPlanCourses();
    setAdjustModal(null);
  };

  const handleViewDetails = (planCourse, status) => {
    setDetailModal({ planCourse, status });
  };

  const handleViewCourseDetails = (course) => {
    // For catalog courses (not in plan), create a dummy planCourse shell
    const existingPc = planCourses.find((pc) => pc.course.id === course.id);
    if (existingPc) {
      const st = getSemesterStatus(existingPc.semester_year, existingPc.semester_term);
      setDetailModal({ planCourse: existingPc, status: st });
    } else {
      setDetailModal({
        planCourse: {
          course,
          plan_course_id: null,
          semester_year: null,
          semester_term: null,
          planned_credits: null,
        },
        status: 'catalog',
      });
    }
  };

  const handleModalAdd = async (year, term) => {
    if (!addCourseModal) return;
    if (addCourseModal.mode === 'move' && addCourseModal.planCourseId) {
      await api.moveCourse(planId, addCourseModal.planCourseId, year, term);
    } else {
      await api.addCourseToPlan(planId, addCourseModal.course.id, year, term);
    }
    loadPlanCourses();
    setAddCourseModal(null);
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  const plannedCourseIds = new Set(planCourses.map((pc) => pc.course.id));
  const totalCredits = majors.find((m) => m.id === selectedMajorId)?.total_credits ?? 120;
  const majorName = majors.find((m) => m.id === selectedMajorId)?.name ?? 'Computer Science';

  const creditsByStatus = planCourses.reduce(
    (acc, pc) => {
      const st = getSemesterStatus(pc.semester_year, pc.semester_term);
      acc[st] = (acc[st] ?? 0) + (pc.planned_credits ?? pc.course.credits);
      return acc;
    },
    { completed: 0, enrolled: 0, planned: 0 }
  );

  const getDragOverlayCourse = () => {
    if (!activeItem) return null;
    const id = String(activeItem.id);
    if (id.startsWith('catalog-')) {
      const courseId = parseInt(id.replace('catalog-', ''));
      return allCourses.find((c) => c.id === courseId);
    }
    if (id.startsWith('planned-')) {
      const pcId = parseInt(id.replace('planned-', ''));
      return planCourses.find((pc) => pc.plan_course_id === pcId)?.course;
    }
    return null;
  };

  const overlayCourse = getDragOverlayCourse();

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Black top navbar */}
        <Navbar studentName="Student" />

        {/* White sub-header with credit stats */}
        <SubHeader
          completed={creditsByStatus.completed}
          inProgress={creditsByStatus.enrolled}
          planned={creditsByStatus.planned}
          total={totalCredits}
          showDetails={showDetails}
          onSeeDetails={() => setShowDetails((v) => !v)}
        />

        {/* SEE DETAILS breakdown panel */}
        {showDetails && (
          <SeeDetailsPanel
            planCourses={planCourses}
            requirements={requirements}
            transferCredits={transferCredits}
            total={totalCredits}
            onClose={() => setShowDetails(false)}
          />
        )}

        {/* Main content area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', backgroundColor: '#f4f4f4' }}>
          {/* Left — planner */}
          <PlannerSection
            planCourses={planCourses}
            transferCredits={transferCredits}
            onRemoveCourse={removeCourseFromPlan}
            onViewDetails={handleViewDetails}
            onMoveCourse={handleMoveCourse}
            onAdjustCredits={(planCourse) => setAdjustModal({ planCourse })}
            onValidate={validatePlan}
            validating={validating}
            validation={validation}
          />

          {/* Right — requirements */}
          <RequirementsPanel
            requirements={requirements}
            allCourses={allCourses}
            plannedCourseIds={plannedCourseIds}
            onAddCourse={handleAddCourse}
            onViewCourseDetails={handleViewCourseDetails}
            majorName={majorName}
          />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Drag overlay ghost */}
      <DragOverlay>
        {overlayCourse && <CourseChip course={overlayCourse} isDragging />}
      </DragOverlay>

      {/* Add Course / Move Course modal */}
      {addCourseModal && (
        <AddCourseModal
          course={addCourseModal.course}
          planCourses={planCourses}
          mode={addCourseModal.mode}
          onAdd={handleModalAdd}
          onClose={() => setAddCourseModal(null)}
        />
      )}

      {/* Course Detail modal */}
      {detailModal && (
        <CourseDetailModal
          planCourse={detailModal.planCourse}
          status={detailModal.status}
          onClose={() => setDetailModal(null)}
          onRemove={detailModal.status === 'planned' ? removeCourseFromPlan : null}
          onMove={detailModal.status === 'planned' ? () => handleMoveCourse(detailModal.planCourse) : null}
        />
      )}

      {/* Adjust Credits modal */}
      {adjustModal && (
        <AdjustCreditsModal
          planCourse={adjustModal.planCourse}
          onSave={handleAdjustCredits}
          onClose={() => setAdjustModal(null)}
        />
      )}
    </DndContext>
  );
}
