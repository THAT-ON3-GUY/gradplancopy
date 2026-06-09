import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Header from './components/Header';
import CourseCatalog from './components/Sidebar/CourseCatalog';
import RequirementsPanel from './components/Sidebar/RequirementsPanel';
import PlannerGrid from './components/Planner/PlannerGrid';
import CreditTracker from './components/CreditTracker';
import CourseChip from './components/Sidebar/CourseChip';

const BASE = '/api';

const SEMESTERS = [
  { year: 2024, term: 'Fall' },
  { year: 2025, term: 'Winter' },
  { year: 2025, term: 'Spring' },
  { year: 2025, term: 'Fall' },
  { year: 2026, term: 'Winter' },
  { year: 2026, term: 'Spring' },
  { year: 2026, term: 'Fall' },
  { year: 2027, term: 'Winter' },
  { year: 2027, term: 'Spring' },
  { year: 2027, term: 'Fall' },
];

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
  const [tab, setTab] = useState('catalog');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Load majors
  useEffect(() => {
    fetch(`${BASE}/majors`)
      .then((r) => r.json())
      .then((data) => {
        setMajors(data);
        if (data.length) setSelectedMajorId(data[0].id);
      });
  }, []);

  // Load courses
  useEffect(() => {
    fetch(`${BASE}/courses`)
      .then((r) => r.json())
      .then(setAllCourses);
  }, []);

  // Load requirements when major changes
  useEffect(() => {
    if (!selectedMajorId) return;
    fetch(`${BASE}/majors/${selectedMajorId}/requirements`)
      .then((r) => r.json())
      .then(setRequirements);
  }, [selectedMajorId]);

  // Load or create plan when major changes
  useEffect(() => {
    if (!selectedMajorId) return;
    fetch(`${BASE}/plans`)
      .then((r) => r.json())
      .then((plans) => {
        const match = plans.find((p) => p.major_id === selectedMajorId);
        if (match) {
          setPlanId(match.id);
        } else {
          return fetch(`${BASE}/plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'My Graduation Plan', major_id: selectedMajorId }),
          })
            .then((r) => r.json())
            .then((p) => setPlanId(p.id));
        }
      });
  }, [selectedMajorId]);

  // Load plan courses when plan changes
  const loadPlanCourses = useCallback(() => {
    if (!planId) return;
    fetch(`${BASE}/plans/${planId}/courses`)
      .then((r) => r.json())
      .then(setPlanCourses);
  }, [planId]);

  useEffect(() => {
    loadPlanCourses();
  }, [loadPlanCourses]);

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

  const totalCreditsMajor = majors.find((m) => m.id === selectedMajorId)?.total_credits ?? 120;
  const earnedCredits = planCourses.reduce((sum, pc) => sum + pc.course.credits, 0);

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
      <div className="flex flex-col h-screen overflow-hidden">
        <Header
          majors={majors}
          selectedMajorId={selectedMajorId}
          onMajorChange={(id) => {
            setSelectedMajorId(id);
            setPlanCourses([]);
            setValidation(null);
          }}
          onValidate={validatePlan}
          validating={validating}
          validation={validation}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-72 flex flex-col bg-white border-r border-byui-border shadow-sm overflow-hidden">
            <CreditTracker earned={earnedCredits} total={totalCreditsMajor} />

            {/* Tab switcher */}
            <div className="flex border-b border-byui-border">
              {['catalog', 'requirements'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                    tab === t
                      ? 'text-byui-navy border-b-2 border-byui-navy'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t === 'catalog' ? 'Course Catalog' : 'Requirements'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {tab === 'catalog' ? (
                <CourseCatalog courses={allCourses} plannedCourseIds={plannedCourseIds} />
              ) : (
                <RequirementsPanel requirements={requirements} plannedCourseIds={plannedCourseIds} />
              )}
            </div>
          </aside>

          {/* Main planner grid */}
          <main className="flex-1 overflow-auto bg-byui-gray p-4">
            {validation && (
              <div
                className={`mb-3 px-4 py-2 rounded-lg text-sm font-medium flex items-start gap-2 ${
                  validation.valid
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-50 text-red-800 border border-red-300'
                }`}
              >
                <span className="mt-0.5">{validation.valid ? '✅' : '⚠️'}</span>
                <div>
                  {validation.valid ? (
                    'Your plan looks great! All prerequisites are satisfied.'
                  ) : (
                    <>
                      <div className="font-semibold mb-1">Prerequisite issues found:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {validation.issues.map((issue, i) => (
                          <li key={i}>{issue.issue}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}

            <PlannerGrid
              semesters={SEMESTERS}
              planCourses={planCourses}
              onRemoveCourse={removeCourseFromPlan}
            />
          </main>
        </div>
      </div>

      <DragOverlay>
        {overlayCourse && <CourseChip course={overlayCourse} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
