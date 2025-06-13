import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import SceneBoard from '/components/SceneBoard';
import '../../src/index.css';

const SceneBoardPage = () => {
  const raw = sessionStorage.getItem('capturedImages');
  const images = raw ? JSON.parse(raw).map((r) => `http://localhost:3001${r.file}`) : [];

  return (
    <div style={styles.page}>
      <Nav />
      <h1 style={styles.title}>🧩 Scene Template Board</h1>
      <p style={styles.subtitle}>Organize screenshots in a visual storyboard layout for marketing or presentation use.</p>
      
      <SceneBoard images={images} layout="template" />

      <div style={styles.linkBox}>
        <Link to="/export" style={styles.link}>
          ➡️ Export This Scene
        </Link>
      </div>
    </div>
  );
};

const styles = {
page: {
  backgroundColor: '#1e1e1e',
  minHeight: '100vh',
  padding: '2rem',
  fontFamily: `'Courier New', Courier, monospace`,
  color: '#f0c36d',
  display: 'flex',
  flexDirection: 'column',
},

  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#aaa',
    marginBottom: '2rem',
  },
  linkBox: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  link: {
    color: '#f0c36d',
    fontSize: '1.2rem',
    textDecoration: 'underline',
  },
};

export default SceneBoardPage;
