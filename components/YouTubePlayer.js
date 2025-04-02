'use client';

import { useEffect, useRef } from 'react';

export default function YouTubePlayer({ videoId, channelId, isMuted, volume }) {
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Initialize player when API is ready
        window.onYouTubeIframeAPIReady = () => {
            if (videoId || channelId) {
                initializePlayer();
            }
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            delete window.onYouTubeIframeAPIReady;
        };
    }, []); // Only run once on mount

    // Separate effect for player initialization
    useEffect(() => {
        if (window.YT && window.YT.Player && (videoId || channelId)) {
            initializePlayer();
        }
    }, [videoId, channelId]); // Re-run when videoId or channelId changes

    const initializePlayer = () => {
        if (!videoId && !channelId) return; // Don't initialize if no videoId or channelId

        if (playerRef.current) {
            playerRef.current.destroy();
        }

        const playerVars = {
            autoplay: 1,
            mute: 1, // Always start muted for autoplay
            controls: 1,
            disablekb: 0,
            enablejsapi: 1,
            fs: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
        };

        // If we have a channelId, load the live stream
        if (channelId) {
            playerVars.list = `UU${channelId.slice(2)}`; // Convert channel ID to playlist ID
            playerVars.listType = 'live';
        }

        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: videoId || undefined,
            playerVars: playerVars,
            events: {
                onReady: (event) => {
                    const player = event.target;
                    player.setVolume(volume);
                    if (!isMuted) {
                        player.unMute();
                    }
                    player.playVideo();
                }
            }
        });
    };

    // Handle volume and mute changes
    useEffect(() => {
        if (playerRef.current) {
            const player = playerRef.current;
            if (volume > 0) {
                player.unMute();
                player.setVolume(volume);
            } else {
                player.mute();
            }
        }
    }, [volume]);

    return (
        <div className="aspect-video w-full">
            <div
                ref={containerRef}
                className="w-full h-full rounded-lg"
            />
        </div>
    );
} 