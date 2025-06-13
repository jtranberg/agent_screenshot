import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [open, setOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setOpen(!mobile); // open by default on desktop
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav style={styles.nav}>
      <div style={styles.header}>
        <span style={styles.logo}>🕵️‍♂️ Agent Screenshot</span>
        {isMobile && (
          <button style={styles.toggle} onClick={() => setOpen((prev) => !prev)}>
            ☰
          </button>
        )}
      </div>

      {open && (
        <div style={styles.links(isMobile)}>
          <Link to="/" style={styles.link}>🏠 Capture</Link>
          <Link to="/device" style={styles.link}>📱 Devices</Link>
          <Link to="/scene" style={styles.link}>🧩 Scene</Link>
          <Link to="/export" style={styles.link}>💾 Export</Link>
          <Link to="/export-images" style={styles.link}>🧲 Export Raw</Link>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    width: '100%',
    backgroundColor: '#1c1c1c',
    color: '#f0c36d',
    padding: '1rem',
    fontFamily: `'Courier New', Courier, monospace`,
    boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
    zIndex: 1000,
    position: 'sticky',
    top: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  toggle: {
    background: 'none',
    border: '2px dashed #f0c36d',
    color: '#f0c36d',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem 0.75rem',
    borderRadius: '6px',
  },
  links: (isMobile) => ({
  marginTop: '1rem',
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  gap: '1.5rem',
  flexWrap: 'wrap',
  alignItems: 'center',
}),

  link: {
    color: '#f0c36d',
    textDecoration: 'none',
    fontSize: '1rem',
    borderBottom: '1px dashed #f0c36d',
  },
};

export default Nav;
