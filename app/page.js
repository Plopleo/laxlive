'use client';

import { useState, useRef } from 'react';
import YouTubePlayer from "../components/YouTubePlayer";
import TableFlights from "../components/TableFlights";
import ClockLAX from "../components/ClockLAX";

export default function Home() {
  const [volume, setVolume] = useState(0); // Start at 0 for muted autoplay
  const previousVolume = useRef(50); // Store previous volume when muting

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleIconClick = () => {
    if (volume === 0) {
      // Unmute by restoring previous volume
      setVolume(previousVolume.current);
    } else {
      // Mute by storing current volume and setting to 0
      previousVolume.current = volume;
      setVolume(0);
    }
  };

  return (
    <main className="space-y-8">
      <div className="relative">
        {/* Volume Control - Absolute positioned in top right */}
        <div className="absolute top-0 right-0 flex items-center gap-2 p-4">
          <div className="flex items-center gap-2 w-30">
            <button onClick={handleIconClick} className="hover:opacity-80 hover:cursor-pointer transition-opacity">
              {volume == 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="range range-xs"
            />
          </div>
        </div>

        {/* Centered Title Block */}
        <div className="text-center mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold mb-2">LAX Live</h1>
          <p className="text-lg text-base-content/70 mt-2">Watch live streams from Los Angeles International Airport</p>
          <ClockLAX />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {/* YouTube Live Stream */}
            <div className="p-4">
              <div className="aspect-video">
                <YouTubePlayer videoId="69lhJSzgfK8" isMuted={volume === 0} volume={volume} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {/* FlightRadar24 */}
            <div className="p-4">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.flightradar24.com/simple?lat=33.9425&lon=-118.4081&z=13"
                  title="LAX Flight Radar"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flights Table */}
      <TableFlights />

      {/* Footer */}
      <footer className="text-center py-6 text-base-content/70">
        <p>
          Made by{' '}
          <a
            href="https://twitter.com/plopleo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Léopold
          </a>
        </p>
      </footer>
    </main>
  );
}
