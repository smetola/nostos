"use client";

interface ViewToggleProps {
  activeView: "feed" | "map";
  onToggle: (view: "feed" | "map") => void;
}

export function ViewToggle({ activeView, onToggle }: ViewToggleProps) {
  return (
    <div className="view-toggle" id="view-toggle">
      <button
        className={`view-toggle-btn ${activeView === "feed" ? "active" : ""}`}
        onClick={() => onToggle("feed")}
        aria-label="Vista Feed"
        title="Vista Feed"
      >
        📰
      </button>
      <button
        className={`view-toggle-btn ${activeView === "map" ? "active" : ""}`}
        onClick={() => onToggle("map")}
        aria-label="Vista Mapa"
        title="Vista Mapa"
      >
        🗺️
      </button>
    </div>
  );
}
