import { useEffect, useContext, useRef } from 'react';
import { DataContext } from '@/app/context/context';
import styles from './Hero.module.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { start } = useContext(DataContext);
  const imgRef = useRef();
  useEffect(() => {
    // Scroll to the top of the page when the component is loaded
    window.scrollTo(0, 0);
    if (start) {
      // Header
      gsap.to('#header', {
        scrollTrigger: {
          trigger: `.${styles.hero}`,
          start: 'top top', // Adjust start point as needed
          end: 'bottom bottom', // Adjust end point as needed
          scrub: true, // Smooth scrolling effect
        },
        height: 150, // Fade out effect as an example
      });
      gsap.to('#header-wrapper', {
        scrollTrigger: {
          trigger: `.${styles.hero}`,
          start: 'top top', // Adjust start point as needed
          end: 'bottom bottom', // Adjust end point as needed
          scrub: true, // Smooth scrolling effect
        },
        width: '100%', // Fade out effect as an example
        top: 0, // Move up slightly as an example
        y: 0,
      });

      // Header SVG
      const svgs = document.getElementsByClassName('header-svg');
      gsap.fromTo(
        svgs,
        {
          width: 600,
        },
        {
          scrollTrigger: {
            trigger: `.${styles.hero}`,
            start: 'top top', // Adjust start point as needed
            end: 'bottom bottom', // Adjust end point as needed
            scrub: true, // Smooth scrolling effect
          },
          width: 224,
        }
      );

      // Image Animation
      gsap.fromTo(
        imgRef.current,
        {
          width: 0,
        },
        {
          scrollTrigger: {
            trigger: `.${styles.hero}`,
            start: 'top top', // Adjust start point as needed
            end: 'bottom bottom', // Adjust end point as needed
            scrub: true, // Smooth scrolling effect
          },
          width: '100%',
          height: '100%',
        }
      );
    }
  }, [start]);
  return (
    <div className={`${styles.hero} section`}>
      <img
        className={styles.hero__image}
        ref={imgRef}
        src='./images/photos/photo1.JPG'
      />
    </div>
  );
};

export default Hero;
