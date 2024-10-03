'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Experience.module.scss';
import Output from './Output';
import Loader from '../Loader/Loader';

const Experience = () => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current = new Output({
      targetElement: containerRef.current,
      setLoading,
    });
  }, []);

  return (
    <>
      <Loader loading={loading} />
      <div ref={containerRef} className={`${styles.experience}`} />
    </>
  );
};

export default Experience;
