import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import styles from './Markers.module.sass'
import {classNames} from '~/lib/helpers'
import {AdvancedMarker, Pin, useMap} from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import {MapPoint} from "~/types";

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface MarkersProps {
    points: MapPoint[]
    onMarkerClick?: (marker: Marker, point: MapPoint) => void;
}

export default function Markers(props: MarkersProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        points,
        onMarkerClick
    } = props

    const map = useMap();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
    const [activeMarker, setActiveMarker] = useState(null);
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (map) {
            let bounds = new window.google.maps.LatLngBounds();
            for(let i = 0; i < points.length; i++) {
                bounds.extend( new window.google.maps.LatLng(points[i].lat, points[i].lng));
            }
            map.fitBounds(bounds)
        }
    }, [points, map])

    // Initialize MarkerClusterer
    useEffect(() => {
        if (!map) return;

        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
        }

        return () => {
            // Clean up clusterer on unmount
            clusterer.current?.clearMarkers();
        };
    }, [map]);

    // Update markers
    useEffect(() => {
        if (!map || Object.keys(markers).length < points.length) return;

        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [map, markers, points]);

    // This function is running over 45 000 times. It's not good. Refactor please.
    const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
        if (!marker) return;
        if (markers[key]) return;

        console.log('Setting marker')

        setMarkers((prev: any) => {
            if (marker) {
                return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        });
    }, [markers]);


    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const markerClasses = classNames(
        styles.Marker
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    const markerCluster = useMemo(() => {
        return (
            <>
                {points.map((point: MapPoint, i: number) => (
                    <AdvancedMarker
                        position={point}
                        key={point.key}
                        ref={(marker: any) => setMarkerRef(marker, point.key)}
                        onClick={(marker: any) => onMarkerClick && onMarkerClick(marker, point)}
                    >
                        <div className={markerClasses}></div>
                    </AdvancedMarker>
                ))}
            </>
        )
    }, [points, onMarkerClick, setMarkerRef]);

    return (
        <>
            {markerCluster}
        </>
    )
}
