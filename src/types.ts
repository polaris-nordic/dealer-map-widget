export interface IWidgetSettings {
    settings: {
        country: 'NO' | 'SV' | 'FI'
        googleApiKey: string
        debug: boolean
    }
    labels: {
        sidebarTitle: string
    }
    map: MapSettings
    dealer: DealerSettings
}

export type MapPoint = google.maps.LatLngLiteral & {
    id: number
    key: string
};

export type Size = {
    unit: string
    size: number
}

export interface LayoutSettings {
    container: {
        height: Size
        gap: Size
    }
    sidebar: {
        width: Size
        position: number
    }
}

export interface DealerSettings {
    postType: string
    googlePlaceEnabled: boolean
    fieldTitle: string
    fieldTitleMeta: string
    fieldLatitude: number
    fieldLongitude: number
    fieldPlaceId: string
    extra: {
        address: string
        zip: string
        city: string
        phone: string
        email: string
        website: string
    }
}

export interface MapSettings {
    zoom: number
    type: keyof typeof google.maps.MapTypeId
    style: any
}

export type ILocationUnit = 'K' | 'N' | 'M'

export interface ILocation {
    lat: number
    lon: number
    [key: string]: any
}

export interface IDealer extends ILocation {
    id: number
    title: string
    distance: number
    placeId?: string
    meta: {
        [key: string]: any
    }
}
