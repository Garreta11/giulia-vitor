'use client';
import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from './Experience.module.scss';
import Output from './Output';
import { DataContext } from '@/app/context/context';
const Experience = ({ handleLoading }) => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const outputRef = useRef(null);

  const { start, setStart } = useContext(DataContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Code that uses window here
      outputRef.current = new Output({
        targetElement: containerRef.current,
        setLoading,
        window: window,
      });
    }
  }, []);

  useEffect(() => {
    if (start) {
      outputRef.current.start();
    }
  }, [start]);

  useEffect(() => {
    if (!loading) {
      handleLoading();
    }
  }, [loading]);

  return (
    <>
      <div ref={containerRef} className={`${styles.experience}`} />
    </>
  );
};

export default Experience;
