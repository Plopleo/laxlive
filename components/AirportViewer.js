'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import YouTubePlayer from "./YouTubePlayer";
import TableFlights from "./TableFlights";
import AirportClock from "./AirportClock";
import { airports } from '../data/airports';

export default function AirportViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [volume, setVolume] = useState(0);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const previousVolume = useRef(50);

  // Handle initial airport selection from URL
  useEffect(() => {
    const airportId = searchParams.get('airport');
    if (airportId) {
      const airport = airports.find(a => a.id === airportId);
      if (airport) {
        setSelectedAirport(airport);
      }
    } else {
      // If no airport in URL, default to LAX
      setSelectedAirport(airports[0]);
    }
  }, [searchParams]);

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleIconClick = () => {
    if (volume === 0) {
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setVolume(0);
    }
  };

  const handleAirportChange = (e) => {
    const airport = airports.find(a => a.id === e.target.value);
    setSelectedAirport(airport);
    router.push(`?airport=${e.target.value}`);
  };

  if (!selectedAirport) {
    return null;
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col-reverse md:flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <select 
            className="select select-bordered w-full max-w-xs"
            value={selectedAirport.id}
            onChange={handleAirportChange}
          >
            {airports.map(airport => (
              <option key={airport.id} value={airport.id}>
                {airport.name} ({airport.id})
              </option>
            ))}
          </select>

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

        {/* Title Block */}
        <div className="text-center mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold mb-2">{selectedAirport.name}</h1>
          <p className="text-lg text-base-content/70 mt-2">Watch live streams from {selectedAirport.city} International Airport</p>
          <AirportClock 
            airportId={selectedAirport.id}
            city={selectedAirport.city}
            timezone={selectedAirport.timezone}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {/* YouTube Live Stream */}
            <div className="p-4">
              <div className="aspect-video">
                <YouTubePlayer 
                  videoId={selectedAirport.youtubeVideoId} 
                  isMuted={volume === 0} 
                  volume={volume} 
                />
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
                  src={`https://www.flightradar24.com/simple?lat=${selectedAirport.coordinates.lat}&lon=${selectedAirport.coordinates.lon}&z=${selectedAirport.flightRadarZoom}`}
                  title={`${selectedAirport.id} Flight Radar`}
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
      <TableFlights airportId={selectedAirport.id} />

      {/* Footer */}
      <footer className="text-center py-6 text-base-content/70">
        <p>
          Made by{' '}
          <a
            href="https://leopold.dev/"
            target="_blank"
            className="hover:underline"
          >
            Léopold
          </a>
        </p>
      </footer>
    </main>
  );
} 