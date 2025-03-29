'use client';

import { useState, useEffect } from 'react';
import { getFlights } from '../app/actions';

export default function TableFlights() {
    const [arrivals, setArrivals] = useState([]);
    const [departures, setDepartures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchTime, setLastFetchTime] = useState(null);

    const fetchFlights = async () => {
        setIsLoading(true);
        try {
            const data = await getFlights();
            setLastFetchTime(new Date());

            // Filter for arrivals to LAX
            const laxArrivals = Object.values(data)
                .filter(flight => {
                    if (!Array.isArray(flight)) return false;
                    return flight[12] === 'LAX' && flight[11] !== 'LAX';
                })
                .map(flight => ({
                    time: flight[10] || 'N/A',
                    flightNumber: flight[13] || 'N/A',
                    fullFlightNumber: flight[16] || 'N/A',
                    airline: flight[18] || 'N/A',
                    from: flight[11] || 'N/A',
                    to: flight[12] || 'N/A',
                    aircraft: flight[8] || 'N/A',
                    aircraftId: flight[9] || 'N/A',
                    altitude: flight[4] || 'N/A',
                    speed: flight[5] || 'N/A',
                    heading: flight[3] || 'N/A'
                }))
                .sort((a, b) => {
                    // First sort by whether flight numbers exist
                    if (a.flightNumber === 'N/A' && b.flightNumber !== 'N/A') return 1;
                    if (a.flightNumber !== 'N/A' && b.flightNumber === 'N/A') return -1;
                    if (a.flightNumber === 'N/A' && b.flightNumber === 'N/A') return 0;
                    // Then sort by altitude
                    return a.altitude - b.altitude;
                })
                .slice(0, 20);

            // Filter for departures from LAX
            const laxDepartures = Object.values(data)
                .filter(flight => {
                    if (!Array.isArray(flight)) return false;
                    return flight[11] === 'LAX' && flight[12] !== 'LAX';
                })
                .map(flight => ({
                    time: flight[10] || 'N/A',
                    flightNumber: flight[13] || 'N/A',
                    fullFlightNumber: flight[16] || 'N/A',
                    airline: flight[18] || 'N/A',
                    from: flight[11] || 'N/A',
                    to: flight[12] || 'N/A',
                    aircraft: flight[8] || 'N/A',
                    aircraftId: flight[9] || 'N/A',
                    altitude: flight[4] || 'N/A',
                    speed: flight[5] || 'N/A',
                    heading: flight[3] || 'N/A'
                }))
                .sort((a, b) => {
                    // First sort by whether flight numbers exist
                    if (a.flightNumber === 'N/A' && b.flightNumber !== 'N/A') return 1;
                    if (a.flightNumber !== 'N/A' && b.flightNumber === 'N/A') return -1;
                    if (a.flightNumber === 'N/A' && b.flightNumber === 'N/A') return 0;
                    // Then sort by altitude
                    return a.altitude - b.altitude;
                })
                .slice(0, 20);

            setArrivals(laxArrivals);
            setDepartures(laxDepartures);
            setError(null);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setError('Failed to load flight data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchFlights();

        // Set up interval for updates
        const interval = setInterval(fetchFlights, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Arrivals Table */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Arrivals</h2>
                        <button
                            className="btn btn-circle btn-ghost"
                            onClick={fetchFlights}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="h-[350px] overflow-y-auto">
                            <table className="table table-zebra">
                                <thead className="sticky top-0 bg-base-100 z-10">
                                    <tr>
                                        <th>Flight</th>
                                        <th>Airline</th>
                                        <th>From</th>
                                        <th>Aircraft</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {arrivals.map((flight, index) => (
                                        <tr key={`arrival-${index}`}>
                                            <td className="font-mono">
                                                <a
                                                    className="link link-hover"
                                                    href={`https://www.flightradar24.com/${flight.fullFlightNumber}`}
                                                    target="_blank"
                                                >
                                                    {flight.flightNumber}
                                                </a>
                                            </td>
                                            <td>{flight.airline}</td>
                                            <td className="font-mono">{flight.from}</td>
                                            <td className="font-mono">{flight.aircraft}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        {lastFetchTime && (
                            <div className="text-sm text-base-content/70">
                                Last updated: {lastFetchTime.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Departures Table */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Departures</h2>
                        <button
                            className="btn btn-circle btn-ghost"
                            onClick={fetchFlights}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="h-[350px] overflow-y-auto">
                            <table className="table table-zebra">
                                <thead className="sticky top-0 bg-base-100 z-10">
                                    <tr>
                                        <th>Flight</th>
                                        <th>Airline</th>
                                        <th>To</th>
                                        <th>Aircraft</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departures.map((flight, index) => (
                                        <tr key={`departure-${index}`}>
                                            <td className="font-mono">
                                                <a
                                                    className="link link-hover"
                                                    href={`https://www.flightradar24.com/${flight.fullFlightNumber}`}
                                                    target="_blank"
                                                >
                                                    {flight.flightNumber}
                                                </a>
                                            </td>
                                            <td>{flight.airline}</td>
                                            <td className="font-mono">{flight.to}</td>
                                            <td className="font-mono">{flight.aircraft}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        {lastFetchTime && (
                            <div className="text-sm text-base-content/70">
                                Last updated: {lastFetchTime.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 