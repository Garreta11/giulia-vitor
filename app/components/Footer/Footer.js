'use client';

import React from 'react';
import styles from './Footer.module.scss';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

const links = [
  {
    label: 'Location',
    href: '#information',
  },
  {
    label: 'FAQ',
    href: '#faq',
  },
];

const Footer = () => {
  const lenis = useLenis();

  const scrollToOptions = {
    // Customize scroll options if needed
    offset: 0,
    lerp: 0.1,
    duration: 1,
  };

  const handleClick = (e, href) => {
    e.preventDefault(); // Prevent the default anchor behavior
    const targetElement = document.querySelector(href);

    if (lenis && targetElement) {
      lenis.scrollTo(targetElement, scrollToOptions);
    } else if (targetElement) {
      // Fallback to native smooth scroll
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
            <div className={styles.footer__links__anchors}>
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

            <Link
              className={styles.footer__links__rsvp}
              href='https://docs.google.com/forms/d/e/1FAIpQLSf4z-8qDh2mgbhMoEl3Iaf5gZxTtpRl9sY-kLvq3DmqeEA-qA/viewform'
              target='_blank'
            >
              RSVP
              <svg
                width='14'
                height='14'
                viewBox='0 0 14 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M2.3874 0.595174C1.97332 0.605215 1.64579 0.949152 1.65583 1.36323C1.66587 1.77732 2.00981 2.10485 2.42389 2.09481L11.0547 1.88494L0.63618 12.3034C0.343289 12.5963 0.343226 13.0712 0.63618 13.3641C0.929064 13.657 1.40395 13.657 1.69684 13.3641L12.1156 2.94531L11.9057 11.5766C11.8956 11.9907 12.2231 12.3346 12.6372 12.3446C13.0513 12.3547 13.3952 12.0271 13.4053 11.613L13.6543 1.37016C13.66 1.13675 13.5854 0.920868 13.4562 0.74798C13.4296 0.708523 13.399 0.671047 13.3641 0.636186C13.329 0.601043 13.2912 0.570071 13.2514 0.543413C13.0787 0.41472 12.8632 0.340475 12.6303 0.346132L2.3874 0.595174Z'
                  fill='#212121'
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
