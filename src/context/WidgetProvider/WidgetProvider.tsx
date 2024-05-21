import {createContext, useContext, ReactNode, useEffect, useState, Dispatch, SetStateAction} from 'react';
import {IDealer, ILocation, IWidgetSettings, MapPoint} from "~/types";
import {useI18n} from "react-simple-i18n";
import {I18n} from "react-simple-i18n/src/context";
import {useGeolocation, UseGeolocationReturnType} from "~/hooks";
import {Post, useEntityRecords} from "@wordpress/core-data";
import {sortDealersByLocation} from "~/context/WidgetProvider/utils";
import Cookies from 'js-cookie';

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
    /* New methods */
    handleLocationFound: (location: ILocation) => void
    handleDealerSelected: (dealer: IDealer) => void
    /* My Dealer */
    myDealer: IDealer | null
    setMyDealer: Dispatch<SetStateAction<IDealer | null>>
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
    i18n: {} as I18n,
    t: () => '',
    /* Dealers */
    dealers: [],
    setDealers: () => {},
    mapPoints: [],
    setMapPoints: () => {},
    fetchingDealers: false,
    activeDealer: null!,
    activeDealerIndex: -1,
    setActiveDealer: () => {},
    /* New methods */
    handleLocationFound: () => {},
    handleDealerSelected: () => {},
    /* My Dealer */
    myDealer: null!,
    setMyDealer: () => {},
    /* Current User Position */
    positionSearching: null!,
    userLocation: null!,
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

    const [myDealer, setMyDealer] = useState<IDealer | null>(null);
    const [positionSearching, setPositionSearching] = useState<boolean>(null!);
    const [userLocation, setUserLocation] = useState<ILocation>(null!);
    const [activeDealer, setActiveDealer] = useState<IDealer>(null!);
    const [activeDealerIndex, setActiveDealerIndex] = useState<number>(-1);
    const [dealers, setDealers] = useState<IDealer[]>([]);
    const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
    const { t, i18n } = useI18n()
    const geoObj = useGeolocation({ when: positionSearching });

    const { isResolving: fetchingDealers, records } = useEntityRecords<Post>('postType', settings.dealer.postType, {
        status : 'publish',
        context: 'view',
        per_page: -1,
        orderby: 'title',
        order: 'asc'
    })

    useEffect(() => {
        if (records) {
            console.log('adding records')
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

    // When Geolocation is found, update userLocation
    useEffect(() => {
        if (geoObj) {
            handleLocationFound({
                lat: geoObj.lat || 0,
                lon: geoObj.lng || 0
            });
        }
    }, [geoObj]);

    // When myDealer is set, update cookie
    useEffect(() => {
        if (myDealer) {
            Cookies.set('dmw-dealer', JSON.stringify(myDealer));
        } else {
            Cookies.remove('dmw-dealer');
        }
    }, [myDealer]);

    // If cookie is set, set myDealer
    useEffect(() => {
        const cookieDealer = Cookies.get('dmw-dealer');
        if (cookieDealer) {
            setMyDealer(JSON.parse(cookieDealer));
        }
    }, []);

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    // When Geolocation is found, update userLocation
    const handleLocationFound = (location: ILocation) => {
        setUserLocation(location);
        setPositionSearching(false);

        // Sort dealers by location
        const sortedDealers = sortDealersByLocation(dealers, location);
        setDealers(sortedDealers);

        // Set active dealer
        handleDealerSelected(sortedDealers[0])
    }

    // When a dealer is selected, update activeDealer and activeDealerIndex
    const handleDealerSelected = (dealer: IDealer) => {
        setActiveDealer(dealer);

        const dealerIndex = dealers.findIndex((d: IDealer) => d.id === dealer.id);
        setActiveDealerIndex(dealerIndex);
    }

    const handleMarkerClick = (point: MapPoint) => {
        // Get dealer by point.id
        const dealerIndex = dealers.findIndex((dealer: IDealer) => dealer.id === point.id);
        const dealer = dealers[dealerIndex];

        const sortedDealers = sortDealersByLocation(dealers, {
            lat: dealer.lat,
            lon: dealer.lon
        });
        setDealers(sortedDealers);

        handleDealerSelected(dealer);
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
        /* New methods */
        handleLocationFound,
        handleDealerSelected,
        /* My Dealer */
        myDealer,
        setMyDealer,
        /* Dealers */
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
