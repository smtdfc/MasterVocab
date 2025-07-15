'use client';

import { useUI } from '@/context/ui';
import "@/styles/navbar.css";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { openOffcanvas } = useUI();
  const router = useRouter();
  
  return (
    <nav className="nav">
      <div className="nav-header">
        <button onClick={openOffcanvas} className="nav-btn material-icons">menu</button>
        <h3 className="nav-title">Master Vocab</h3>
      </div>
      <div className="navbar-items">
        <button
          onClick={() => router.push('/vocabulary/add')}
          className="nav-btn material-icons"
        >
          add
        </button>
      </div>
    </nav>
  );
}