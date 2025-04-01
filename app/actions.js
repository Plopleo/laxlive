'use server';

export async function getFlights(airportId, coordinates) {
    try {
        // Calculate bounds based on airport coordinates
        // We'll use a small box around the airport (approximately 5km radius)
        const latOffset = 0.025; // roughly 2.5km
        const lonOffset = 0.025; // roughly 2.5km at the equator
        
        const bounds = {
            north: coordinates.lat + latOffset,
            south: coordinates.lat - latOffset,
            west: coordinates.lon - lonOffset,
            east: coordinates.lon + lonOffset
        };

        const response = await fetch(`https://data-cloud.flightradar24.com/zones/fcgi/feed.js?faa=1&bounds=${bounds.north},${bounds.south},${bounds.east},${bounds.west}&satellite=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=14400&gliders=1&altitude=0,50000&speed=0,1000&stats=1`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching flight data:', error);
        throw new Error('Failed to fetch flight data');
    }
} 