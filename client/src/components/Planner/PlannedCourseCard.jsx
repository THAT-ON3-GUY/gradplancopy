import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Status → background color mapping from the real BYUI site
const STATUS_COLORS = {
  planned:   '#50b95b',
  enrolled:  '#008fdd',
  completed: '#0072b0',
  recommended: '#8f00f8',
};

// Status icon character (uses the sprite concept simplified)
const STATUS_ICONS = {
  planned:   '✓',
  enrolled:  '◉',
  completed: '★',
  recommended: '⚡',
};

export default function PlannedCourseCard({ planCourse, onRemove }) {
  const { course, plan_course_id } = planCourse;
  const status = 'planned'; // All user-added courses are "planned"

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `planned-${plan_course_id}`,
  });

  const bg = STATUS_COLORS[status];
  const icon = STATUS_ICONS[status];
  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: bg,
        height: '64px',
        borderRadius: '10px',
        marginBottom: '10px',
        opacity: isDragging ? 0.3 : 1,
      }}
      className="group flex items-center w-full select-none overflow-hidden cursor-grab active:cursor-grabbing"
      title={`${course.name}\n${course.description ?? ''}`}
    >
      {/* Action section (left, 44px) */}
      <div
        {...listeners}
        {...attributes}
        className="flex items-center justify-center shrink-0"
        style={{ width: '44px', height: '64px', borderRight: '1px solid rgba(255,255,255,0.4)', position: 'relative' }}
      >
        <span className="text-white text-lg opacity-80">{icon}</span>

        {/* Remove button on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(plan_course_id); }}
          className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-red-600 bg-opacity-90 text-white text-lg font-bold transition-all"
          style={{ borderRadius: '10px 0 0 10px' }}
          title="Remove from plan"
        >
          ×
        </button>
      </div>

      {/* Subject detail (middle, flex-grow) */}
      <div
        {...listeners}
        {...attributes}
        className="flex flex-col justify-center flex-1 overflow-hidden px-3"
        style={{ borderRight: '1px solid rgba(255,255,255,0.4)', height: '64px' }}
      >
        <div className="text-white font-semibold text-sm leading-tight truncate">{course.code}</div>
        <div className="text-white text-xs opacity-80 leading-tight truncate">{course.name}</div>
      </div>

      {/* Credit count (right, 44px) */}
      <div
        {...listeners}
        {...attributes}
        className="flex items-center justify-center shrink-0"
        style={{ width: '44px', height: '64px' }}
      >
        <div className="text-center">
          <div className="text-white font-bold text-base leading-none">{course.credits}</div>
          <div className="text-white text-[8px] opacity-70 uppercase leading-none mt-0.5">cr</div>
        </div>
      </div>
    </div>
  );
}
