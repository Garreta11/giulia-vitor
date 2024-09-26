'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './NavBar.module.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href='/'>G&V</Link>
        </div>
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <Link href='/' className={styles.link}>
            History
          </Link>
          <Link href='/details' className={styles.link}>
            Wedding's details
          </Link>
          <Link href='/gallery' className={styles.link}>
            Gallery
          </Link>
          <Link href='/information' className={styles.link}>
            Information
          </Link>
          <Link href='/contact' className={styles.link}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
