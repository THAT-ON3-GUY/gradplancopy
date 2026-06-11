export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#000',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        borderTop: '1px solid #222',
      }}
    >
      {/* Left links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        {['ABOUT', 'CONTACT', 'HELP'].map((label, i) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <span style={{ color: '#444', margin: '0 8px', fontSize: '12px' }}>|</span>}
            <a
              href="#"
              style={{ color: '#aaa', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.05em' }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => (e.target.style.color = '#aaa')}
            >
              {label}
            </a>
          </span>
        ))}
      </div>

      {/* Right — copyright */}
      <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.04em' }}>
        © 2013 BRIGHAM YOUNG UNIVERSITY IDAHO &nbsp; 6.0.7.541
      </div>
    </footer>
  );
}
