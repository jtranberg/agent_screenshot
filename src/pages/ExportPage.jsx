import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import DeviceMockup from '../../components/DeviceMockup';
import { Link } from 'react-router-dom';
import Nav from '/components/Nav';

const ExportPage = () => {
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [layout, setLayout] = useState('device'); // 'device' or 'template'

  useEffect(() => {
    const raw = sessionStorage.getItem('capturedImages');
    if (raw) {
      const parsed = JSON.parse(raw);
      const formatted = parsed.map((r) => `http://localhost:3001${r.file}`);
      setImages(formatted);
    }
  }, []);

  const handleExport = async () => {
    if (!containerRef.current) return;

    try {
      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        scale: 1.5,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to generate image.');
          return;
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `scene-board-${layout}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <Nav />
      <h1 style={styles.title}>Export Scene Board</h1>

      {/* Layout Toggle */}
      <div style={styles.toggleBox}>
        <span>Export Style: </span>
        <button
          onClick={() => setLayout('device')}
          style={layout === 'device' ? styles.activeToggle : styles.toggle}
        >
          Device View
        </button>
        <button
          onClick={() => setLayout('template')}
          style={layout === 'template' ? styles.activeToggle : styles.toggle}
        >
          Template View
        </button>
      </div>

      {/* Export Preview Area */}
      <div ref={containerRef} style={styles.board}>
        {images.map((img, i) =>
          layout === 'device' ? (
            <DeviceMockup key={i} image={img} label={`Page ${i + 1}`} />
          ) : (
            <div key={i} style={styles.templateTile}>
              <img src={img} alt={`Scene ${i}`} style={styles.image} />
              <div style={styles.label}>Page {i + 1}</div>
            </div>
          )
        )}
      </div>

      {/* Export Button */}
      <button style={styles.button} onClick={handleExport}>
        📥 Download Board as PNG
      </button>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/scene" style={{ color: '#f0c36d' }}>
          🔙 Back to Scene Board
        </Link>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#121212',
    color: '#f0c36d',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: `'Courier New', Courier, monospace`,
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  toggleBox: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  toggle: {
    margin: '0 0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #555',
    backgroundColor: '#222',
    color: '#f0c36d',
    cursor: 'pointer',
  },
  activeToggle: {
    margin: '0 0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '2px solid #f0c36d',
    backgroundColor: '#333',
    color: '#f0c36d',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  board: {
    width: '100%',
    maxWidth: '1300px',
    margin: '0 auto',
    backgroundColor: '#1c1c1c',
    border: '2px dashed #333',
    borderRadius: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  templateTile: {
    width: '300px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 8px rgba(0,0,0,0.5)',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  label: {
    padding: '0.5rem',
    color: '#f0c36d',
    fontSize: '1rem',
    backgroundColor: '#000',
    fontFamily: `'Courier New', Courier, monospace`,
  },
  button: {
    display: 'block',
    margin: '2rem auto 0',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f0c36d',
    color: '#000',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.6)',
  },
};

export default ExportPage;
