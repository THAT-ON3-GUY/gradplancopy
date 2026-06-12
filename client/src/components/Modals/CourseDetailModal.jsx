// Mock grades for completed/enrolled courses
const MOCK_GRADES = {
  completed: ['A', 'A-', 'B+', 'B', 'A', 'A', 'B+', 'A-', 'B', 'A'],
};

function getGrade(courseId, status) {
  if (status === 'completed') return MOCK_GRADES.completed[courseId % MOCK_GRADES.completed.length];
  if (status === 'enrolled') return 'IP'; // In Progress
  return null;
}

function getSemLabel(year, term) {
  return `${term} ${year}`;
}

export default function CourseDetailModal({ planCourse, status = 'planned', onClose, onRemove, onMove }) {
  const { course, semester_year, semester_term, plan_course_id } = planCourse;
  // 'catalog' = viewing from requirements panel, not yet in a plan
  const isCatalog = status === 'catalog';
  const grade = isCatalog ? null : getGrade(course.id, status);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '680px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#006ca5',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 400, marginBottom: '4px' }}>
              {course.code}
            </div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              {course.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#fff',
              fontSize: '22px', cursor: 'pointer', lineHeight: 1,
              marginLeft: '16px', flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Grade / status row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Grade badge */}
              {isCatalog ? (
                <div
                  style={{
                    width: '56px', height: '56px',
                    backgroundColor: '#888',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '10px', fontWeight: 700,
                    flexShrink: 0, textAlign: 'center', lineHeight: 1.2, padding: '4px',
                  }}
                >
                  NOT PLANNED
                </div>
              ) : grade ? (
                <div
                  style={{
                    width: '56px', height: '56px',
                    backgroundColor: status === 'enrolled' ? '#008fdd' : '#0072b0',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '22px', fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {grade}
                </div>
              ) : (
                <div
                  style={{
                    width: '56px', height: '56px',
                    backgroundColor: '#50b95b',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '11px', fontWeight: 700,
                    flexShrink: 0, textAlign: 'center', lineHeight: 1.2,
                    padding: '4px',
                  }}
                >
                  PLANNED
                </div>
              )}

              <div>
                {isCatalog && (
                  <div style={{ fontSize: '14px', color: '#888', fontStyle: 'italic' }}>
                    Not yet added to plan
                  </div>
                )}
                {status === 'completed' && (
                  <div style={{ fontSize: '14px', color: '#333', fontWeight: 600 }}>
                    Earned {getSemLabel(semester_year, semester_term)}
                  </div>
                )}
                {status === 'enrolled' && (
                  <div style={{ fontSize: '14px', color: '#333', fontWeight: 600 }}>
                    Enrolled – {getSemLabel(semester_year, semester_term)}
                  </div>
                )}
                {status === 'planned' && (
                  <div style={{ fontSize: '14px', color: '#333', fontWeight: 600 }}>
                    Planned – {getSemLabel(semester_year, semester_term)}
                  </div>
                )}
                {!isCatalog && (
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                    {status === 'completed' ? 'Grade Earned' : status === 'enrolled' ? 'In Progress' : 'Future Semester'}
                  </div>
                )}

                {/* Course History dropdown (non-functional) */}
                <button
                  style={{
                    marginTop: '8px',
                    fontSize: '12px', color: '#006ca5',
                    background: 'none', border: '1px solid #006ca5',
                    borderRadius: '4px', padding: '3px 10px',
                    cursor: 'pointer', fontFamily: 'Open Sans, sans-serif',
                  }}
                >
                  Course History ▾
                </button>

                {status !== 'planned' && (
                  <button
                    style={{
                      marginTop: '4px',
                      fontSize: '12px', color: '#50b95b',
                      background: 'none', border: '1px solid #50b95b',
                      borderRadius: '4px', padding: '3px 10px',
                      cursor: 'pointer', fontFamily: 'Open Sans, sans-serif',
                      marginLeft: '6px',
                    }}
                  >
                    Replan Course
                  </button>
                )}
              </div>
            </div>

            {/* Credits */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '48px', fontWeight: 300, color: '#000', lineHeight: 1 }}>
                {course.credits}
              </div>
              <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Credit{course.credits !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 0 20px' }} />

          {/* Two-column: description + requirements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Course description */}
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '10px' }}>
                Course Description
              </h3>
              <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.6, margin: 0 }}>
                {course.description || 'No description available.'}
              </p>
            </div>

            {/* Prerequisites */}
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '10px' }}>
                Course Requirements Completed
              </h3>
              {course.prerequisites && course.prerequisites.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {course.prerequisites.map((prereq) => (
                    <li key={prereq} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ color: '#50b95b', fontSize: '16px' }}>✓</span>
                      <span style={{ fontSize: '14px', color: '#333' }}>{prereq}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '14px', color: '#888', fontStyle: 'italic', margin: 0 }}>
                  No prerequisites required.
                </p>
              )}
            </div>
          </div>

          {/* Offered section */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '8px' }}>
              Offered
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(course.offered || ['Fall', 'Winter', 'Spring']).map((term) => (
                <span
                  key={term}
                  style={{
                    padding: '3px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: '#e8f4fb',
                    color: '#006ca5',
                    fontWeight: 600,
                  }}
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            borderTop: '1px solid #eee',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          {status === 'planned' && onRemove && (
            <button
              onClick={() => { onRemove(plan_course_id); onClose(); }}
              style={{
                padding: '8px 20px', borderRadius: '4px',
                border: '1px solid #e53935', background: 'none',
                color: '#e53935', cursor: 'pointer', fontSize: '13px',
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              Remove Course
            </button>
          )}
          {status === 'planned' && onMove && (
            <button
              onClick={() => { onMove(); onClose(); }}
              style={{
                padding: '8px 20px', borderRadius: '4px',
                border: '1px solid #006ca5', background: 'none',
                color: '#006ca5', cursor: 'pointer', fontSize: '13px',
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              Move Course
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '8px 24px', borderRadius: '4px',
              border: 'none', backgroundColor: '#006ca5',
              color: '#fff', cursor: 'pointer', fontSize: '13px',
              fontWeight: 600, fontFamily: 'Open Sans, sans-serif',
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
