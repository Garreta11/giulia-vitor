'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Information from './components/Information/Information';
import Hero from './components/Hero/Hero';
import Photos from './components/Photos/Photos';
import Gallery from './components/Gallery/Gallery';
import styles from './page.module.scss';
import PageWrapper from './components/PageWrapper/PageWrapper';
import Loader from './components/Loader/Loader';

const DynamicPlaylistWebGL = dynamic(
  () => import('./components/PlaylistWebGL/PlaylistWebGL'),
  { ssr: false }
);

const DynamicExperience = dynamic(
  () => import('./components/Experience/Experience'),
  { ssr: false }
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const handleLoading = () => {
    setLoading(false);
  };
  return (
    <div className={`${styles.page} page`}>
      <PageWrapper>
        <Header />
        <Loader loading={loading} />
        <DynamicExperience handleLoading={handleLoading} />
        <Hero />
        {/* <Photos /> */}
        <Gallery />
        <DynamicPlaylistWebGL />
        <Information />
        <Footer />
      </PageWrapper>
    </div>
  );
};

export default Home;
