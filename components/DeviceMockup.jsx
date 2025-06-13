import React, { useState, useEffect, useRef } from 'react';
import '../src/index.css';
import Nav from '../../components/nav';

const DeviceMockup = ({ image, label }) => {
  const imgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

 useEffect(() => {
  const imgElement = imgRef.current;

  const handleLoad = () => {
    if (imgElement) {
      const { naturalWidth, naturalHeight } = imgElement;
      const maxWidth = 600;
      const scale = maxWidth / naturalWidth;
      const width = maxWidth;
      const height = naturalHeight * scale;
      setDimensions({ width, height });
    }
  };

  if (imgElement?.complete) {
    handleLoad();
  } else {
    imgElement?.addEventListener('load', handleLoad);
  }

  return () => {
    <Nav />
    imgElement?.removeEventListener('load', handleLoad);
  };
}, [image]);

  const frameStyle = {
    border: '12px solid #333',
    borderRadius: '20px',
    padding: '1rem',
    backgroundColor: '#000',
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    display: 'block',
  };

  const labelStyle = {
    marginTop: '0.5rem',
    color: '#f0c36d',
    fontSize: '1rem',
    fontFamily: `'Courier New', Courier, monospace`,
    textAlign: 'center',
  };

  return (
    <div style={{ margin: '2rem', textAlign: 'center' }}>
      <div style={frameStyle}>
        <img ref={imgRef} src={image} alt={label || 'mockup'} style={imageStyle} />
      </div>
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};

export default DeviceMockup;
