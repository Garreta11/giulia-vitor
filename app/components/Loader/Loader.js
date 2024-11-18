'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './Loader.module.scss';
import gsap from 'gsap';
import { DataContext } from '@/app/context/context';

const Loader = ({ loading }) => {
  const nameRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const { setStart } = useContext(DataContext);

  useEffect(() => {
    const tl = gsap.timeline();
    if (loading) {
      tl.fromTo(
        nameRef.current.querySelectorAll('h1'),
        {
          scale: 0,
          z: -1000,
        },
        {
          scale: 1,
          z: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.inOut',
        }
      );
      tl.to(nameRef.current.querySelectorAll('h1'), {
        z: 1000,
        delay: 0.3,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.inOut',
      });
      tl.fromTo(
        textRef.current.querySelector('p'),
        {
          scale: 0,
          z: -1000,
        },
        {
          scale: 1,
          z: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => setAnimationDone(true),
        },
        '-=0.5'
      );
    }
  }, []);

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

  const handleClick = () => {
    setStart(true);
    gsap.to(buttonRef.current.querySelector('button'), {
      z: 1000,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.inOut',
      onComplete: () => setIsLoaded(true),
    });
  };

  return (
    <div
      className={`${styles.loader} ${isLoaded ? styles.loader__hidden : ''}`}
    >
      <div className={styles.loader__names} ref={nameRef}>
        <h1>Giulia</h1>
        <h1>Vitor</h1>
      </div>
      <div className={styles.loader__text} ref={textRef}>
        <p>The party you have been waiting for is finally here</p>
      </div>
      <div ref={buttonRef} className={styles.loader__button}>
        <button onClick={handleClick}>Explore</button>
      </div>
    </div>
  );
};

export default Loader;
