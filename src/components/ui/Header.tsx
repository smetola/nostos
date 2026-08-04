"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchModal } from "./SearchModal";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="header-logo">
            <span>Nostos</span>
          </Link>
          <nav className="header-nav">
            <button
              className="nav-link"
              onClick={() => setSearchOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-1)",
              }}
              aria-label="Buscar"
              id="search-button"
            >
              🔍
              <span className="hide-mobile">Buscar</span>
            </button>
            <Link href="/" className="nav-link hide-mobile">
              Inicio
            </Link>
            <Link href="/timeline" className="nav-link">
              Timeline
            </Link>
          </nav>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
