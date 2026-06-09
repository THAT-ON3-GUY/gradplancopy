export default function Header({ majors, selectedMajorId, onMajorChange, onValidate, validating }) {
  return (
    <nav className="flex items-center px-4 shadow-md z-20 relative" style={{ backgroundColor: '#006ca5', minHeight: '54px' }}>
      {/* Logo area */}
      <div className="flex items-center gap-3 mr-6">
        <div className="flex flex-col leading-none py-2">
          <span className="text-white font-bold text-base tracking-wide">BYU–IDAHO</span>
          <span className="text-blue-200 text-[10px] uppercase tracking-widest font-semibold">I-Plan · Grad Planner</span>
        </div>
      </div>

      {/* Nav divider */}
      <div className="h-8 w-px bg-blue-400 mr-6" />

      {/* Degree selector */}
      <div className="flex items-center gap-2 flex-1">
        <label className="text-blue-200 text-xs whitespace-nowrap uppercase tracking-wide font-semibold">Degree:</label>
        <select
          value={selectedMajorId ?? ''}
          onChange={(e) => onMajorChange(parseInt(e.target.value))}
          className="text-sm rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white border-0"
          style={{ backgroundColor: '#005a8e', color: '#fff', minWidth: '200px' }}
        >
          {majors.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Validate button */}
      <button
        onClick={onValidate}
        disabled={validating}
        className="ml-4 text-sm font-semibold px-5 py-1.5 rounded transition-colors disabled:opacity-60"
        style={{ backgroundColor: '#50b95b', color: '#fff' }}
        onMouseEnter={e => e.target.style.backgroundColor = '#3da348'}
        onMouseLeave={e => e.target.style.backgroundColor = '#50b95b'}
      >
        {validating ? 'Validating…' : 'Validate Plan'}
      </button>

      {/* User area */}
      <div className="ml-4 flex items-center gap-2 border-l border-blue-400 pl-4">
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm font-bold">S</div>
        <span className="text-white text-sm hidden md:block">Student</span>
      </div>
    </nav>
  );
}
