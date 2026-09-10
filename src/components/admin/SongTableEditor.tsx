"use client";

import { useState, useEffect, useRef } from "react";

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
  const isInternalChange = useRef(false);

  // Form state for adding a new song
  const [newSong, setNewSong] = useState<Song>({ id: "", name: "", url: "", artist: "", key: "", notes: "" });

  // Parse markdown content when it changes externally
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

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
            id: `song-ext-${i}`, // stable key based on index
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
  }, [content]);

  const generateMarkdownTable = (currentSongs: Song[]) => {
    if (currentSongs.length === 0) {
      let md = `\n| Canción | Artista | Tono | Notas |\n`;
      md += `|---------|---------|------|-------|\n`;
      return md;
    }

    let md = `\n| Canción | Artista | Tono | Notas |\n`;
    md += `|---------|---------|------|-------|\n`;
    currentSongs.forEach((song) => {
      const songCell = song.url ? `[${song.name}](${song.url})` : song.name || " ";
      md += `| ${songCell} | ${song.artist || " "} | ${song.key || " "} | ${song.notes || " "} |\n`;
    });
    return md;
  };

  const saveToContent = (newSongs: Song[]) => {
    isInternalChange.current = true;
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
    isInternalChange.current = true;
    const newTableMd = `\n\n${START_MARKER}${generateMarkdownTable([])}${END_MARKER}\n\n`;
    setHasTable(true);
    setSongs([]);
    onChange(content + newTableMd);
  };

  const handleAddNewSong = () => {
    if (!newSong.name) {
      alert("El nombre de la canción es obligatorio");
      return;
    }
    const newSongsList = [...songs, { ...newSong, id: `song-${Date.now()}` }];
    setSongs(newSongsList);
    saveToContent(newSongsList);
    // Reset form
    setNewSong({ id: "", name: "", url: "", artist: "", key: "", notes: "" });
  };

  const updateSong = (id: string, field: keyof Song, value: string) => {
    const newSongs = songs.map(s => s.id === id ? { ...s, [field]: value } : s);
    setSongs(newSongs);
    saveToContent(newSongs);
  };

  const deleteSong = (id: string) => {
    if (confirm("¿Eliminar esta canción?")) {
      const newSongs = songs.filter(s => s.id !== id);
      setSongs(newSongs);
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
      <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "600", margin: "0 0 var(--space-4) 0" }}>🎵 Tonalidades de Canciones</h3>

      {/* Formulario para añadir nueva canción */}
      <div style={{ marginBottom: "var(--space-4)", padding: "var(--space-3)", background: "var(--surface-3)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "600", marginBottom: "var(--space-3)", marginTop: 0 }}>Añadir nueva canción</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
          <input
            type="text"
            className="form-input"
            style={{ fontSize: "var(--text-sm)" }}
            placeholder="Canción *"
            value={newSong.name}
            onChange={(e) => setNewSong({...newSong, name: e.target.value})}
          />
          <input
            type="text"
            className="form-input"
            style={{ fontSize: "var(--text-sm)" }}
            placeholder="URL (Opcional)"
            value={newSong.url}
            onChange={(e) => setNewSong({...newSong, url: e.target.value})}
          />
          <input
            type="text"
            className="form-input"
            style={{ fontSize: "var(--text-sm)" }}
            placeholder="Artista"
            value={newSong.artist}
            onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
          />
          <input
            type="text"
            className="form-input"
            style={{ fontSize: "var(--text-sm)" }}
            placeholder="Tono (Ej. C0 Re)"
            value={newSong.key}
            onChange={(e) => setNewSong({...newSong, key: e.target.value})}
          />
          <input
            type="text"
            className="form-input"
            style={{ fontSize: "var(--text-sm)" }}
            placeholder="Notas"
            value={newSong.notes}
            onChange={(e) => setNewSong({...newSong, notes: e.target.value})}
          />
        </div>
        <button type="button" onClick={handleAddNewSong} className="btn btn-primary btn-sm" style={{ width: "100%" }}>
          ➕ Añadir a la lista
        </button>
      </div>

      {/* Tabla de canciones existentes para edición inline */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "var(--space-2)", width: "25%", fontSize: "var(--text-sm)" }}>Canción</th>
              <th style={{ padding: "var(--space-2)", width: "20%", fontSize: "var(--text-sm)" }}>URL</th>
              <th style={{ padding: "var(--space-2)", width: "20%", fontSize: "var(--text-sm)" }}>Artista</th>
              <th style={{ padding: "var(--space-2)", width: "15%", fontSize: "var(--text-sm)" }}>Tono</th>
              <th style={{ padding: "var(--space-2)", width: "15%", fontSize: "var(--text-sm)" }}>Notas</th>
              <th style={{ padding: "var(--space-2)", width: "5%" }}></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "var(--space-1)" }}>
                  <input
                    type="text"
                    value={song.name}
                    onChange={(e) => updateSong(song.id, "name", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)", border: "none", background: "transparent" }}
                  />
                </td>
                <td style={{ padding: "var(--space-1)" }}>
                  <input
                    type="text"
                    value={song.url}
                    onChange={(e) => updateSong(song.id, "url", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)", border: "none", background: "transparent" }}
                  />
                </td>
                <td style={{ padding: "var(--space-1)" }}>
                  <input
                    type="text"
                    value={song.artist}
                    onChange={(e) => updateSong(song.id, "artist", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)", border: "none", background: "transparent" }}
                  />
                </td>
                <td style={{ padding: "var(--space-1)" }}>
                  <input
                    type="text"
                    value={song.key}
                    onChange={(e) => updateSong(song.id, "key", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)", border: "none", background: "transparent" }}
                  />
                </td>
                <td style={{ padding: "var(--space-1)" }}>
                  <input
                    type="text"
                    value={song.notes}
                    onChange={(e) => updateSong(song.id, "notes", e.target.value)}
                    className="form-input"
                    style={{ padding: "var(--space-1)", fontSize: "var(--text-sm)", border: "none", background: "transparent" }}
                  />
                </td>
                <td style={{ padding: "var(--space-1)", textAlign: "center" }}>
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
                <td colSpan={6} style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                  La lista está vacía. Añade tu primera canción arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
        * Todo lo introducido se guarda automáticamente en el texto Markdown.
      </p>
    </div>
  );
}
