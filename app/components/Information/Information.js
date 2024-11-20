import styles from './Information.module.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useRef, useContext } from 'react';
import { DataContext } from '@/app/context/context';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

const photos = [
  {
    img: '/images/location/locationa1.jpg',
    alt: 'Location - Photo 1',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa2.jpg',
    alt: 'Location - Photo 2',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa3.jpg',
    alt: 'Location - Photo 3',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa4.jpg',
    alt: 'Location - Photo 4',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa5.jpg',
    alt: 'Location - Photo 5',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa6.jpg',
    alt: 'Location - Photo 6',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa7.jpg',
    alt: 'Location - Photo 7',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa8.jpg',
    alt: 'Location - Photo 8',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa9.jpg',
    alt: 'Location - Photo 9',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa10.jpg',
    alt: 'Location - Photo 10',
    width: 3024,
    height: 4032,
  },
  {
    img: '/images/location/locationa11.jpg',
    alt: 'Location - Photo 11',
    width: 717,
    height: 956,
  },
];

const Information = () => {
  const t = useTranslations('Information');
  const galleryRef = useRef();
  const galleryWrapperRef = useRef();

  const { start } = useContext(DataContext);

  useEffect(() => {
    if (start) {
      // horizontal carousel
      const gallery = galleryWrapperRef.current;
      const galleryWidth = gallery.offsetWidth;
      const ammountToScroll = galleryWidth - window.innerWidth;
      gsap.to(gallery, {
        x: -ammountToScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top top',
          end: '+=' + ammountToScroll,
          pin: true,
          scrub: true,
        },
      });
    }
  }, [start]);

  const handleGoogleForm = () => {
    console.log('*Go to Google Form');
  };

  return (
    <div id='information' className={`${styles.information} section`}>
      <div ref={galleryRef} className={styles.information__location}>
        <h2 className={styles.information__location__title}>{t('location')}</h2>

        <div className={styles.information__location__gallery}>
          <div
            ref={galleryWrapperRef}
            className={styles.information__location__gallery__wrapper}
          >
            {photos.map((img, i) => {
              return (
                <Image
                  key={i}
                  src={img.img}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.information__rsvp}>
        <button onClick={handleGoogleForm}>RSVP</button>
      </div>
    </div>
  );
};

export default Information;
