"use client";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <div className="map-controls">
      <button onClick={onZoomIn} aria-label="Acercar" title="Acercar">
        +
      </button>
      <button onClick={onZoomOut} aria-label="Alejar" title="Alejar">
        −
      </button>
      <button
        onClick={onReset}
        aria-label="Resetear vista"
        title="Resetear vista"
        style={{ fontSize: "0.9rem" }}
      >
        ⟳
      </button>
    </div>
  );
}
