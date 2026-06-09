export default function Header({ majors, selectedMajorId, onMajorChange, onValidate, validating, validation }) {
  return (
    <header className="bg-byui-navy text-white shadow-md z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col leading-tight">
            <span className="text-byui-gold font-bold text-lg tracking-wide">BYU–IDAHO</span>
            <span className="text-xs text-blue-200 uppercase tracking-widest">Graduation Planner</span>
          </div>
        </div>

        {/* Major selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-blue-200 whitespace-nowrap">Degree Program:</label>
          <select
            value={selectedMajorId ?? ''}
            onChange={(e) => onMajorChange(parseInt(e.target.value))}
            className="bg-byui-navyDark border border-blue-500 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-byui-gold"
          >
            {majors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Validate button */}
        <button
          onClick={onValidate}
          disabled={validating}
          className="bg-byui-gold hover:bg-byui-goldDark text-byui-navy font-semibold text-sm px-5 py-1.5 rounded transition-colors disabled:opacity-60"
        >
          {validating ? 'Validating…' : 'Validate Plan'}
        </button>
      </div>
    </header>
  );
}
