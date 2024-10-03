'use client';
import { useEffect, useState, useRef } from 'react';
import styles from './Playlist.module.scss';
import { getPlaylist } from '@/app/utils/spotify';
import { useMousePosition } from '@/app/utils/Mouse';

const Playlist = () => {
  const audioRef = useRef(null);

  const mousePosition = useMousePosition();

  const [playlist, setPlaylist] = useState(null); // Create state for playlist
  const [currentAlbumImage, setCurrentAlbumImage] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null); // Create state for current track
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing

  const fetchPlaylist = async () => {
    const data = await getPlaylist(); // Call getPlaylist and wait for result
    setPlaylist(data); // Store playlist in state
  };

  useEffect(() => {
    fetchPlaylist(); // Fetch playlist when component mounts
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load(); // Reload the audio source
      audioRef.current.play(); // Automatically play the new track
      setIsPlaying(true);
    }
  }, [currentTrack]); // This effect runs whenever currentTrack is updated

  const handleMouseEnter = (track) => {
    setCurrentAlbumImage(track.album.images[1].url);
    setCurrentTrack(track.preview_url); // Set the new track
  };

  const handleMouseLeave = () => {
    audioRef.current.pause(); // Pause the audio when mouse leaves
    setCurrentAlbumImage(null);
    setIsPlaying(false);
  };

  return (
    <div id='playlist' className={`${styles.playlist} section`}>
      <h2 className={styles.playlist__title}>PLAYLIST</h2>
      <p className={styles.playlist__description}>
        Enjoy the playlist your friends specially curated for you
      </p>
      {/* Render playlist data */}
      {playlist ? (
        <>
          <div className={styles.playlist__tracks}>
            {playlist.tracks.items.map((item) => (
              <div
                key={item.track.id}
                className={styles.playlist__track}
                onMouseEnter={() => handleMouseEnter(item.track)}
                onMouseLeave={handleMouseLeave}
              >
                <p>{item.track.name}</p>
              </div>
            ))}
            <audio ref={audioRef} controls={false}>
              <source src={currentTrack} type='audio/mpeg' />
              Your browser does not support the audio element.
            </audio>
          </div>
          {currentAlbumImage && (
            <img
              className={styles.playlist__cover}
              src={currentAlbumImage}
              alt='Playlist cover'
              style={{
                position: 'absolute',
                top: `${mousePosition.y}px`, // Set the image's position based on mouse
                left: `${mousePosition.x}px`,
              }}
            />
          )}
        </>
      ) : (
        <p>Loading playlist...</p>
      )}
    </div>
  );
};

export default Playlist;
