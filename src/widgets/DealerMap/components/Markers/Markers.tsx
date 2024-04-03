import React, {useEffect, useMemo, useRef, useState} from 'react';
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
            console.log('Setting bounds')
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
    }, [map]);

    // Update markers
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers((prev: any) => {
            if (marker) {
                return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };


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
                        key={`AdvMarker-${i}`}
                        ref={(marker: any) => setMarkerRef(marker, point.key)}
                        onClick={(marker: any) => onMarkerClick && onMarkerClick(marker, point)}
                    >
                        <div className={markerClasses}></div>
                    </AdvancedMarker>
                ))}
            </>
        )
    }, [points])

    return (
        <>
            {markerCluster}
        </>
    )
}
