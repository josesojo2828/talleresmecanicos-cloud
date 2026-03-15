"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface MapProps {
    className?: string;
    center?: [number, number]; // [lat, lng]
    zoom?: number;
    markers?: { lat: number; lng: number; title: string, address?: string, phone?: string }[];
    userLocation?: [number, number] | null;
}

export const Map: React.FC<MapProps> = ({ className, center = [0, 0], zoom = 2, markers = [], userLocation }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const userMarkerRef = useRef<any>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const initMap = async () => {
            if (!(window as any).maplibregl) {
                // ... same script loading as before
                const scriptExists = document.querySelector('script[src*="maplibre-gl.js"]');
                if (!scriptExists) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js';
                    script.async = true;
                    document.head.appendChild(script);

                    const link = document.createElement('link');
                    link.href = 'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css';
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);

                    await new Promise((resolve) => script.onload = resolve);
                }
            }

            const maplibregl = (window as any).maplibregl;
            if (map.current) return;

            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
                center: userLocation ? [userLocation[1], userLocation[0]] : [center[1], center[0]],
                zoom: userLocation ? 12 : zoom
            });

            map.current.addControl(new maplibregl.NavigationControl());
        };

        initMap();

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Update user location marker
    useEffect(() => {
        if (!map.current || !userLocation) return;
        const maplibregl = (window as any).maplibregl;
        if (!maplibregl) return;

        if (userMarkerRef.current) userMarkerRef.current.remove();

        const el = document.createElement('div');
        el.className = 'user-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundColor = '#3b82f6';
        el.style.border = '3px solid white';
        el.style.borderRadius = '50%';
        el.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';

        userMarkerRef.current = new maplibregl.Marker(el)
            .setLngLat([userLocation[1], userLocation[0]])
            .addTo(map.current);

        map.current.flyTo({ center: [userLocation[1], userLocation[0]], zoom: 12 });
    }, [userLocation]);

    // Update workshop markers
    useEffect(() => {
        if (!map.current) return;
        const maplibregl = (window as any).maplibregl;
        if (!maplibregl) return;

        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        markers.forEach(marker => {
            if (!marker.lat || !marker.lng) return;

            const popupHtml = `
                <div style="padding: 10px; min-width: 150px;">
                    <h4 style="margin: 0 0 4px 0; font-weight: 800; text-transform: uppercase; font-size: 11px;">${marker.title}</h4>
                    <p style="margin: 0; font-size: 10px; color: #64748b;">${marker.address || ''}</p>
                    ${marker.phone ? `<p style="margin: 4px 0 0 0; font-size: 10px; color: #10b981; font-weight: 700;">${marker.phone}</p>` : ''}
                </div>
            `;

            const m = new maplibregl.Marker({ color: '#10b981' })
                .setLngLat([marker.lng, marker.lat])
                .setPopup(new maplibregl.Popup({ 
                    closeButton: false,
                    closeOnClick: false,
                    className: 'workshop-popup'
                }).setHTML(popupHtml))
                .addTo(map.current);
            
            const markerDiv = m.getElement();
            markerDiv.addEventListener('mouseenter', () => m.togglePopup());
            markerDiv.addEventListener('mouseleave', () => m.togglePopup());
            markerDiv.style.cursor = 'pointer';

            markersRef.current.push(m);
        });
    }, [markers]);

    return (
        <div className={cn("relative w-full h-full overflow-hidden rounded-[2rem]", className)}>
            <div ref={mapContainer} className="w-full h-full" />
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[2rem]" />
        </div>
    );
};
