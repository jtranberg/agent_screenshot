import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import DeviceMockup from '/components/DeviceMockup';
import '../../src/index.css';


const ExportTogglePage = () => {
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [viewMode, setViewMode] = useState('raw'); // 'raw' or 'device'

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
      link.download = `export-${viewMode}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };

  return (
    <div style={styles.page}>
      <Nav />
      <h1 style={styles.title}>
        🖼️ Export: {viewMode === 'raw' ? 'Raw Images' : 'Device Mockups'}
      </h1>

      <div style={styles.toggle}>
        <button
          onClick={() => setViewMode('raw')}
          style={{
            ...styles.toggleButton,
            backgroundColor: viewMode === 'raw' ? '#f0c36d' : '#333',
          }}
        >
          Template View
        </button>
        <button
          onClick={() => setViewMode('device')}
          style={{
            ...styles.toggleButton,
            backgroundColor: viewMode === 'device' ? '#f0c36d' : '#333',
          }}
        >
          Device View
        </button>
      </div>

      <div ref={containerRef} style={styles.grid}>
  {images.map((img, i) =>
    viewMode === 'raw' ? (
      <img key={i} src={img} alt={`Raw ${i}`} style={styles.image} />
    ) : (
      <div key={i} style={styles.deviceWrapper}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <DeviceMockup image={img} label={`Page ${i + 1}`} />
        </div>
      </div>
    )
  )}
</div>


      <button style={styles.button} onClick={handleExport}>
        📥 Download {viewMode === 'raw' ? 'Raw' : 'Device'} View
      </button>

      <Link to="/" style={styles.link}>
        ⬅️ Back to Capture
      </Link>
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
    overflowX: 'hidden',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  toggle: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  toggleButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    cursor: 'pointer',
    fontWeight: 'bold',
    minWidth: '150px',
  },
 grid: {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
  padding: '2rem',
  margin: '0 auto',
  width: '100%',
  maxWidth: '1600px',
  boxSizing: 'border-box',
  background: '#1c1c1c',
  borderRadius: '12px',
  border: '2px dashed #333',
},

  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    objectFit: 'contain',
    boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
    backgroundColor: '#000',
  },
deviceWrapper: {
  flex: '0 1 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '100%',
  padding: '1rem',
  boxSizing: 'border-box',
},




  button: {
    display: 'block',
    margin: '2rem auto',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f0c36d',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  link: {
    display: 'block',
    textAlign: 'center',
    color: '#f0c36d',
    marginTop: '1rem',
  },
};


export default ExportTogglePage;
