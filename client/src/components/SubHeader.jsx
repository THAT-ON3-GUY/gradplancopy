export default function SubHeader({ planned, total, onSeeDetails }) {
  const unplanned = Math.max(total - planned, 0);

  const Stat = ({ label, value, color }) => (
    <div className="text-center px-4 border-r border-gray-200 last:border-0">
      <div style={{ fontSize: '11px', color: '#888', fontWeight: 400, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 300, lineHeight: 1, color }}>{value}</div>
    </div>
  );

  return (
    <div className="bg-white border-b border-gray-200 shrink-0" style={{ minHeight: '64px' }}>
      <div className="flex items-center px-4 h-full gap-4" style={{ minHeight: '64px' }}>
        {/* MY PLANS button */}
        <button
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded shrink-0"
          style={{ backgroundColor: '#515252' }}
        >
          <span>≡</span>
          MY PLANS
        </button>

        {/* Alerts / Messages / Help */}
        <div className="flex items-center gap-4 text-sm text-gray-600 border-r border-gray-200 pr-4">
          <button className="flex items-center gap-1 hover:text-gray-900">
            <span className="relative">
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">3</span>
            </span>
            <span>Alerts</span> <span className="text-xs">▾</span>
          </button>
          <button className="flex items-center gap-1 hover:text-gray-900">💬 <span>Messages</span> <span className="text-xs">▾</span></button>
          <button className="flex items-center gap-1 hover:text-gray-900">❓ <span>Help</span></button>
        </div>

        {/* Credit stats */}
        <div className="flex items-center ml-auto">
          <Stat label="Completed" value="0" color="#0072b0" />
          <Stat label="In-Progress" value="0" color="#008fdd" />
          <Stat label="Planned" value={planned} color="#50b95b" />
          <Stat label="Unplanned" value={unplanned} color="#888" />
          <div className="text-center px-4">
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Total</div>
            <div style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1, color: '#000' }}>{total}</div>
          </div>
          <button
            onClick={onSeeDetails}
            className="flex items-center gap-1 text-sm font-semibold ml-2 hover:underline"
            style={{ color: '#006ca5' }}
          >
            SEE DETAILS <span>▾</span>
          </button>
        </div>
      </div>
    </div>
  );
}
