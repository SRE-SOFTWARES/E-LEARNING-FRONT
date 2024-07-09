import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const PlyrVideoComponent = ({ videoId }: { videoId: string }) => {
  const playerRef = useRef(null); // Create a reference to the Plyr instance
  const playerContainerRef = useRef(null); // Reference to the player container

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Plyr when component mounts
      const player = new Plyr(playerContainerRef.current, {
        controls: [
          'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
        ],
        settings: ['captions', 'quality', 'speed', 'loop'],
        quality: {
          default: 1080,
          options: [1080, 720, 480],
          forced: true,
        },
        youtube: {
          noCookie: true, // Enable privacy-enhanced mode (no cookies)
          rel: 0, // No related videos at end
          showinfo: 0, // Hide video title and player actions
          iv_load_policy: 3, // Hide annotations
        },
      });

      playerRef.current = player; // Store the Plyr instance in the reference

      const hideYouTubeButtons = () => {
        const style = document.createElement('style');
        style.innerHTML = `
          .ytp-button.ytp-share-button,
          .ytp-button.ytp-watch-later-button,
          .ytp-button.ytp-copylink-button,
          .ytp-button.ytp-search-button,
          .ytp-button.ytp-cards-button,
          .ytp-button.ytp-overflow-button {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      };

      hideYouTubeButtons();

      // Cleanup function to destroy Plyr and remove style when component unmounts
      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null; // Clear the reference
        }

        const style = document.querySelector('style');
        if (style) {
          document.head.removeChild(style);
        }
      };
    }
  }, [videoId]); // Only run once on mount, no dependencies

  useEffect(() => {
    // Update Plyr source when videoId changes
    if (playerRef.current && videoId) {
      const source = {
        type: 'video',
        sources: [{
          src: `https://www.youtube.com/embed/${videoId}`,
          provider: 'youtube',
        }],
      };

      // Replace the current source with the new one
      playerRef.current.source = source;

      // Load the new source
      playerRef.current.play();
    }
  }, [videoId]); // Re-run effect when videoId changes

  return (
    <div className="plyr__video-embed relative" ref={playerContainerRef}>
      <div
        className="absolute top-0 left-0 w-full z-10"
        style={{ background: 'transparent' }}
      />
      <iframe
        id="player"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

export default PlyrVideoComponent;
