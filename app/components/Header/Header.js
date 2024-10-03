import React from 'react';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.header__wrapper}>
        <h5>GIULIA</h5>
        <div className={styles.header__info}>
          <p>2nd August 2025</p>
          <p>Goiânia, Brasil</p>
        </div>
        <h5>VITOR</h5>
      </div>
    </div>
  );
};

export default Header;
