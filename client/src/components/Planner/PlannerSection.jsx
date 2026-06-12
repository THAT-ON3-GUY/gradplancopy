import YearRow from './YearRow';
import TransferCreditsRow from './TransferCreditsRow';

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
  { year: 2028, term: 'Winter' },
  { year: 2028, term: 'Spring' },
];

export default function PlannerSection({
  planCourses,
  transferCredits,
  onRemoveCourse,
  onViewDetails,
  onMoveCourse,
  onAdjustCredits,
  onValidate,
  validating,
  validation,
}) {
  const years = [...new Set(SEMESTERS.map((s) => s.year))];

  return (
    <div style={{ flex: '1 1 0', minWidth: 0, overflowY: 'auto', padding: '24px 24px 48px' }}>
      {/* Plan name heading */}
      <div style={{ marginBottom: '4px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Plan Name
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#000', margin: 0 }}>Graduation Plan</h1>
        <span style={{ fontSize: '14px', color: '#50b95b', fontWeight: 600 }}>Declared Plan</span>
      </div>

      {/* My Plan meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>My Plan</h2>
          <div>
            <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Credits Per Semester
            </div>
            <div style={{ fontSize: '14px', color: '#333' }}>
              12–16 credit(s){' '}
              <span style={{ color: '#006ca5', cursor: 'pointer' }}>Edit</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#006ca5' }}>
          <button style={{ background: 'none', border: 'none', color: '#006ca5', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '13px' }}>
            Copy Planning
          </button>
          <button style={{ background: 'none', border: 'none', color: '#006ca5', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '13px' }}>
            ⬇ Download PDF
          </button>
        </div>
      </div>

      {/* Transferred Credits row */}
      <TransferCreditsRow transferCredits={transferCredits} />

      {/* Validation banner */}
      {validation && (
        <div
          style={{
            marginBottom: '12px',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            backgroundColor: validation.valid ? '#e8f5e9' : '#fff3e0',
            border: `1px solid ${validation.valid ? '#81c784' : '#ffb74d'}`,
            color: validation.valid ? '#2e7d32' : '#e65100',
          }}
        >
          {validation.valid ? (
            '✅ Your plan looks great! All prerequisites are satisfied.'
          ) : (
            <div>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>⚠️ Prerequisite issues found:</div>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                {validation.issues.map((issue, i) => (
                  <li key={i}>{issue.issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Year rows */}
      {years.map((year) => (
        <YearRow
          key={year}
          year={year}
          semesters={SEMESTERS.filter((s) => s.year === year)}
          planCourses={planCourses}
          onRemoveCourse={onRemoveCourse}
          onViewDetails={onViewDetails}
          onMoveCourse={onMoveCourse}
          onAdjustCredits={onAdjustCredits}
        />
      ))}

      {/* Add Calendar Year */}
      <button
        style={{
          fontSize: '13px', color: '#006ca5', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '24px',
          fontFamily: 'Open Sans, sans-serif',
        }}
      >
        + Add Calendar Year
      </button>

      {/* All Classes Planned? + VALIDATE */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '10px' }}>
          All Classes Planned?
        </div>
        <button
          onClick={onValidate}
          disabled={validating}
          style={{
            backgroundColor: '#50b95b',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            padding: '16px 80px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.08em',
            minWidth: '400px',
            fontFamily: 'Open Sans, sans-serif',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3da348')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#50b95b')}
        >
          {validating ? 'VALIDATING…' : 'VALIDATE'}
        </button>
      </div>

      {/* Bottom links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#006ca5', marginTop: '16px' }}>
        <button
          style={{ background: 'none', border: 'none', color: '#006ca5', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          🕐 View Plan History
        </button>
        <button
          style={{ background: 'none', border: 'none', color: '#006ca5', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ↺ Reset My Plan
        </button>
      </div>
    </div>
  );
}
