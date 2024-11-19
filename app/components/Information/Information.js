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
    img: '/images/location/location1.jpg',
    alt: 'Photo 1',
    width: 612,
    height: 407,
  },
  {
    img: '/images/location/location2.jpg',
    alt: 'Photo 2',
    width: 1100,
    height: 1616,
  },
  {
    img: '/images/location/location3.jpeg',
    alt: 'Photo 4',
    width: 1000,
    height: 750,
  },
  {
    img: '/images/location/location4.jpeg',
    alt: 'Photo 3',
    width: 275,
    height: 183,
  },
  {
    img: '/images/location/location5.jpg',
    alt: 'Photo 5',
    width: 5184,
    height: 3456,
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
      <a href='#'>RSVP</a>
    </div>
  );
};

export default Information;
