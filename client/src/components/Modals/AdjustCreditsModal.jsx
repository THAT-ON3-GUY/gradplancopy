import { useState } from 'react';

export default function AdjustCreditsModal({ planCourse, onSave, onClose }) {
  const { course, plan_course_id } = planCourse;
  const current = planCourse.planned_credits ?? course.credits;
  const [credits, setCredits] = useState(current);

  const handleSave = () => {
    const val = parseInt(credits, 10);
    if (!val || val < 1 || val > 20) return;
    onSave(plan_course_id, val);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '380px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ backgroundColor: '#006ca5', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{course.code}</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>Adjust Credits</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px', margin: '0 0 16px' }}>
            {course.name} is a variable-credit course. Enter the number of credits you plan to earn.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setCredits((c) => Math.max(1, parseInt(c) - 1))}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '1px solid #ccc', background: 'none', cursor: 'pointer',
                fontSize: '20px', lineHeight: 1, color: '#333',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              −
            </button>

            <input
              type="number"
              min={1}
              max={20}
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              style={{
                width: '80px', textAlign: 'center', fontSize: '32px', fontWeight: 300,
                border: '1px solid #ccc', borderRadius: '6px', padding: '8px',
                fontFamily: 'Open Sans, sans-serif', color: '#000',
              }}
            />

            <button
              onClick={() => setCredits((c) => Math.min(20, parseInt(c) + 1))}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '1px solid #ccc', background: 'none', cursor: 'pointer',
                fontSize: '20px', lineHeight: 1, color: '#333',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '8px' }}>
            credit{credits !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #eee', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px', borderRadius: '4px',
              border: '1px solid #ccc', background: 'none',
              cursor: 'pointer', fontSize: '13px', color: '#555',
              fontFamily: 'Open Sans, sans-serif',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 24px', borderRadius: '4px',
              border: 'none', backgroundColor: '#006ca5',
              color: '#fff', cursor: 'pointer', fontSize: '13px',
              fontWeight: 600, fontFamily: 'Open Sans, sans-serif',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
