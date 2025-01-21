'use client';
import { useEffect, useState, useRef } from 'react';
import { getPlaylist } from '@/app/utils/spotify';

import { useTranslations } from 'next-intl';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './PlaylistWebGL.module.scss';
import Image from 'next/image';
import Output from './Output';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger

const PlaylistWebGL = () => {
  const t = useTranslations('Playlist');

  const canvasRef = useRef(null);
  const outputRef = useRef();
  const speedRef = useRef(0);
  const audioRef = useRef(0);

  const [playlist, setPlaylist] = useState(null); // Create state for playlist
  const [showList, setShowList] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(0);

  const fetchPlaylist = async () => {
    const data = await getPlaylist(); // Call getPlaylist and wait for result
    setPlaylist(data); // Store playlist in state
  };

  useEffect(() => {
    fetchPlaylist(); // Fetch playlist when component mounts
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && playlist) {
      const output = new Output({
        targetElement: canvasRef.current,
        audio: audioRef.current,
        window: window,
      });

      outputRef.current = output;

      let position = 0;
      let rounded = 0;

      let attractMode = true;
      let attractTo = 0;

      let songIsPlaying = false;

      let objs = Array(playlist.length).fill({ dist: 0 });

      function raf() {
        position += speedRef.current;
        speedRef.current *= 0.9;

        // Clamp position so we don't have infinite scroll
        position = Math.min(Math.max(position, 0), objs.length - 1);

        rounded = Math.round(position);
        let diff = rounded - position;

        if (attractMode) {
          position += -(position - attractTo) * 0.1;
        } else {
          position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
        }
        // Circle Slider
        let radius = 1.5;
        let scale = 1.5;
        let initScale = 0.1;

        objs.forEach((o, i) => {
          o.dist = Math.min(Math.abs(position - i), 1);
          o.dist = 1 - o.dist ** 2;

          // Circle Slider
          let angle = ((i - position) / objs.length) * Math.PI * 2;

          gsap.to(output.meshes[i].position, {
            x: radius * Math.cos(angle + Math.PI / 2),
            y: radius * Math.sin(angle + Math.PI / 2) - o.dist * 1.5,
            z: o.dist,
          });

          gsap.to(output.meshes[i].scale, {
            x: initScale + scale * o.dist,
            y: initScale + scale * o.dist,
            z: initScale + scale * o.dist,
          });

          if (songIsPlaying) {
            if (i === Number(list.getAttribute('data-song'))) {
              output.meshes[i].rotation.z -= o.dist * 0.01;
            } else {
              output.meshes[i].rotation.z = 0;
            }
          } else {
            gsap.to(output.meshes[i].rotation, {
              z: 0,
            });
          }

          output.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;
        });

        //wrap.style.transform = `translate(${-position * 50 + 25}px, 0)`;
        requestAnimationFrame(raf);
      }

      raf();

      let navs = Array.from(document.querySelectorAll('.item'));
      let list = document.querySelector('.list');

      navs.forEach((el, i) => {
        el.addEventListener('mouseover', (e) => {
          attractTo = Number(e.target.getAttribute('data-nav'));
        });
      });

      list.addEventListener('mouseleave', (e) => {
        attractTo = list.getAttribute('data-song');
      });

      // AUDIO
      const audioElement = audioRef.current;
      const handlePlay = () => {
        setIsPlaying(true);
        songIsPlaying = true;
      };

      const handlePause = () => {
        setIsPlaying(false);
        songIsPlaying = false;
      };

      const handleEnded = () => {
        setIsPlaying(false);
        if (Number(list.getAttribute('data-song')) === playlist.length - 1) {
          setSelectedSong(0);
          attractTo = 0;
          audioRef.current.src = playlist[0].track.preview_url;
        } else {
          const newSong = Number(list.getAttribute('data-song')) + 1;
          attractTo = newSong;
          setSelectedSong(newSong);
          audioRef.current.src = playlist[newSong].track.preview_url;
        }
        togglePlayPause();
      };

      if (audioElement) {
        audioElement.addEventListener('play', handlePlay);
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('ended', handleEnded);
      }

      // Cleanup event listeners on unmount
      return () => {
        if (audioElement) {
          audioElement.removeEventListener('play', handlePlay);
          audioElement.removeEventListener('pause', handlePause);
          audioElement.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [playlist]);

  const togglePlayPause = () => {
    const audioElement = audioRef.current;
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  };

  const handleClick = (song, index) => {
    const id = song.track.id;
    const url = song.track.preview_url;
    setShowList(false);
    setSelectedSong(index);
    if (url !== null) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  return (
    <div id='playlist' className={`${styles.playlist} section`}>
      <div className={styles.playlist__header}>
        <h2 className={styles.playlist__title}>{t('title')}</h2>
        <p className={styles.playlist__description}>{t('text')}</p>
      </div>

      <div id='wrap' className={styles.playlist__wrap}>
        {playlist?.map((song, index) => {
          return (
            <div
              key={index}
              className={`n ${styles.playlist__item} ${
                styles[`main__n__${index}`]
              }`}
            >
              <div className={styles.playlist__item__image}>
                <p>{song.track.name}</p>
                <Image
                  className='gallery-images'
                  src={song.track.album.images[0].url}
                  alt={String(index)}
                  width={song.track.album.images[0].width}
                  height={song.track.album.images[0].height}
                  data-song={song.track.preview_url}
                />
              </div>
            </div>
          );
        })}
      </div>

      {playlist && (
        <>
          <audio ref={audioRef} controls={false}>
            <source
              src={playlist[selectedSong].track.preview_url}
              type='audio/mpeg'
            />
            Your browser does not support the audio element.
          </audio>
          <div className={styles.playlist__wrapper}>
            <div className={styles.playlist__wrapper__left}>
              <div
                className={`${styles.playlist__list} list`}
                onMouseEnter={() => setShowList(true)}
                onMouseLeave={() => setShowList(false)}
                onClick={() => setShowList((prev) => !prev)}
                data-song={selectedSong}
                data-lenis-prevent
              >
                <div className={styles.playlist__list__header}>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    onClick={togglePlayPause}
                    className={styles.playlist__list__header__play}
                  >
                    {!isPlaying && (
                      <path
                        d='M8.8556 6.15498C8.0225 5.69354 7 6.29608 7 7.24847V12.7516C7 13.704 8.0225 14.3065 8.8556 13.8451L14.6134 10.6561C14.852 10.524 15 10.2727 15 10C15 9.7273 14.852 9.4761 14.6134 9.3439L8.8556 6.15498ZM10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM1.5 10C1.5 5.30558 5.30558 1.5 10 1.5C14.6944 1.5 18.5 5.30558 18.5 10C18.5 14.6944 14.6944 18.5 10 18.5C5.30558 18.5 1.5 14.6944 1.5 10Z'
                        fill='#e8e8e8'
                      />
                    )}
                    {isPlaying && (
                      <path
                        d='M8.5 6.25C8.5 5.83579 8.1642 5.5 7.75 5.5C7.33579 5.5 7 5.83579 7 6.25V13.75C7 14.1642 7.33579 14.5 7.75 14.5C8.1642 14.5 8.5 14.1642 8.5 13.75V6.25ZM13 6.25C13 5.83579 12.6642 5.5 12.25 5.5C11.8358 5.5 11.5 5.83579 11.5 6.25V13.75C11.5 14.1642 11.8358 14.5 12.25 14.5C12.6642 14.5 13 14.1642 13 13.75V6.25ZM10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM1.5 10C1.5 5.30558 5.30558 1.5 10 1.5C14.6944 1.5 18.5 5.30558 18.5 10C18.5 14.6944 14.6944 18.5 10 18.5C5.30558 18.5 1.5 14.6944 1.5 10Z'
                        fill='#e8e8e8'
                      />
                    )}
                  </svg>
                  <div className={styles.playlist__list__header__content}>
                    <div className={styles.playlist__list__header__number}>
                      ({selectedSong + 1}/{playlist.length})
                    </div>
                    <div className={styles.playlist__list__header__info}>
                      <p
                        className={`${
                          styles.playlist__list__header__info__song
                        } ${
                          isPlaying
                            ? styles.playlist__list__header__info__song__playing
                            : ''
                        }`}
                      >
                        {playlist[selectedSong].track.name} -{' '}
                        {playlist[selectedSong].track.artists[0].name}
                      </p>
                    </div>
                  </div>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M4 6L8 10L12 6'
                      stroke='#e8e8e8'
                      strokeWidth='2'
                    ></path>
                  </svg>
                </div>

                <div
                  className={`${styles.playlist__list__wrapper} ${
                    showList ? styles.playlist__list__wrapper__show : ''
                  }`}
                >
                  {playlist?.map((song, index) => {
                    return (
                      <div
                        key={index}
                        className={`${styles.playlist__list__item} item`}
                        data-nav={index}
                        onClick={() => {
                          handleClick(song, index);
                        }}
                      >
                        <p className={styles.playlist__list__item__song}>
                          {song.track.name}
                        </p>
                        <p className={styles.playlist__list__item__artist}>
                          {song.track.artists[0].name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                className={styles.playlist__wrapper__left__button}
                href='https://open.spotify.com/playlist/5OAdJaEhIju8OYKCSNRDD4?si=a0ae32ddea704d25'
                target='_blank'
              >
                Spotify
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2.3874 0.595174C1.97332 0.605215 1.64579 0.949152 1.65583 1.36323C1.66587 1.77732 2.00981 2.10485 2.42389 2.09481L11.0547 1.88494L0.63618 12.3034C0.343289 12.5963 0.343226 13.0712 0.63618 13.3641C0.929064 13.657 1.40395 13.657 1.69684 13.3641L12.1156 2.94531L11.9057 11.5766C11.8956 11.9907 12.2231 12.3346 12.6372 12.3446C13.0513 12.3547 13.3952 12.0271 13.4053 11.613L13.6543 1.37016C13.66 1.13675 13.5854 0.920868 13.4562 0.74798C13.4296 0.708523 13.399 0.671047 13.3641 0.636186C13.329 0.601043 13.2912 0.570071 13.2514 0.543413C13.0787 0.41472 12.8632 0.340475 12.6303 0.346132L2.3874 0.595174Z'
                    fill='#e8e8e8'
                  />
                </svg>
              </Link>
            </div>
            <div className={styles.playlist__canvas} ref={canvasRef} />
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistWebGL;
