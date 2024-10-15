'use client';
import React, { useEffect } from 'react';
import { DataProvider } from '@/app/context/context';
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

  return <DataProvider>{children}</DataProvider>;
};

export default PageWrapper;
