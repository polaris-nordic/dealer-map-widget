import React, {useId, useState} from 'react';
import styles from './MapView.module.sass'
import {classNames} from '~/lib/helpers'
import {useWidget} from "~/context";
import {Markers} from "~/widgets/DealerMap/components";
import {Map} from "@vis.gl/react-google-maps";
import {mapStyle} from "~/widgets/DealerMap/mapStyles";
import {MapPoint} from "~/types";
import {Marker} from "@googlemaps/markerclusterer";

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface MapViewProps {
    points: MapPoint[]
}

export default function MapView(props: MapViewProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        points
    } = props

    const { widgetSettings, positionSearching, handleMarkerClick, t } = useWidget()
    const mapId = useId();

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const mapviewClasses = classNames(
        styles.MapView
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    const selectedMapStyle = mapStyle[widgetSettings.map.style as keyof typeof mapStyle] as google.maps.MapTypeStyle[];

    return (
        <div className={mapviewClasses}>
            <Map
                mapId={'bf51a910020fa25a'}
                gestureHandling={'greedy'}
                defaultZoom={widgetSettings.map.zoom}
                disableDefaultUI={true}
                className={styles.Map}
                defaultCenter={{lat: 53.54992, lng: 10.00678}}
                styles={selectedMapStyle}
                mapTypeId={widgetSettings.map.type}
            >
                <Markers key={`Markers-nop`} points={points} onMarkerClick={(_marker: Marker, point: MapPoint) => handleMarkerClick(point)}/>
            </Map>
            <div className={classNames(styles.Searching, positionSearching && styles.IsSearching)}>
                <svg className={styles.Spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3}></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{ t('gettingPosition', 'Getting your position...') }</span>
            </div>
        </div>
    )
}
