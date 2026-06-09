export default function Navbar({ studentName = 'Student' }) {
  return (
    <nav style={{ backgroundColor: '#000', minHeight: '50px' }} className="flex items-center px-4 justify-between shrink-0">
      {/* Left — logo + I-Plan */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col leading-none border-r border-gray-600 pr-3 mr-1">
          <span className="text-white font-extrabold text-base tracking-tight">BYU</span>
          <span className="text-white font-light text-[10px] tracking-widest uppercase">IDAHO</span>
        </div>
        <span className="text-white text-lg font-light tracking-wide">I-Plan</span>
      </div>

      {/* Right — Menu + Help + User */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-white text-sm border border-gray-600 rounded px-3 py-1 hover:border-gray-400">
          <span className="text-base">⋮⋮⋮</span>
          <span>Menu</span>
          <span className="text-xs">▾</span>
        </button>
        <button className="w-7 h-7 rounded-full border border-gray-500 text-white text-sm flex items-center justify-center hover:border-gray-300">?</button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
            <span>S</span>
          </div>
          <div className="text-white text-xs leading-tight">
            <div className="text-gray-400 text-[10px]">Hello,</div>
            <div className="font-medium">{studentName}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
