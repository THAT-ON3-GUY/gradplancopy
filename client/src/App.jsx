import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import PlannerSection from './components/Planner/PlannerSection';
import RequirementsPanel from './components/Requirements/RequirementsPanel';
import CourseChip from './components/Sidebar/CourseChip';

const BASE = '/api';

export default function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajorId, setSelectedMajorId] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [planId, setPlanId] = useState(null);
  const [planCourses, setPlanCourses] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    fetch(`${BASE}/majors`).then((r) => r.json()).then((data) => {
      setMajors(data);
      if (data.length) setSelectedMajorId(data[0].id);
    });
    fetch(`${BASE}/courses`).then((r) => r.json()).then(setAllCourses);
  }, []);

  useEffect(() => {
    if (!selectedMajorId) return;
    fetch(`${BASE}/majors/${selectedMajorId}/requirements`).then((r) => r.json()).then(setRequirements);
  }, [selectedMajorId]);

  useEffect(() => {
    if (!selectedMajorId) return;
    fetch(`${BASE}/plans`).then((r) => r.json()).then((plans) => {
      const match = plans.find((p) => p.major_id === selectedMajorId);
      if (match) {
        setPlanId(match.id);
      } else {
        fetch(`${BASE}/plans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'My Graduation Plan', major_id: selectedMajorId }),
        }).then((r) => r.json()).then((p) => setPlanId(p.id));
      }
    });
  }, [selectedMajorId]);

  const loadPlanCourses = useCallback(() => {
    if (!planId) return;
    fetch(`${BASE}/plans/${planId}/courses`).then((r) => r.json()).then(setPlanCourses);
  }, [planId]);

  useEffect(() => { loadPlanCourses(); }, [loadPlanCourses]);

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
      await fetch(`${BASE}/plans/${planId}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, semester_year: semYear, semester_term: semTerm }),
      });
      loadPlanCourses();
    } else if (activeId.startsWith('planned-')) {
      const planCourseId = parseInt(activeId.replace('planned-', ''));
      await fetch(`${BASE}/plans/${planId}/courses/${planCourseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semester_year: semYear, semester_term: semTerm }),
      });
      loadPlanCourses();
    }
  };

  const removeCourseFromPlan = async (planCourseId) => {
    await fetch(`${BASE}/plans/${planId}/courses/${planCourseId}`, { method: 'DELETE' });
    loadPlanCourses();
    setValidation(null);
  };

  const validatePlan = async () => {
    setValidating(true);
    const result = await fetch(`${BASE}/plans/${planId}/validate`).then((r) => r.json());
    setValidation(result);
    setValidating(false);
  };

  const plannedCourseIds = new Set(planCourses.map((pc) => pc.course.id));
  const earnedCredits = planCourses.reduce((sum, pc) => sum + pc.course.credits, 0);
  const totalCredits = majors.find((m) => m.id === selectedMajorId)?.total_credits ?? 120;

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
        <SubHeader planned={earnedCredits} total={totalCredits} />

        {/* Main content area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', backgroundColor: '#f4f4f4' }}>
          {/* Left — planner */}
          <PlannerSection
            planCourses={planCourses}
            onRemoveCourse={removeCourseFromPlan}
            onValidate={validatePlan}
            validating={validating}
            validation={validation}
          />

          {/* Right — requirements */}
          <RequirementsPanel
            requirements={requirements}
            allCourses={allCourses}
            plannedCourseIds={plannedCourseIds}
          />
        </div>
      </div>

      <DragOverlay>
        {overlayCourse && <CourseChip course={overlayCourse} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
