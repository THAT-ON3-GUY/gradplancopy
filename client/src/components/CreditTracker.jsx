export default function CreditTracker({ earned, total }) {
  const pct = Math.min((earned / total) * 100, 100);
  const done = earned >= total;

  return (
    <div style={{ backgroundColor: '#006ca5', padding: '12px 16px' }}>
      {/* Label row */}
      <div className="flex justify-between items-baseline mb-1">
        <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Credits Planned
        </span>
        <div className="flex items-baseline gap-0">
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', paddingRight: '6px' }}>of {total}</span>
          <span
            style={{
              fontSize: '27px',
              fontWeight: 300,
              color: done ? '#a0f0a0' : '#fff',
              lineHeight: 1,
              paddingLeft: '6px',
              borderLeft: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {earned}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
        <div
          style={{
            height: '4px',
            width: `${pct}%`,
            backgroundColor: done ? '#a0f0a0' : '#50b95b',
            borderRadius: '2px',
            transition: 'width 0.5s',
          }}
        />
      </div>

      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
        {Math.max(total - earned, 0)} credits remaining to graduate
      </p>
    </div>
  );
}
