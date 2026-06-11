import { useState, useRef, useEffect } from 'react';
import NavMenuDropdown from './NavMenuDropdown';

export default function Navbar({ studentName = 'Student' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click is handled by the backdrop in NavMenuDropdown
  // but we still need the ref for the button container for correct positioning

  return (
    <nav
      style={{ backgroundColor: '#000', minHeight: '50px', position: 'relative', zIndex: 100 }}
      className="flex items-center px-4 justify-between shrink-0"
    >
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
        {/* Menu button with dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 text-white text-sm border border-gray-600 rounded px-3 py-1 hover:border-gray-400"
            style={{ backgroundColor: menuOpen ? '#1a1a1a' : 'transparent' }}
          >
            {/* 3x3 grid icon */}
            <svg viewBox="0 0 18 18" width="16" height="16" fill="white">
              <rect x="0" y="0" width="4" height="4" rx="1"/>
              <rect x="7" y="0" width="4" height="4" rx="1"/>
              <rect x="14" y="0" width="4" height="4" rx="1"/>
              <rect x="0" y="7" width="4" height="4" rx="1"/>
              <rect x="7" y="7" width="4" height="4" rx="1"/>
              <rect x="14" y="7" width="4" height="4" rx="1"/>
              <rect x="0" y="14" width="4" height="4" rx="1"/>
              <rect x="7" y="14" width="4" height="4" rx="1"/>
              <rect x="14" y="14" width="4" height="4" rx="1"/>
            </svg>
            <span>Menu</span>
            <span style={{ fontSize: '10px', transform: menuOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▾</span>
          </button>

          {menuOpen && <NavMenuDropdown onClose={() => setMenuOpen(false)} />}
        </div>

        {/* Help button */}
        <button className="w-7 h-7 rounded-full border border-gray-500 text-white text-sm flex items-center justify-center hover:border-gray-300">
          ?
        </button>

        {/* User avatar */}
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
