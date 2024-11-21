'use client';

import { useTranslations } from 'next-intl';
import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './Loader.module.scss';
import gsap from 'gsap';
import { DataContext } from '@/app/context/context';
import setLanguageValue from '@/app/actions/set-language-action';

const Loader = ({ loading }) => {
  const t = useTranslations('Loader');

  const nameRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const languagesRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguage] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const { setStart } = useContext(DataContext);

  useEffect(() => {
    // No Scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Animation
    const tl = gsap.timeline();
    if (loading) {
      tl.fromTo(
        nameRef.current.querySelectorAll('h1'),
        {
          scale: 0,
          opacity: 0,
          z: -1000,
        },
        {
          scale: 1,
          opacity: 1,
          z: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.inOut',
        }
      );

      tl.fromTo(
        languagesRef.current.querySelectorAll('p'),
        {
          scale: 0,
          opacity: 0,
          z: -1000,
        },
        {
          scale: 1,
          opacity: 1,
          z: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.inOut',
        }
      );
    }
  }, []);

  useEffect(() => {
    if (language) {
      const tl = gsap.timeline();
      tl.to(languagesRef.current.querySelectorAll('p'), {
        z: 1000,
        delay: 0.3,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.inOut',
      });
      tl.to(nameRef.current.querySelectorAll('h1'), {
        z: 1000,
        opacity: 0,
        delay: 0.3,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.inOut',
      });
      tl.fromTo(
        textRef.current.querySelector('p'),
        {
          scale: 0,
          opacity: 0,
          z: -1000,
        },
        {
          scale: 1,
          opacity: 1,
          z: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => setAnimationDone(true),
        },
        '-=0.5'
      );
    }
  }, [language]);

  useEffect(() => {
    if (animationDone && !loading) {
      const tl = gsap.timeline();
      tl.to(textRef.current.querySelector('p'), {
        z: 1000,
        delay: 0.3,
        duration: 1,
        ease: 'power2.inOut',
      });
      tl.to(buttonRef.current.querySelector('button'), {
        z: 0,
        scale: 1,
        ease: 'power2.inOut',
      });
    }
  }, [loading, animationDone]);

  const handleClickExplore = () => {
    setStart(true);
    gsap.to(buttonRef.current.querySelector('button'), {
      z: 1000,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => setIsLoaded(true),
    });

    // Scroll
    document.documentElement.style.overflowY = 'initial';
    document.body.style.overflowY = 'initial';
  };

  const handleLanguage = (_language) => {
    setLanguageValue(_language);
    setLanguage(true);
  };

  return (
    <div
      className={`${styles.loader} ${isLoaded ? styles.loader__hidden : ''}`}
    >
      <div className={styles.loader__names} ref={nameRef}>
        <h1>Giulia</h1>
        <h1>Vitor</h1>
      </div>
      <div className={styles.loader__languages} ref={languagesRef}>
        <p onClick={() => handleLanguage('pt')}>Português</p>
        <p>-</p>
        <p onClick={() => handleLanguage('it')}>Italian</p>
        <p>-</p>
        <p onClick={() => handleLanguage('en')}>English</p>
      </div>
      <div className={styles.loader__text} ref={textRef}>
        <p>{t('text')}</p>
      </div>
      <div ref={buttonRef} className={styles.loader__button}>
        <button onClick={handleClickExplore}>{t('explore')}</button>
      </div>
    </div>
  );
};

export default Loader;
