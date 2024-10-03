'use client';
import React, { useState } from 'react';
import styles from './Loader.module.scss';

const Loader = ({ loading }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`${styles.loader} ${isLoaded ? styles.loader__hidden : ''}`}
    >
      <p>The party you have been waiting for is finally here</p>
      {!loading && (
        <button onClick={() => setIsLoaded(true)}>Start Experience</button>
      )}
    </div>
  );
};

export default Loader;
