// Icons as simple inline SVGs
const icons = {
  Home: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  'Academic Preparation': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-7 8.35V15l7 3.83 7-3.83v-3.65L12 15l-7-3.65z"/>
    </svg>
  ),
  'Career Exploration': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.37 1 13 1c-1.4 0-3.05.61-3.89 2.1L8 5H4C2.9 5 2 5.9 2 7v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-3c1.3 0 3 .77 3 2.66 0 .49-.06.97-.14 1.34h-5.72c.37-1.12.54-2.5.54-4H15z"/>
    </svg>
  ),
  'Grad Planner': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  ),
  'Employment Preparation': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M20 6H16V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
  ),
  Tutoring: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
  ),
  'Academic Advising': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  'Graduation Application': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    </svg>
  ),
  'Internship Approval': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>
    </svg>
  ),
  'Class Schedule Tool': (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-8h4v4h-4z"/>
    </svg>
  ),
};

const MENU_ITEMS = [
  'Home',
  'Academic Preparation',
  'Career Exploration',
  'Grad Planner',
  'Employment Preparation',
  'Tutoring',
  'Academic Advising',
  'Graduation Application',
  'Internship Approval',
  'Class Schedule Tool',
];

export default function NavMenuDropdown({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 999 }}
      />

      {/* Dropdown panel */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderRadius: '4px',
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 100px)',
          gap: '4px',
          minWidth: '428px',
          marginTop: '4px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 8px',
              borderRadius: '6px',
              border: '1px solid transparent',
              backgroundColor: item === 'Grad Planner' ? '#006ca5' : 'transparent',
              color: item === 'Grad Planner' ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.3,
              fontFamily: 'Open Sans, sans-serif',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (item !== 'Grad Planner') {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.borderColor = '#ddd';
              }
            }}
            onMouseLeave={(e) => {
              if (item !== 'Grad Planner') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
          >
            <span style={{ color: item === 'Grad Planner' ? '#fff' : '#555' }}>
              {icons[item]}
            </span>
            <span>{item}</span>
          </button>
        ))}
      </div>
    </>
  );
}
