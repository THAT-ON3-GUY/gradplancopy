import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DEPT_COLORS = {
  CS: 'bg-blue-100 border-blue-300 text-blue-900',
  Math: 'bg-purple-100 border-purple-300 text-purple-900',
  Physics: 'bg-orange-100 border-orange-300 text-orange-900',
  Religion: 'bg-green-100 border-green-300 text-green-900',
  English: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  Communication: 'bg-pink-100 border-pink-300 text-pink-900',
  History: 'bg-amber-100 border-amber-300 text-amber-900',
  'Political Science': 'bg-teal-100 border-teal-300 text-teal-900',
};

export default function PlannedCourseCard({ planCourse, onRemove }) {
  const { course, plan_course_id } = planCourse;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `planned-${plan_course_id}`,
  });

  const color = DEPT_COLORS[course.department] ?? 'bg-gray-100 border-gray-300 text-gray-800';
  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded border text-xs p-1.5 select-none transition-all
        ${color} ${isDragging ? 'opacity-30' : 'hover:shadow-sm'}`}
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
        title={`${course.name}\n${course.description ?? ''}`}
      >
        <div className="font-semibold truncate">{course.code}</div>
        <div className="text-[10px] opacity-75 truncate leading-tight">{course.name}</div>
        <div className="text-[10px] font-bold mt-0.5">{course.credits} cr</div>
      </div>

      <button
        onClick={() => onRemove(plan_course_id)}
        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] leading-none
                   hidden group-hover:flex items-center justify-center hover:bg-red-600 transition-colors z-10"
        title="Remove from plan"
      >
        ×
      </button>
    </div>
  );
}
