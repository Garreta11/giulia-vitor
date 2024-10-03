import Experience from './components/Experience/Experience';
import PlaylistWebGL from './components/PlaylistWebGL/PlaylistWebGL';
import Information from './components/Information/Information';
import Hero from './components/Hero/Hero';
import Photos from './components/Photos/Photos';
import styles from './page.module.scss';

const Home = () => {
  return (
    <div className={`${styles.page} page`}>
      <Experience />
      <Hero />
      <Photos />
      <PlaylistWebGL />
      <Information />
    </div>
  );
};

export default Home;
