'use client';
import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from './Experience.module.scss';
import Output from './Output';
import { DataContext } from '@/app/context/context';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Experience = ({ handleLoading }) => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const outputRef = useRef(null);

  const { start } = useContext(DataContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if the device is mobile
      const mobileQuery = window.matchMedia('(max-width: 1024px)');

      // Code that uses window here
      outputRef.current = new Output({
        targetElement: containerRef.current,
        setLoading,
        window: window,
        isMobile: mobileQuery.matches,
      });
    }
  }, []);

  useEffect(() => {
    if (start) {
      //outputRef.current.start();
      // Add ScrollTrigger logic
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 90%', // Adjust as needed
        onEnter: () => {
          if (
            outputRef.current &&
            typeof outputRef.current.start === 'function'
          ) {
            outputRef.current.start();
          }
        },
      });
    }

    return () => {
      ScrollTrigger.killAll(); // Clean up ScrollTriggers
    };
  }, [start]);

  useEffect(() => {
    if (!loading) {
      handleLoading();
    }
  }, [loading]);

  const handleDance = () => {
    if (outputRef.current) outputRef.current.changeDance();
  };

  return (
    <>
      <div ref={containerRef} className={`${styles.experience}`}>
        <button onClick={handleDance}>Make them dance</button>
      </div>
    </>
  );
};

export default Experience;
