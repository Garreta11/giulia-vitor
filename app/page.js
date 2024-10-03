import dynamic from 'next/dynamic';

import Experience from './components/Experience/Experience';
import PlaylistWebGL from './components/PlaylistWebGL/PlaylistWebGL';
import Information from './components/Information/Information';
import Hero from './components/Hero/Hero';
import Photos from './components/Photos/Photos';
import styles from './page.module.scss';
import PageWrapper from './components/PageWrapper/PageWrapper';

const DynamicPlaylistWebGL = dynamic(
  () => import('./components/PlaylistWebGL/PlaylistWebGL'),
  { ssr: false }
);

const DynamicExperience = dynamic(
  () => import('./components/Experience/Experience'),
  { ssr: false }
);

const Home = () => {
  return (
    <div className={`${styles.page} page`}>
      <PageWrapper>
        <DynamicExperience />
        <Hero />
        <Photos />
        <DynamicPlaylistWebGL />
        <Information />
      </PageWrapper>
    </div>
  );
};

export default Home;
