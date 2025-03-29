'use client';

import { useState, useEffect } from 'react';

export default function ClockLAX() {
    const [time, setTime] = useState('');

    useEffect(() => {
        function updateTime() {
            const now = new Date();
            const options = {
                timeZone: 'America/Los_Angeles',
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
    }, []);

    return (
        <div className="text-lg font-medium text-base-content/70">
            Los Angeles: {time}
        </div>
    );
} 