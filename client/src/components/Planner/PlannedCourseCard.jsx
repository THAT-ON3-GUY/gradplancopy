import { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18" style={{ opacity: 0.9 }}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

// Determine semester status from year/term (as of June 2026)
export function getSemesterStatus(year, term) {
  if (year < 2026) return 'completed';
  if (year === 2026 && term === 'Winter') return 'completed';
  if (year === 2026 && term === 'Spring') return 'enrolled';
  return 'planned';
}

export function getStatusColor(status) {
  if (status === 'completed') return '#0072b0';
  if (status === 'enrolled') return '#008fdd';
  return '#50b95b';
}

export default function PlannedCourseCard({
  planCourse,
  onRemove,
  onViewDetails,
  onMoveCourse,
  onAdjustCredits,
  bgColor = '#50b95b',
  status = 'planned',
}) {
  const { course, plan_course_id } = planCourse;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const draggable = status === 'planned';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `planned-${plan_course_id}`,
    disabled: !draggable,
  });

  const style = { transform: CSS.Translate.toString(transform) };

  // Close context menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handlePencilClick = (e) => {
    e.stopPropagation();
    setMenuOpen((o) => !o);
  };

  // Which menu items to show based on status
  const isEditable = status === 'planned';
  const isVariable = course.is_variable_credit;

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
        overflow: 'visible',
        userSelect: 'none',
        position: 'relative',
      }}
      title={course.name}
    >
      {/* Left — pencil icon (opens context menu) */}
      <div
        ref={menuRef}
        style={{
          width: '44px',
          borderRight: '1px solid rgba(255,255,255,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          borderRadius: '10px 0 0 10px',
          cursor: 'pointer',
        }}
        onClick={handlePencilClick}
      >
        <PencilIcon />

        {/* Context menu dropdown */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 500,
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              minWidth: '180px',
              marginTop: '4px',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Course Details — always visible */}
            <ContextMenuItem
              icon="ℹ"
              label="Course Details"
              onClick={() => {
                setMenuOpen(false);
                onViewDetails && onViewDetails(planCourse, status);
              }}
            />

            {/* Remove / Move — only for planned courses */}
            {isEditable && (
              <>
                <ContextMenuItem
                  icon="✕"
                  label="Remove Course"
                  danger
                  onClick={() => {
                    setMenuOpen(false);
                    onRemove && onRemove(plan_course_id);
                  }}
                />
                <ContextMenuItem
                  icon="↺"
                  label="Move Course"
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveCourse && onMoveCourse(planCourse);
                  }}
                />
              </>
            )}

            {/* Adjust Credits — only for variable credit courses */}
            {isVariable && isEditable && (
              <ContextMenuItem
                icon="↔"
                label="Adjust Credits"
                onClick={() => {
                  setMenuOpen(false);
                  onAdjustCredits && onAdjustCredits(planCourse);
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Middle — name + code (draggable) */}
      <div
        {...listeners}
        {...attributes}
        style={{
          flex: 1,
          padding: '10px 12px',
          borderRight: '1px solid rgba(255,255,255,0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: draggable ? 'grab' : 'default',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: 1.2,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {course.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
          <span
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '11px',
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
                letterSpacing: '0.05em',
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
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

      {/* Right — credits (draggable) */}
      <div
        {...listeners}
        {...attributes}
        style={{
          width: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: draggable ? 'grab' : 'default',
        }}
      >
        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 400 }}>
          {planCourse.planned_credits ?? course.credits}
        </span>
      </div>
    </div>
  );
}

function ContextMenuItem({ icon, label, onClick, danger = false }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 14px',
        background: hover ? (danger ? '#fff5f5' : '#f5f5f5') : '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        color: danger ? '#e53935' : '#333',
        fontFamily: 'Open Sans, sans-serif',
        textAlign: 'left',
        borderBottom: '1px solid #f0f0f0',
        transition: 'background-color 0.1s',
      }}
    >
      <span style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}
