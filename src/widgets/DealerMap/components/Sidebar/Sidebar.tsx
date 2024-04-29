import React, {useEffect, useRef, useState} from 'react';
import styles from './Sidebar.module.sass'
import {classNames, geoDistanceBetween, geoNearestLocations} from '~/lib/helpers'
import {useWidget} from "~/context";
import {IDealer, ILocation, MapPoint} from "~/types";
import {Carousel, TextField} from "~/ui";
import {useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import {ResultCard} from "~/widgets/DealerMap/components";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import { useScrollCarousel } from '~/hooks';
import {take} from 'lodash';

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface SidebarProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function Sidebar(props: SidebarProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        onPlaceSelect
    } = props

    const {
        widgetSettings,
        t,
        dealers,
        searchUserLocation,
        activeDealerIndex,
        handleLocationFound
    } = useWidget()

    const places = useMapsLibrary('places');
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
            language: widgetSettings.settings.country === 'SV' ? 'se' : widgetSettings.settings.country.toLowerCase(),
            options: {
                types: ["(regions)"],
                componentRestrictions: { country: widgetSettings.settings.country === 'SV' ? 'se' : widgetSettings.settings.country.toLowerCase() },
            },
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            const place = placeAutocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                console.log('Returned place contains no geometry')
            }

            handleLocationFound({
                lat: place.geometry?.location?.lat() || 0,
                lon: place.geometry?.location?.lng() || 0
            })
        });
    }, [onPlaceSelect, placeAutocomplete]);

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const sidebarClasses = classNames(
        styles.Sidebar,
        'prek-map-sidebar'
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <div className={sidebarClasses}>
            <div className={styles.Header}>
                <h3 className={classNames(styles.Heading, 'prek-sidebar-title')}>{ widgetSettings.labels.sidebarTitle || t('sidebarTitle') }</h3>
            </div>
            <div className={styles.SearchBox}>
                <MagnifyingGlassIcon className={styles.SearchIcon}/>
                <TextField label="Search" showLabel={false} ref={inputRef} type="search" className={styles.SearchField}/>
                <div className={styles.UserLocationButton} onClick={() => searchUserLocation()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 640" className={styles.LocationIcon}>
                        <path d="M256 422c-91.533 0-166-74.467-166-166S164.467 90 256 90s166 74.467 166 166-74.467 166-166 166zm0-320c-84.916 0-154 69.084-154 154s69.084 154 154 154 154-69.084 154-154-69.084-154-154-154z"/>
                        <path d="M250 64h12v96h-12zM352 250h96v12h-96zM250 352h12v96h-12zM64 250h96v12H64z"/>
                    </svg>
                </div>
            </div>
            <Carousel
                className={styles.Results}
                activeIndex={activeDealerIndex}
                direction="vertical"
            >
                { activeDealerIndex > -1 ? take<IDealer[]>(dealers, 10).map((dealer: IDealer, i: number) => {
                    return (
                        <ResultCard key={`Dealer-${dealer.id}`} dealer={dealer}/>
                    )
                }) : (
                    <div className={styles.Message}>
                        <p>{ t('messageBeforeLink', 'Search by adress, city or zip, or')} <button type="button" className={styles.Button} onClick={() => searchUserLocation()}>{ t('messageLinkText', 'dealers nearby')}</button> { t('messageAfterLink', 'where you are located.')}</p>
                    </div>
                )}
            </Carousel>
            {/**<pre>{JSON.stringify(activeDealerIndex, null, 2)}</pre>**/}
        </div>
    )
}
