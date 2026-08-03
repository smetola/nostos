import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          <span>Nostos</span>
        </Link>
        <nav className="header-nav">
          <Link href="/" className="nav-link">
            Inicio
          </Link>
          <Link href="/timeline" className="nav-link">
            Timeline
          </Link>
        </nav>
      </div>
    </header>
  );
}
