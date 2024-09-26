import React from 'react';
import styles from './Header.module.scss';
import Navbar from '../NavBar/NavBar';

const Header = () => {
  return (
    <div className={styles.header}>
      <Navbar />
    </div>
  );
};

export default Header;
