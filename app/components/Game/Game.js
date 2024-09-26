'use client';
import React, { useEffect, useRef } from 'react';
import styles from './Game.module.scss';
import Output from './Output';

const Game = () => {
  const containerRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current = new Output({
      targetElement: containerRef.current,
    });
  }, []);

  return <div ref={containerRef} className={styles.game} />;
};

export default Game;
