// Unplanned-style card used in drag overlay and catalog
export default function CourseChip({ course, isDragging = false }) {
  return (
    <div
      style={{
        height: '48px',
        borderRadius: '10px',
        backgroundColor: '#e8e8e8',
        border: '1px solid #d1d2d2',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        width: '100%',
        boxShadow: isDragging ? '0 6px 12px rgba(0,0,0,0.2)' : 'none',
        transform: isDragging ? 'rotate(1deg) scale(1.03)' : 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Left icon area */}
      <div style={{ width: '36px', height: '48px', borderRight: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: '#888' }}>+</span>
      </div>
      {/* Detail */}
      <div style={{ flex: 1, padding: '6px 10px', overflow: 'hidden' }}>
        <div style={{ fontWeight: 600, fontSize: '12px', color: '#515252', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.code}</div>
        <div style={{ fontSize: '10px', color: '#6f6f70', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.name}</div>
      </div>
      {/* Credits */}
      <div style={{ width: '36px', height: '48px', borderLeft: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#515252', lineHeight: 1 }}>{course.credits}</div>
          <div style={{ fontSize: '8px', color: '#888', textTransform: 'uppercase', lineHeight: 1 }}>cr</div>
        </div>
      </div>
    </div>
  );
}
