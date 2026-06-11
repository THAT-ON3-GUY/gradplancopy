import { useState } from 'react';

// Semesters in display order per year
const TERMS = ['Winter', 'Spring', 'Fall'];

// Labels for each term in the modal
const TERM_MONTHS = {
  Winter: 'Jan – Mar',
  Spring: 'Apr – Jun',
  Fall:   'Sep – Dec',
};

// As of June 2026, Spring 2026 is current → only Fall 2026+ are available for new planning
function isSemesterAvailable(year, term) {
  if (year < 2026) return false;
  if (year === 2026 && (term === 'Winter' || term === 'Spring')) return false;
  return true;
}

export default function AddCourseModal({ course, planCourses = [], mode = 'add', onAdd, onClose }) {
  // Page: 0 = years 2026-2027, 1 = years 2027-2028, etc.
  const [page, setPage] = useState(0);

  const startYear = 2026 + page * 2;
  const years = [startYear, startYear + 1];

  // Which semesters already have this course
  const alreadyInSem = new Set(
    planCourses
      .filter((pc) => pc.course.id === course.id)
      .map((pc) => `${pc.semester_year}-${pc.semester_term}`)
  );

  const isOffered = (term) => course.offered?.includes(term) ?? true;

  const handleSelect = (year, term) => {
    if (!isSemesterAvailable(year, term)) return;
    if (!isOffered(term)) return;
    onAdd(year, term);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '560px',
          maxWidth: '95vw',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ backgroundColor: '#006ca5', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 400 }}>
            Select a semester to {mode === 'move' ? 'move' : 'plan'}{' '}
            <strong style={{ fontWeight: 700 }}>{course.code}</strong>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Year navigation */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px 4px', gap: '8px' }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              background: 'none', border: '1px solid #ccc', borderRadius: '4px',
              padding: '4px 10px', cursor: page === 0 ? 'default' : 'pointer',
              color: page === 0 ? '#ccc' : '#006ca5', fontSize: '16px',
            }}
          >
            ‹
          </button>
          {years.map((y) => (
            <span key={y} style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '15px', color: '#000' }}>
              {y}
            </span>
          ))}
          <button
            onClick={() => setPage((p) => p + 1)}
            style={{
              background: 'none', border: '1px solid #ccc', borderRadius: '4px',
              padding: '4px 10px', cursor: 'pointer',
              color: '#006ca5', fontSize: '16px',
            }}
          >
            ›
          </button>
        </div>

        {/* Semester grid */}
        <div style={{ padding: '8px 20px 20px' }}>
          {/* Term row headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${years.length}, 1fr)`, gap: '8px', marginBottom: '6px' }}>
            <div />
            {years.map((y) => (
              <div key={y} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#666' }}>
                {y}–{y + 1}
              </div>
            ))}
          </div>

          {TERMS.map((term) => (
            <div
              key={term}
              style={{
                display: 'grid',
                gridTemplateColumns: `120px repeat(${years.length}, 1fr)`,
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              {/* Term label */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#555' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{term}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>{TERM_MONTHS[term]}</div>
                </div>
              </div>

              {years.map((year) => {
                const semKey = `${year}-${term}`;
                const available = isSemesterAvailable(year, term) && isOffered(term);
                const alreadyPlanned = alreadyInSem.has(semKey);

                if (alreadyPlanned) {
                  return (
                    <div
                      key={year}
                      style={{
                        border: '1px solid #0072b0',
                        borderRadius: '6px',
                        padding: '10px',
                        textAlign: 'center',
                        backgroundColor: '#e8f4fb',
                        color: '#0072b0',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      ✓ Already Planned
                    </div>
                  );
                }

                if (!available) {
                  return (
                    <div
                      key={year}
                      style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '6px',
                        padding: '10px',
                        textAlign: 'center',
                        backgroundColor: '#f8f8f8',
                        color: '#bbb',
                        fontSize: '12px',
                        cursor: 'default',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ fontSize: '18px', lineHeight: 1 }}>⊘</div>
                      <div style={{ marginTop: '2px' }}>Not Available</div>
                    </div>
                  );
                }

                return (
                  <button
                    key={year}
                    onClick={() => handleSelect(year, term)}
                    style={{
                      border: '1px solid #50b95b',
                      borderRadius: '6px',
                      padding: '10px',
                      textAlign: 'center',
                      backgroundColor: '#f0fbf1',
                      color: '#2e7d32',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontFamily: 'Open Sans, sans-serif',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#50b95b';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0fbf1';
                      e.currentTarget.style.color = '#2e7d32';
                    }}
                  >
                    <div style={{ fontSize: '18px', lineHeight: 1 }}>+</div>
                    <div style={{ marginTop: '2px', fontWeight: 600 }}>Campus Or Online</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #eee', padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#555',
              fontFamily: 'Open Sans, sans-serif',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
