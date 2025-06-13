// src/pages/DevicePage.jsx
import DeviceMockup from '/components/DeviceMockup';
import Nav from '/components/Nav';
import '../../src/index.css';

const DevicePage = () => {
  const raw = sessionStorage.getItem('capturedImages');
  const images = raw ? JSON.parse(raw).map((r) => `http://localhost:3001${r.file}`) : [];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#f0c36d' }}>
        <Nav />
      <h1 style={{ textAlign: 'center' }}>Device Preview</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
        {images.map((img, i) => (
          <DeviceMockup key={i} image={img} device={i % 2 === 0 ? 'laptop' : 'phone'} label={`Page ${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default DevicePage;
