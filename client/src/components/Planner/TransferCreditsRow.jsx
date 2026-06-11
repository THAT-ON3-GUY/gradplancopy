import { useState } from 'react';

export default function TransferCreditsRow({ transferCredits = [] }) {
  const [open, setOpen] = useState(false);

  const totalCredits = transferCredits.reduce((s, tc) => s + tc.credits, 0);

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '15px', color: '#006ca5', fontWeight: 600 }}>
          Transferred Credits ({totalCredits} Credit{totalCredits !== 1 ? 's' : ''})
        </span>
        <span style={{ fontSize: '14px', color: '#888', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: '4px 20px 20px' }}>
          {transferCredits.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>No transfer credits on file.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
              }}
            >
              {transferCredits.map((tc) => (
                <TransferCourseCard key={tc.id} tc={tc} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TransferCourseCard({ tc }) {
  return (
    <div
      style={{
        backgroundColor: '#0072b0',
        borderRadius: '10px',
        height: '64px',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      {/* Left — info icon area */}
      <div
        style={{
          width: '44px',
          borderRight: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" width="18" height="18" opacity="0.85">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>

      {/* Middle — name + code */}
      <div
        style={{
          flex: 1,
          padding: '8px 10px',
          borderRight: '1px solid rgba(255,255,255,0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.2,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {tc.name}
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '10px',
            fontWeight: 600,
            marginTop: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}
        >
          {tc.code}
        </div>
      </div>

      {/* Right — credits */}
      <div
        style={{
          width: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 400 }}>{tc.credits}</span>
      </div>
    </div>
  );
}
