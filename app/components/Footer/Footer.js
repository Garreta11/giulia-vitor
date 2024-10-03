'use client';

import React from 'react';
import styles from './Footer.module.scss';
import Link from 'next/link';

const links = [
  {
    label: 'Gallery',
    href: '#gallery',
  },
  {
    label: 'Playlist',
    href: '#playlist',
  },
  {
    label: 'Information',
    href: '#information',
  },
];

const Footer = () => {
  const handleClick = (e, href) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className={styles.footer}>
      <div className={styles.footer__wrapper}>
        <div className={styles.footer__content}>
          <h1 className={styles.footer__title}>
            Giulia
            <br />
            &<br />
            Vitor
          </h1>
          <div className={styles.footer__links}>
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={styles.footer__links__item}
                onClick={(e) => handleClick(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
