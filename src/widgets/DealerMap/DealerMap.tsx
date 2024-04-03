import React, {useEffect, useId, useState} from 'react';
import styles from './DealerMap.module.sass'
import {classNames} from '~/lib/helpers'
import { useWidget } from '~/context';
import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";
import {mapStyle} from "~/widgets/DealerMap/mapStyles";
import {Post, useEntityRecords} from "@wordpress/core-data";
import {MapView, Markers, Sidebar} from "~/widgets/DealerMap/components";
import {IDealer, MapPoint} from "~/types";
import {Flex} from "~/ui";

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface DealerMapProps {
}

export default function DealerMap(props: DealerMapProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
    } = props

    const {
        widgetSettings,
        t,
        dealers,
        fetchingDealers,
        mapPoints
    } = useWidget()

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const dealermapClasses = classNames(
        styles.DealerMap,
        'prek-map-container'
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <APIProvider apiKey={widgetSettings.settings.googleApiKey}>
            <div className={dealermapClasses}>
                <div className={classNames(styles.MapContainer, 'prek-map')}>
                    <MapView points={mapPoints}/>
                </div>
                <div className={classNames(styles.Locations, 'prek-sidebar')}>
                    { (!fetchingDealers && dealers) && (
                        <Sidebar
                            onPlaceSelect={(place: google.maps.places.PlaceResult | null) => console.log('place', place)}
                        />
                    )}
                </div>
            </div>
        </APIProvider>
    )
}
