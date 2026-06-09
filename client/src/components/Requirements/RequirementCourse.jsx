import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function RequirementCourse({ course, isPlanned }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `catalog-${course.id}`,
    disabled: isPlanned,
  });

  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
        padding: '10px 12px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: isDragging ? 0.25 : 1,
        cursor: isPlanned ? 'default' : 'grab',
        border: '1px solid #e8e8e8',
      }}
      {...(isPlanned ? {} : { ...listeners, ...attributes })}
      title={isPlanned ? `${course.name} — already in plan` : `Drag to add ${course.name}`}
    >
      {/* Course info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 400, color: '#333', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {course.name.length > 22 ? course.name.slice(0, 22) + '…' : course.name}
        </div>
        <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {course.code}
        </div>
      </div>

      {/* View Details link */}
      <span style={{ fontSize: '11px', color: '#006ca5', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
        View Details
      </span>

      {/* Credits */}
      <span style={{ fontSize: '13px', color: '#333', fontWeight: 600, marginLeft: '4px', flexShrink: 0 }}>
        {course.credits}
      </span>

      {/* Status dot */}
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: isPlanned ? '#50b95b' : 'transparent',
        border: isPlanned ? 'none' : '2px solid #ccc',
      }} />
    </div>
  );
}
