import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function RequirementCourse({ course, isPlanned, onAdd, onViewDetails }) {
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
        backgroundColor: '#fff',
        borderRadius: '6px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        opacity: isDragging ? 0.25 : 1,
        border: '1px solid #e8e8e8',
        overflow: 'hidden',
        height: '52px',
      }}
    >
      {/* Left — green + button */}
      <button
        onClick={() => !isPlanned && onAdd && onAdd(course)}
        style={{
          width: '44px',
          height: '100%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          borderRight: '1px solid #f0f0f0',
          cursor: isPlanned ? 'default' : 'pointer',
          padding: 0,
        }}
        title={isPlanned ? 'Already in plan' : `Add ${course.code} to plan`}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: isPlanned ? '#50b95b' : '#50b95b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isPlanned ? (
            // Checkmark when planned
            <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          ) : (
            // Plus sign when not planned
            <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          )}
        </div>
      </button>

      {/* Middle — name + code (draggable handle) */}
      <div
        {...(isPlanned ? {} : { ...listeners, ...attributes })}
        style={{
          flex: 1,
          padding: '0 10px',
          overflow: 'hidden',
          cursor: isPlanned ? 'default' : 'grab',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: '#333',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
          }}
        >
          {course.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
          <span
            style={{
              fontSize: '11px',
              color: '#888',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {course.code}
          </span>
          {course.is_variable_credit && (
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#006ca5',
                backgroundColor: '#e8f4fb',
                border: '1px solid #b3d9f0',
                borderRadius: '3px',
                padding: '1px 4px',
                whiteSpace: 'nowrap',
              }}
            >
              VAR CR
            </span>
          )}
        </div>
      </div>

      {/* View Details link */}
      <button
        onClick={() => onViewDetails && onViewDetails(course)}
        style={{
          fontSize: '11px',
          color: '#006ca5',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          background: 'none',
          border: 'none',
          padding: '0 6px',
          fontFamily: 'Open Sans, sans-serif',
        }}
      >
        View Details
      </button>

      {/* Credits */}
      <span
        style={{
          fontSize: '14px',
          color: '#333',
          fontWeight: 600,
          marginRight: '12px',
          flexShrink: 0,
          minWidth: '20px',
          textAlign: 'right',
        }}
      >
        {course.credits}
      </span>
    </div>
  );
}
