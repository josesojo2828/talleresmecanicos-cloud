"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

interface LocationPickerProps {
    className?: string;
    value: { lat: number; lng: number } | null;
    onChange: (val: { lat: number; lng: number }) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ className, value, onChange }) => {
    const t = useTranslations();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const initMap = async () => {
            if (!(window as any).maplibregl) {
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
                } else {
                    let attempts = 0;
                    while (!(window as any).maplibregl && isMounted && attempts < 50) {
                        await new Promise(r => setTimeout(r, 100));
                        attempts++;
                    }
                }
            }

            const maplibregl = (window as any).maplibregl;
            if (!isMounted || !mapContainer.current || !maplibregl || map.current) return;

            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
                center: value ? [value.lng, value.lat] : [-74.006, 40.7128], // Default center
                zoom: value ? 14 : 2
            });

            map.current.addControl(new maplibregl.NavigationControl());

            map.current.on('load', () => {
                if (isMounted) {
                    setMapReady(true);
                    
                    // Single draggable marker
                    const el = document.createElement('div');
                    el.className = 'admin-picker-marker';
                    el.style.width = '24px';
                    el.style.height = '24px';
                    el.style.backgroundColor = '#10b981';
                    el.style.border = '3px solid white';
                    el.style.borderRadius = '50%';
                    el.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                    el.style.cursor = 'grab';

                    markerRef.current = new maplibregl.Marker({
                        element: el,
                        draggable: true
                    })
                        .setLngLat(value ? [value.lng, value.lat] : [-74.006, 40.7128])
                        .addTo(map.current);

                    markerRef.current.on('dragend', () => {
                        const lngLat = markerRef.current.getLngLat();
                        onChange({ lat: lngLat.lat, lng: lngLat.lng });
                    });

                    map.current.on('click', (e: any) => {
                        markerRef.current.setLngLat(e.lngLat);
                        onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng });
                    });
                }
            });
        };

        initMap();

        return () => {
            isMounted = false;
            if (map.current) {
                map.current.remove();
                map.current = null;
                setMapReady(false);
            }
        };
    }, []);

    // Effect to handle external value changes (like initial load)
    useEffect(() => {
        if (!mapReady || !markerRef.current || !map.current || !value) return;
        const currentLngLat = markerRef.current.getLngLat();
        // Only update map if the new value is significantly different to prevent jitter
        if (Math.abs(currentLngLat.lat - value.lat) > 0.0001 || Math.abs(currentLngLat.lng - value.lng) > 0.0001) {
             markerRef.current.setLngLat([value.lng, value.lat]);
             map.current.flyTo({ center: [value.lng, value.lat], zoom: 14 });
        }
    }, [value, mapReady]);

    return (
        <div className="w-full space-y-2">
           <div className={cn("relative w-full h-64 overflow-hidden rounded-[1.5rem]", className)}>
                <div ref={mapContainer} className="w-full h-full" />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[1.5rem]" />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 italic">
                {t('action.drag_marker') || 'Arrastra el pin del mapa o haz clic para ubicar el taller'}
            </p>
        </div>
    );
};
