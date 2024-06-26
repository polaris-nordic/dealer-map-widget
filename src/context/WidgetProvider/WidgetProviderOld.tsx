import {createContext, useContext, ReactNode, useEffect, useState, Dispatch, SetStateAction} from 'react';
import {IDealer, IWidgetSettings, MapPoint} from "~/types";
import {useI18n} from "react-simple-i18n";
import {I18n} from "react-simple-i18n/src/context";
import {useGeolocation, UseGeolocationReturnType} from "~/hooks";
import {Post, useEntityRecords} from "@wordpress/core-data";

/* ------------------------------ *
 * Context
 * ----------------------------- */

export interface WidgetContextProps {
    widgetSettings: IWidgetSettings
    i18n: I18n
    t: (key: string, ...args: string[]) => string
    /* Dealers */
    dealers: IDealer[]
    setDealers: Dispatch<SetStateAction<IDealer[]>>
    mapPoints: MapPoint[]
    setMapPoints: Dispatch<SetStateAction<MapPoint[]>>
    fetchingDealers: boolean
    activeDealer: IDealer
    activeDealerIndex: number
    setActiveDealer: Dispatch<SetStateAction<IDealer>>;
    /* Current User Position */
    positionSearching: boolean
    userLocation: UseGeolocationReturnType
    setUserLocation: Dispatch<SetStateAction<UseGeolocationReturnType>>
    searchUserLocation: () => void
    /* Map */
    handleMarkerClick: (point: MapPoint) => void
}

export const WidgetContext = createContext<WidgetContextProps>({
    widgetSettings: null!,
    i18n: () => {},
    t: () => {},
    /* Dealers */
    dealers: [],
    setDealers: () => {},
    mapPoints: [],
    setMapPoints: () => {},
    fetchingDealers: false,
    activeDealer: null!,
    activeDealerIndex: -1,
    setActiveDealer: () => {},
    /* Current User Position */
    positionSearching: null!,
    userPosition: null!,
    setUserLocation: () => {},
    searchUserLocation: () => {},
    /* Map */
    handleMarkerClick: () => {}
});

export interface WidgetProviderProps {
    settings: IWidgetSettings
    /* Child node */
    children?: ReactNode;
}

export default function WidgetProvider(props: WidgetProviderProps) {
    /* ------------------------------ *
         * Initial State
         * ----------------------------- */

    const {
        settings,
        children
    } = props

    const [positionSearching, setPositionSearching] = useState<boolean>(null!);
    const [userLocation, setUserLocation] = useState<UseGeolocationReturnType>(null!);
    const [activeDealer, setActiveDealer] = useState<IDealer>(null!);
    const [activeDealerIndex, setActiveDealerIndex] = useState<number>(-1);
    const [dealers, setDealers] = useState<IDealer[]>([]);
    const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
    const { t, i18n } = useI18n()
    const geoObj = useGeolocation({ when: positionSearching });

    const { isResolving: fetchingDealers, records } = useEntityRecords<Post>('postType', settings.dealer.postType, {
        status : 'publish',
        context: 'view',
        per_page: 100,
        orderby: 'title',
        order: 'asc'
    })

    useEffect(() => {
        if (records) {
            setMapPoints(records.map((record: any) => {
                return {
                    key: `Marker-${record.id}`,
                    id: record.id,
                    lat: parseFloat(record.meta[settings.dealer.fieldLatitude]),
                    lng: parseFloat(record.meta[settings.dealer.fieldLongitude]),
                }
            }))

            setDealers(records.map((record: Post) => {
                return {
                    id: record.id,
                    title: record.title.rendered,
                    lat: parseFloat(record.meta[settings.dealer.fieldLatitude]),
                    lon: parseFloat(record.meta[settings.dealer.fieldLongitude]),
                    distance: 0,
                    placeId: record.meta[settings.dealer.fieldPlaceId],
                    meta: {
                        ...record.meta
                    }
                }
            }))
        }
    }, [records]);

    useEffect(() => {
        if (geoObj) {
            setUserLocation(geoObj)
            setPositionSearching(false);
        }
    }, [geoObj]);

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    const selectDealer = (dealer: IDealer) => {
        setActiveDealer(dealer);
    }

    const handleMarkerClick = (point: MapPoint) => {
        // Get dealer by point.id
        const dealerIndex = dealers.findIndex((dealer: IDealer) => dealer.id === point.id);

        if (dealerIndex) {
            setActiveDealer(dealers[dealerIndex]);
            setActiveDealerIndex(dealerIndex);
        }
    }

    const searchUserLocation = () => {
        setUserLocation(null!);
        setPositionSearching(true);
    }

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    const widgetContextValue: WidgetContextProps = {
        widgetSettings: settings,
        i18n,
        t,
        positionSearching,
        userLocation,
        setUserLocation,
        searchUserLocation,
        activeDealer,
        activeDealerIndex,
        setActiveDealer,
        dealers,
        setDealers,
        mapPoints,
        setMapPoints,
        fetchingDealers,
        handleMarkerClick
    }

    return (
        <WidgetContext.Provider value={widgetContextValue}>
            {children}
        </WidgetContext.Provider>
    )
}

export function useWidget() {
    const context = useContext(WidgetContext);
    if (context === undefined) {
        throw new Error('useWidget must be used within a WidgetContext')
    }
    return context;
}
