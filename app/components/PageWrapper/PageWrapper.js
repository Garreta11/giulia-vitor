'use client';
import React, { useEffect } from 'react';
import Lenis from 'lenis';

const PageWrapper = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return <div>{children}</div>;
};

export default PageWrapper;
