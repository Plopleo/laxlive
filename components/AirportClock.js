'use client';

import { useState, useEffect } from 'react';

export default function AirportClock({ airportId, city, timezone }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        function updateTime() {
            const now = new Date();
            const options = {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            setTime(now.toLocaleTimeString('en-US', options));
        }

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [timezone]);

    return (
        <div className="text-lg font-medium text-base-content/70">
            {city}: {time}
        </div>
    );
} 