"use client";

import { useState, useEffect } from "react";

interface SongTableEditorProps {
  content: string;
  onChange: (newContent: string) => void;
}

interface Song {
  id: string; // for React keys
  name: string;
  url: string;
  artist: string;
  key: string;
  notes: string;
}

const START_MARKER = "<!-- SONGS_TABLE_START -->";
const END_MARKER = "<!-- SONGS_TABLE_END -->";

export function SongTableEditor({ content, onChange }: SongTableEditorProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [hasTable, setHasTable] = useState(false);

  // Parse markdown content when it changes (or initially)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const startIndex = content.indexOf(START_MARKER);
    const endIndex = content.indexOf(END_MARKER);

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasTable(true);
      const tableContent = content.substring(startIndex + START_MARKER.length, endIndex).trim();
      
      const parsedSongs: Song[] = [];
      const lines = tableContent.split('\n');
      
      // Skip header (0) and separator (1)
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line.startsWith('|')) continue;
        
        // Remove first and last pipe and split
        const parts = line.substring(1, line.endsWith('|') ? line.length - 1 : line.length).split('|');
        if (parts.length >= 3) {
          const rawSongCell = parts[0].trim();
          let name = rawSongCell;
          let url = "";
          
          // Match [name](url)
          const linkMatch = rawSongCell.match(/\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            name = linkMatch[1];
            url = linkMatch[2];
          }

          parsedSongs.push({
            id: Math.random().toString(36).substring(2, 9),
            name,
            url,
            artist: parts[1].trim(),
            key: parts[2].trim(),
            notes: parts.length > 3 ? parts[3].trim() : ""
          });
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSongs(parsedSongs);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasTable(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSongs([]);
    }
  }, [content]); // Depend on content so if they undo in text area, it updates. But wait, if we edit in UI, we update content, which triggers this again. That's fine, it will stay synced.

  const generateMarkdownTable = (currentSongs: Song[]) => {
    let md = `\n| Canción | Artista | Tono | Notas |\n`;
    md += `|---------|---------|------|-------|\n`;
    currentSongs.forEach((song) => {
      const songCell = song.url ? `[${song.name}](${song.url})` : song.name;
      md += `| ${songCell} | ${song.artist} | ${song.key} | ${song.notes} |\n`;
    });
    return md;
  };

  const saveToContent = (newSongs: Song[]) => {
    const startIndex = content.indexOf(START_MARKER);
    const endIndex = content.indexOf(END_MARKER);

    const newTableMd = generateMarkdownTable(newSongs);
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const newContent = content.substring(0, startIndex + START_MARKER.length) + 
                         newTableMd + 
                         content.substring(endIndex);
      onChange(newContent);
    }
  };

  const insertTable = () => {
    const defaultSongs: Song[] = [
      { id: "1", name: "El último día", url: "https://lacuerda.net/share.php?t=mner0272", artist: "Maldita Nerea", key: "C0 Re", notes: "Capo 1" }
    ];
    const newTableMd = `\n\n${START_MARKER}${generateMarkdownTable(defaultSongs)}${END_MARKER}\n\n`;
    onChange(content + newTableMd);
  };

  const addSong = () => {
    const newSongs = [...songs, { id: Math.random().toString(36).substring(2, 9), name: "", url: "", artist: "", key: "", notes: "" }];
    saveToContent(newSongs);
  };

  const updateSong = (id: string, field: keyof Song, value: string) => {
    const newSongs = songs.map(s => s.id === id ? { ...s, [field]: value } : s);
    // Optimistic update to prevent cursor jumping
    setSongs(newSongs);
    saveToContent(newSongs);
  };

  const deleteSong = (id: string) => {
    if (confirm("¿Eliminar esta canción?")) {
      const newSongs = songs.filter(s => s.id !== id);
      saveToContent(newSongs);
    }
  };

  if (!hasTable) {
    return (
      <div style={{ marginBottom: "var(--space-2)", display: "flex", justifyContent: "flex-end" }}>
        <button 
          type="button" 
          onClick={insertTable} 
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}
          title="Añadir editor visual de tabla de canciones (solo para posts de tonalidades)"
        >
          🎵 <span>Insertar editor de canciones</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "var(--space-6)", padding: "var(--space-4)", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
        <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "600", margin: 0 }}>🎵 Tonalidades de Canciones</h3>
        <button type="button" onClick={addSong} className="btn btn-primary btn-sm">
          ➕ Añadir canción
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "var(--space-2)", width: "25%" }}>Canción</th>
              <th style={{ padding: "var(--space-2)", width: "20%" }}>URL (Opcional)</th>
              <th style={{ padding: "var(--space-2)", width: "20%" }}>Artista</th>
              <th style={{ padding: "var(--space-2)", width: "15%" }}>Tono</th>
              <th style={{ padding: "var(--space-2)", width: "15%" }}>Notas</th>
              <th style={{ padding: "var(--space-2)", width: "5%" }}></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "var(--space-2)" }}>
                  <input
                    type="text"
                    value={song.name}
                    onChange={(e) => updateSong(song.id, "name", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)" }}
                    placeholder="Ej. El último día"
                  />
                </td>
                <td style={{ padding: "var(--space-2)" }}>
                  <input
                    type="text"
                    value={song.url}
                    onChange={(e) => updateSong(song.id, "url", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)" }}
                    placeholder="https://..."
                  />
                </td>
                <td style={{ padding: "var(--space-2)" }}>
                  <input
                    type="text"
                    value={song.artist}
                    onChange={(e) => updateSong(song.id, "artist", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)" }}
                    placeholder="Maldita Nerea"
                  />
                </td>
                <td style={{ padding: "var(--space-2)" }}>
                  <input
                    type="text"
                    value={song.key}
                    onChange={(e) => updateSong(song.id, "key", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)" }}
                    placeholder="C0 Re"
                  />
                </td>
                <td style={{ padding: "var(--space-2)" }}>
                  <input
                    type="text"
                    value={song.notes}
                    onChange={(e) => updateSong(song.id, "notes", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)" }}
                    placeholder="Anotaciones..."
                  />
                </td>
                <td style={{ padding: "var(--space-2)", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => deleteSong(song.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "1.2rem" }}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {songs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--text-secondary)" }}>
                  No hay canciones. Añade una para empezar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
        * Al modificar la tabla aquí, el Markdown de abajo se actualiza automáticamente.
      </p>
    </div>
  );
}
