import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const PlyrVideoComponent = ({ videoId }: { videoId: string }) => {
  const playerRef = useRef(null); // Create a reference to the Plyr instance

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Plyr when component mounts
      const player = new Plyr('#player', {
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
          #player iframe {
            pointer-events: none;
          }
          #player iframe::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 9999;
            pointer-events: auto;
          }
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
          playerRef.current?.destroy();
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
          src: `https://www.youtube.com/watch?v=${videoId}`,
          provider: 'youtube',
        }],
      };

      // Replace the current source with the new one
      playerRef.current.source = source;

      // Load the new source
      playerRef.current?.play();
    }
  }, [videoId]); // Re-run effect when videoId changes

  return (
    <div className="plyr__video-embed relative">
      <div
        className="absolute top-0 left-0 w-full h-[10%] z-10"
        style={{ background: 'transparent' }}
      />
      <video id="player" playsInline />
    </div>
  );
};

export default PlyrVideoComponent;
