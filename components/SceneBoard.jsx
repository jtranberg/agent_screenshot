// SceneBoard updated: crops correct image pixels using scale and sticky in-tile toolbar
import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import '../src/index.css';

const SceneBoard = ({ images = [], layout = 'template' }) => {
  const [editStates, setEditStates] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectStart, setSelectStart] = useState(null);
  const [selectModeIndex, setSelectModeIndex] = useState(null);
  const boardRef = useRef();
  const tileRefs = useRef({});

  useEffect(() => {
    if (images.length > 0) {
      setEditStates(
        images.map((img, i) => ({
          url: img,
          opacity: 1,
          zIndex: i + 1,
          showToolbar: false,
          width: 350,
          height: 200,
          x: 50 + i * 20,
          y: 50 + i * 20,
        }))
      );
    }
  }, [images]);

  const updateState = (index, newProps) => {
    setEditStates((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newProps };
      return copy;
    });
  };

  const handleDelete = (index) => {
    setEditStates((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const updatedRefs = {};
      updated.forEach((_, i) => {
        updatedRefs[i] = tileRefs.current[i];
      });
      tileRefs.current = updatedRefs;
      return updated;
    });
  };

  const bringToFront = (index) => {
    const maxZ = Math.max(...editStates.map((s) => s.zIndex || 1));
    updateState(index, { zIndex: maxZ + 1 });
  };

  const sendToBack = (index) => {
    const minZ = Math.min(...editStates.map((s) => s.zIndex || 1));
    updateState(index, { zIndex: minZ - 1 });
  };

  const startSelect = (e, index) => {
    if (selectModeIndex !== index) return;
    e.stopPropagation();
    const rect = tileRefs.current[index].getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setSelectStart({ x: startX, y: startY });
    setSelectionBox({ x: startX, y: startY, width: 0, height: 0 });
  };

  const duringSelect = (e, index) => {
    if (selectModeIndex !== index || !selectStart) return;
    const rect = tileRefs.current[index].getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const width = Math.abs(currentX - selectStart.x);
    const height = Math.abs(currentY - selectStart.y);
    const x = Math.min(currentX, selectStart.x);
    const y = Math.min(currentY, selectStart.y);
    setSelectionBox({ x, y, width, height });
  };

  const endSelect = () => {
    setSelectStart(null);
  };

  const cropToNewTile = (index) => {
    if (selectionBox === null || selectModeIndex !== index) return;
    const canvas = document.createElement('canvas');
    canvas.width = selectionBox.width;
    canvas.height = selectionBox.height;
    const ctx = canvas.getContext('2d');

    const tile = editStates[index];
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const imageElement = tileRefs.current[index].querySelector('img');
      const scaleX = image.naturalWidth / imageElement.clientWidth;
      const scaleY = image.naturalHeight / imageElement.clientHeight;

      ctx.drawImage(
        image,
        selectionBox.x * scaleX,
        selectionBox.y * scaleY,
        selectionBox.width * scaleX,
        selectionBox.height * scaleY,
        0,
        0,
        selectionBox.width,
        selectionBox.height
      );
      const newUrl = canvas.toDataURL();
      const maxZ = Math.max(...editStates.map((s) => s.zIndex || 1));
      setEditStates((prev) => [
        ...prev,
        {
          url: newUrl,
          opacity: 1,
          zIndex: maxZ + 1,
          showToolbar: false,
          width: selectionBox.width,
          height: selectionBox.height,
          x: tile.x + selectionBox.x + 30,
          y: tile.y + selectionBox.y + 30,
        },
      ]);
      setSelectionBox(null);
      setSelectModeIndex(null);
    };
    image.src = tile.url;
  };

  return (
    <div style={styles.scrollContainer} ref={boardRef}>
      <div style={styles.board}>
        {editStates.map((state, i) => (
          <Rnd
            key={i}
            size={{ width: state.width, height: state.height }}
            position={{ x: state.x, y: state.y }}
            enableResizing={{ bottom: true, bottomRight: true, right: true }}
            onDragStop={(e, d) => updateState(i, { x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) =>
              updateState(i, {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                ...position,
              })
            }
            lockAspectRatio={false}
            bounds="parent"
            style={{
              ...(layout === 'template' ? styles.templateTile : styles.deviceTile),
              opacity: state.opacity,
              zIndex: state.zIndex,
              cursor: selectModeIndex === i ? 'crosshair' : 'default',
              position: 'absolute'
            }}
            className="rnd-tile"
            onClick={() => updateState(i, { showToolbar: !state.showToolbar })}
          >
            {state.showToolbar && (
              <div className="toolbar" style={styles.toolbarStickyInside}>
                <label style={styles.label} title="Adjust image opacity">
                  <span style={{ minWidth: '48px' }}>Opacity:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.1"
                    value={state.opacity}
                    onChange={(e) => updateState(i, { opacity: parseFloat(e.target.value) })}
                    style={{ width: '60px' }}
                  />
                </label>
                <button title="Bring to front" style={styles.button} onClick={() => bringToFront(i)}>⬆</button>
                <button title="Send to back" style={styles.button} onClick={() => sendToBack(i)}>⬇</button>
                <button
                  title="Start area selection"
                  style={styles.copyInlineButton}
                  onClick={() => setSelectModeIndex(i)}
                >📐</button>
                <button
                  title="Copy selected area to new tile"
                  style={styles.copyInlineButton}
                  onClick={() => cropToNewTile(i)}
                >📋</button>
                <button title="Delete image" style={styles.deleteButton} onClick={() => handleDelete(i)}>🗑</button>
              </div>
            )}
            <div
              ref={(el) => (tileRefs.current[i] = el)}
              style={{
                ...styles.imageWrapper,
                cursor: selectModeIndex === i ? 'crosshair' : 'default',
              }}
              onMouseDown={(e) => startSelect(e, i)}
              onMouseMove={(e) => duringSelect(e, i)}
              onMouseUp={endSelect}
            >
              <img src={state.url} alt={`Screenshot ${i}`} style={styles.image} />
              {selectModeIndex === i && selectionBox && (
                <div
                  style={{
                    position: 'absolute',
                    left: selectionBox.x,
                    top: selectionBox.y,
                    width: selectionBox.width,
                    height: selectionBox.height,
                    border: '2px dashed #0f0',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    pointerEvents: 'none',
                    zIndex: 2000,
                  }}
                />
              )}
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
};

const styles = {
  scrollContainer: {
    width: '100%',
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#111',
  },
  board: {
    position: 'relative',
    minWidth: '2000px',
    minHeight: '1500px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
  },
  templateTile: {
    border: '2px dashed #444',
    borderRadius: '8px',
    padding: '0.5rem',
    backgroundColor: '#2a2a2a',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  },
  deviceTile: {
    margin: '1rem',
    backgroundColor: '#2a2a2a',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    borderRadius: '4px',
    position: 'relative',
  },
  image: {
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    pointerEvents: 'none',
  },
  toolbarStickyInside: {
    position: 'sticky',
    top: 0,
    background: '#000',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    display: 'flex',
    gap: '8px',
    zIndex: 999,
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  button: {
    background: '#444',
    color: '#fff',
    border: 'none',
    padding: '2px 6px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    background: '#aa0000',
    color: '#fff',
    border: 'none',
    padding: '2px 6px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  copyInlineButton: {
    background: '#007bff',
    color: '#fff',
    padding: '2px 6px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
};

export default SceneBoard;
