import React, {useEffect} from 'react';
import styles from './ResultCard.module.sass'
import {classNames} from '~/lib/helpers'
import { IDealer } from '~/types';
import {GlobeAltIcon, MapIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import {useWidget} from "~/context";
import Cookies from 'js-cookie';
import {useMap} from "@vis.gl/react-google-maps";
import {Flex} from "~/ui";
import {decodeEntities} from "@wordpress/html-entities";

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface ResultCardProps {
    dealer: IDealer
}

export default function ResultCard(props: ResultCardProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        dealer
    } = props

    const map = useMap();
    const { 
        widgetSettings, 
        activeDealer, 
        handleDealerSelected, 
        myDealer,
        setMyDealer,
        t 
    } = useWidget()

    /* ------------------------------ *
     * Effects
     * ----------------------------- */

    useEffect(() => {
        if (activeDealer && map) {
            const latLng: google.maps.LatLngLiteral = {
                lat: activeDealer.lat,
                lng: activeDealer.lon
            }
            map.fitBounds(new google.maps.LatLngBounds(latLng, latLng));
            map.setZoom((map.getZoom() || 10) - 4)
        }
    }, [activeDealer, map]);

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    const handleDealerClicked = () => {
        handleDealerSelected(dealer)
    }

    const handleMyDealerSelected = () => {
        if (myDealer?.id === dealer.id) {
            setMyDealer(null)
            return
        }

        setMyDealer(dealer)
    }

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const resultcardClasses = classNames(
        styles.ResultCard,
        (activeDealer && activeDealer.id === dealer.id) && styles.Active,
        'prek-result-card'
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    //const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURI(`${dealer.address},${dealer.zipcode} ${dealer.city}`)}&destination_place_id=${dealer.placeId}`
    // https://www.google.com/maps/dir/?api=1&destination=59.226366,10.953466&destination_place_id=ChIJzZ3c3Z5ZQUYR3Jn3Q9JjgQI
    // https://www.google.com/maps/dir/?api=1&destination=59.226366,10.953466&destination_place_id=ChIJG8nSGcLhQEYR56VL-bfK2ao

    return (
        <div className={resultcardClasses} onClick={handleDealerClicked}>
            <h4 className={styles.Title}>{ decodeEntities(dealer.title) }</h4>
            { (dealer.distance && dealer.distance > 0) ? (
                <div className={styles.Distance}>
                    <MapPinIcon className={styles.Icon}/>
                    <span>{ dealer.distance } km</span>
                </div>
            ) : null }
            { (activeDealer && activeDealer.id === dealer.id) && (
                <div className={styles.Details}>
                    <div className={styles.Extra}>
                        { dealer.meta[widgetSettings.dealer.extra.address] && (
                            <div className={styles.Address}>
                                { dealer.meta[widgetSettings.dealer.extra.address] } <br/>
                                { dealer.meta[widgetSettings.dealer.extra.zip] } { dealer.meta[widgetSettings.dealer.extra.city] }
                            </div>
                        )}
                        { dealer.meta[widgetSettings.dealer.extra.phone] && (
                            <Flex justifyContent="start" gap={1} className={styles.Row}>
                                <PhoneIcon className={styles.Icon}/>
                                <a href={`tel:${dealer.meta[widgetSettings.dealer.extra.phone]}`}>{ dealer.meta[widgetSettings.dealer.extra.phone] }</a>
                            </Flex>
                        )}
                        { dealer.meta[widgetSettings.dealer.extra.website] && (
                            <Flex justifyContent="start" gap={1} className={styles.Row}>
                                <GlobeAltIcon className={styles.Icon}/>
                                <a href={dealer.meta[widgetSettings.dealer.extra.website]} target="_blank">{ dealer.meta[widgetSettings.dealer.extra.website] }</a>
                            </Flex>
                        )}
                    </div>
                    <div className={styles.Actions}>
                        { (widgetSettings.dealer.selectedCookie) && (
                            <button className={styles.SelectDealer} onClick={handleMyDealerSelected} type="button">{ myDealer?.id === dealer.id ? t('notMyDealer', 'Not my dealer') : t('setAsMyDealer', 'Set as my dealer') }</button>
                        )}
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.lat},${dealer.lon}&destination_place_id=${dealer.placeId}`} target="_blank" className={styles.Directions}>
                            { t('getDirections', 'Get directions') }
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
