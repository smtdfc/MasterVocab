"use client";

import { useUI } from '@/context/ui';
import { useRef, useEffect } from 'react';
import '@/styles/offcanvas.css';


export default function Offcanvas() {
  const { isOffcanvasOpen,closeOffcanvas } = useUI();
  const offcanvasRef = useRef < HTMLDivElement > (null);
  
  useEffect(() => {
    const el = offcanvasRef.current;
    if (!el) return;
    
    if (isOffcanvasOpen) {
      el.classList.add("open");
    } else {
      el.classList.remove("open");
    }
  }, [isOffcanvasOpen]);
  
  return (
    <div className="offcanvas" ref={offcanvasRef}>
      <div className="offcanvas-header">
        <h3 className="offcanvas-title">Menu</h3>
        <button onClick={closeOffcanvas} className="offcanvas-btn material-icons">close</button>
      </div>
      <div className="offcanvas-body">
        <ul className="offcanvas-menu">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Vocabulary</a>
          </li>
        </ul>
      </div>
    </div>
  );
}