import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../../components/nav';

const CapturePage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCapture = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://agent-screenshot-backend.onrender.com/scrape", {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, maxPages: 5 }),
      });

      const data = await res.json();
      sessionStorage.setItem('capturedImages', JSON.stringify(data.results));
      navigate('/scene');
    } catch (err) {
      console.error(err);
      alert('Failed to capture screenshots.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Nav />
      <h1 style={styles.title}>🕵️‍♂️ Agent-Screenshot: Capturing Intel</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://target-website.com"
        style={styles.input}
      />
      <button onClick={handleCapture} style={styles.button}>
        {loading ? 'Scanning...' : '🧠 Capture Screens'}
      </button>

      {/* <div style={styles.links}>
        <Link to="/scene" style={styles.link}>🧩 Scene Board</Link>
        <Link to="/export" style={styles.link}>💾 Export Evidence</Link>
      </div> */}
    </div>
  );
};

const styles = {
 page: {
  width: '100vw',
  height: '100vh',
  backgroundColor: '#121212',
  color: '#f0c36d',
  padding: '3rem 1rem',
  fontFamily: `'Courier New', Courier, monospace`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  overflow: 'auto',
},

  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textShadow: '2px 2px #000',
  },
  input: {
    width: '80%',
    maxWidth: '600px',
    padding: '1rem',
    fontSize: '1rem',
    backgroundColor: '#1c1c1c',
    color: '#f0c36d',
    border: '2px dashed #444',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#f0c36d',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.6)',
    marginBottom: '2rem',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  link: {
    color: '#f0c36d',
    textDecoration: 'none',
    fontSize: '1rem',
    borderBottom: '1px dashed #f0c36d',
  },
};

export default CapturePage;
