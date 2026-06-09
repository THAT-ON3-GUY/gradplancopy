import { useDroppable } from '@dnd-kit/core';
import PlannedCourseCard from './PlannedCourseCard';

const TERM_COLORS = {
  Fall: 'bg-amber-600',
  Winter: 'bg-byui-navy',
  Spring: 'bg-green-600',
};

export default function SemesterColumn({ year, term, planCourses, onRemoveCourse }) {
  const id = `sem-${year}-${term}`;
  const { setNodeRef, isOver } = useDroppable({ id });

  const semCredits = planCourses.reduce((s, pc) => s + pc.course.credits, 0);
  const creditWarning = semCredits > 18;

  return (
    <div className="flex flex-col min-w-[160px] w-[160px]">
      {/* Header */}
      <div className={`${TERM_COLORS[term]} text-white text-center py-2 rounded-t-lg`}>
        <div className="text-xs font-bold uppercase tracking-wide">{term}</div>
        <div className="text-sm font-semibold">{year}</div>
      </div>

      {/* Credit count */}
      <div
        className={`text-center text-xs py-0.5 font-medium ${
          creditWarning ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {semCredits} cr{creditWarning ? ' ⚠️' : ''}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[220px] rounded-b-lg border-2 p-2 space-y-1.5 transition-colors ${
          isOver
            ? 'border-byui-gold bg-yellow-50'
            : 'border-gray-200 bg-white border-t-0'
        }`}
      >
        {planCourses.map((pc) => (
          <PlannedCourseCard key={pc.plan_course_id} planCourse={pc} onRemove={onRemoveCourse} />
        ))}

        {planCourses.length === 0 && (
          <div className="flex items-center justify-center h-full text-xs text-gray-300 italic pointer-events-none">
            Drop course here
          </div>
        )}
      </div>
    </div>
  );
}
