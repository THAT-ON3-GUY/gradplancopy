import { getSemesterStatus } from './Planner/PlannedCourseCard';

// Computes credit totals for a set of planCourses
function computeTotals(planCourses, courseIds) {
  const subset = courseIds
    ? planCourses.filter((pc) => courseIds.has(pc.course.id))
    : planCourses;

  let completed = 0, inProgress = 0, planned = 0;
  for (const pc of subset) {
    const cr = pc.planned_credits ?? pc.course.credits;
    const st = getSemesterStatus(pc.semester_year, pc.semester_term);
    if (st === 'completed') completed += cr;
    else if (st === 'enrolled') inProgress += cr;
    else planned += cr;
  }
  return { completed, inProgress, planned };
}

export default function SeeDetailsPanel({ planCourses, requirements, transferCredits, total, onClose }) {
  const transferTotal = transferCredits.reduce((s, tc) => s + tc.credits, 0);

  // Build a row per requirement category + transfer credits + total
  const rows = requirements.map((group) => {
    const ids = new Set(group.courses.map((c) => c.id));
    const { completed, inProgress, planned } = computeTotals(planCourses, ids);
    const categoryTotal = group.courses.reduce((s, c) => s + c.credits, 0) + (group.required_credits ?? 0);
    const unplanned = Math.max(categoryTotal - completed - inProgress - planned, 0);
    return { label: group.category, completed, inProgress, planned, unplanned, total: categoryTotal };
  });

  // Grand totals from plan
  const { completed: gc, inProgress: gi, planned: gp } = computeTotals(planCourses, null);
  const gTotal = total;
  const gUnplanned = Math.max(gTotal - gc - gi - gp, 0);

  const ColHead = ({ children, color }) => (
    <th style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: color ?? '#555', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right', whiteSpace: 'nowrap' }}>
      {children}
    </th>
  );
  const Cell = ({ value, color }) => (
    <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: '14px', fontWeight: value > 0 ? 600 : 400, color: value > 0 ? (color ?? '#333') : '#bbb' }}>
      {value}
    </td>
  );

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Credit Details</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888' }}
          >
            ×
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Category
                </th>
                <ColHead color="#0072b0">Completed</ColHead>
                <ColHead color="#008fdd">In-Progress</ColHead>
                <ColHead color="#50b95b">Planned</ColHead>
                <ColHead color="#888">Unplanned</ColHead>
                <ColHead color="#000">Total</ColHead>
              </tr>
            </thead>
            <tbody>
              {/* Transfer credits row */}
              {transferTotal > 0 && (
                <tr style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: '#f9f9f9' }}>
                  <td style={{ padding: '8px 12px', fontSize: '13px', color: '#333', fontWeight: 500 }}>
                    Transfer Credits
                  </td>
                  <Cell value={transferTotal} color="#0072b0" />
                  <Cell value={0} />
                  <Cell value={0} />
                  <Cell value={0} />
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#000' }}>
                    {transferTotal}
                  </td>
                </tr>
              )}

              {/* One row per requirement category */}
              {rows.map((row, i) => (
                <tr key={row.label} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '8px 12px', fontSize: '13px', color: '#333' }}>{row.label}</td>
                  <Cell value={row.completed} color="#0072b0" />
                  <Cell value={row.inProgress} color="#008fdd" />
                  <Cell value={row.planned} color="#50b95b" />
                  <Cell value={row.unplanned} color="#888" />
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#000' }}>
                    {row.total}
                  </td>
                </tr>
              ))}

              {/* Grand total row */}
              <tr style={{ borderTop: '2px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
                <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 700, color: '#000' }}>Total</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: '#0072b0' }}>{gc}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: '#008fdd' }}>{gi}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: '#50b95b' }}>{gp}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: '#888' }}>{gUnplanned}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: '#000' }}>{gTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '11px', color: '#666' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0072b0', display: 'inline-block' }} />
            Completed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#008fdd', display: 'inline-block' }} />
            In-Progress / Enrolled
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#50b95b', display: 'inline-block' }} />
            Planned
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ccc', display: 'inline-block' }} />
            Unplanned
          </span>
        </div>
      </div>
    </div>
  );
}
