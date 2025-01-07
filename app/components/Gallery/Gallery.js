import { useEffect, useRef } from 'react';
import styles from './Gallery.module.scss';
import Output from './Output';

const photos = [
  {
    img: '/images/photos/photo1.JPG',
    alt: 'Photo 1',
    width: 3629,
    height: 2433,
  },
  {
    img: '/images/photos/photo2.jpg',
    alt: 'Photo 2',
    width: 1200,
    height: 1600,
  },
  {
    img: '/images/photos/photo4.jpg',
    alt: 'Photo 4',
    width: 603,
    height: 768,
  },
  {
    img: '/images/photos/photo3.jpg',
    alt: 'Photo 3',
    width: 1280,
    height: 960,
  },
  {
    img: '/images/photos/photo5.jpg',
    alt: 'Photo 5',
    width: 1024,
    height: 768,
  },
  {
    img: '/images/photos/photo6.jpg',
    alt: 'Photo 6',
    width: 2048,
    height: 1536,
  },
  {
    img: '/images/photos/photo7.jpg',
    alt: 'Photo 7',
    width: 2048,
    height: 1536,
  },
  {
    img: '/images/photos/photo8.jpg',
    alt: 'Photo 8',
    width: 1202,
    height: 1600,
  },
  {
    img: '/images/photos/photo9.jpg',
    alt: 'Photo 9',
    width: 4032,
    height: 3024,
  },
  {
    img: '/images/photos/photo10.jpg',
    alt: 'Photo 10',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/photos/photo11.jpg',
    alt: 'Photo 11',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/photos/photo12.jpg',
    alt: 'Photo 12',
    width: 2316,
    height: 3088,
  },
];

const Gallery = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const output = new Output({
        targetElement: canvasRef.current,
        window: window,
      });
    }
  }, []);

  return (
    <div id='gallery' className={`${styles.gallery}`}>
      <div className={styles.gallery__canvas} ref={canvasRef} />
      <div className={`${styles.gallery__gallery} gallery`}>
        {photos.map((photo, index) => (
          <figure
            key={index}
            className={`${styles.gallery__figure} gallery-figure`}
          >
            <img className={styles.gallery__img} src={photo.img} />
          </figure>
        ))}
      </div>
      <div className={styles.gallery__gradient} />
    </div>
  );
};

export default Gallery;
