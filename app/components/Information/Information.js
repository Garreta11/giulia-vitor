import styles from './Information.module.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useRef, useContext } from 'react';
import { DataContext } from '@/app/context/context';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const photos = [
  {
    img: '/images/location/locationa1.jpg',
    alt: 'Location - Photo 1',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa2.jpg',
    alt: 'Location - Photo 2',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa3.jpg',
    alt: 'Location - Photo 3',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa4.jpg',
    alt: 'Location - Photo 4',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa5.jpg',
    alt: 'Location - Photo 5',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa6.jpg',
    alt: 'Location - Photo 6',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa7.jpg',
    alt: 'Location - Photo 7',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa8.jpg',
    alt: 'Location - Photo 8',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa9.jpg',
    alt: 'Location - Photo 9',
    width: 1512,
    height: 2016,
  },
  {
    img: '/images/location/locationa10.jpg',
    alt: 'Location - Photo 10',
    width: 1512,
    height: 2016,
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

        <div className={styles.information__location__direction}>
          <p>Casa Amarela, Goiânia, Brasil</p>
          <Link
            href='https://maps.app.goo.gl/dJpMTiNMVsU8BxTr7'
            target='_blank'
          >
            {t('directions')}
            <svg
              width='14'
              height='14'
              viewBox='0 0 14 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M2.3874 0.595174C1.97332 0.605215 1.64579 0.949152 1.65583 1.36323C1.66587 1.77732 2.00981 2.10485 2.42389 2.09481L11.0547 1.88494L0.63618 12.3034C0.343289 12.5963 0.343226 13.0712 0.63618 13.3641C0.929064 13.657 1.40395 13.657 1.69684 13.3641L12.1156 2.94531L11.9057 11.5766C11.8956 11.9907 12.2231 12.3346 12.6372 12.3446C13.0513 12.3547 13.3952 12.0271 13.4053 11.613L13.6543 1.37016C13.66 1.13675 13.5854 0.920868 13.4562 0.74798C13.4296 0.708523 13.399 0.671047 13.3641 0.636186C13.329 0.601043 13.2912 0.570071 13.2514 0.543413C13.0787 0.41472 12.8632 0.340475 12.6303 0.346132L2.3874 0.595174Z'
                fill='#212121'
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Information;
