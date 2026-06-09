import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Pencil/edit SVG matching BYUI's sprite icon
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18" style={{ opacity: 0.9 }}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

export default function PlannedCourseCard({ planCourse, onRemove, bgColor = '#50b95b' }) {
  const { course, plan_course_id } = planCourse;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `planned-${plan_course_id}`,
  });

  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: bgColor,
        height: '64px',
        borderRadius: '10px',
        marginBottom: '10px',
        opacity: isDragging ? 0.25 : 1,
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        cursor: 'grab',
        userSelect: 'none',
      }}
      className="group"
      title={course.name}
    >
      {/* Left — pencil icon / remove on hover */}
      <div
        style={{ width: '44px', borderRight: '1px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}
      >
        <div className="group-hover:hidden flex items-center justify-center w-full h-full" {...listeners} {...attributes}>
          <PencilIcon />
        </div>
        <button
          onClick={() => onRemove(plan_course_id)}
          className="hidden group-hover:flex items-center justify-center w-full h-full text-white text-xl font-bold bg-red-600 bg-opacity-90"
          style={{ borderRadius: '10px 0 0 10px' }}
          title="Remove"
        >
          ×
        </button>
      </div>

      {/* Middle — name + code */}
      <div
        {...listeners}
        {...attributes}
        style={{ flex: 1, padding: '10px 12px', borderRight: '1px solid rgba(255,255,255,0.35)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 400, lineHeight: 1.2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {course.name}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: 600, marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {course.code}
        </div>
      </div>

      {/* Right — credits */}
      <div
        {...listeners}
        {...attributes}
        style={{ width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 400 }}>{course.credits}</span>
      </div>
    </div>
  );
}
