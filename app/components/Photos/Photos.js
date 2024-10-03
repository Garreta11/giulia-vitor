'use client';
import { useLayoutEffect, useRef } from 'react';
import styles from './Photos.module.scss';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParallaxProvider, useParallax } from 'react-scroll-parallax';

gsap.registerPlugin(ScrollTrigger);

const parallax = [20, -30, 80, 80, -10, 0, -10, 40];

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
];

// Separate PhotoItem to ensure the useParallax hook works within ParallaxProvider
const PhotoItem = ({ photo, parallaxSpeed }) => {
  const { ref } = useParallax({ speed: parallaxSpeed });

  return (
    <div
      ref={ref}
      className={`${styles.photos__item} ${
        photo.width > photo.height
          ? styles.photos__item__horizontal
          : styles.photos__item__vertical
      }`}
    >
      <Image
        className='parallax'
        src={photo.img}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
      />
    </div>
  );
};

const Photos = () => {
  const sliderRef = useRef(null);

  useLayoutEffect(() => {
    const elementsImg = sliderRef.current.querySelectorAll('.parallax');
    elementsImg.forEach((img) => {
      gsap.fromTo(
        img,
        {
          yPercent: -15,
          scale: 1.5,
        },
        {
          yPercent: 15,
          scale: 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top top',
            scrub: true,
            markers: false,
          },
        }
      );
    });
  }, []);

  return (
    <div id='gallery' ref={sliderRef} className={styles.photos}>
      <ParallaxProvider>
        <div className={styles.photos__container}>
          {photos.map((photo, index) => (
            <PhotoItem
              key={photo.img}
              photo={photo}
              parallaxSpeed={parallax[index]}
            />
          ))}
        </div>
      </ParallaxProvider>
    </div>
  );
};

export default Photos;
