import {ILocation, ILocationUnit} from "~/types";

export function geoNearestLocation(locations: ILocation[], currentLocation?: ILocation) {
    if (!currentLocation || currentLocation.lat === 0 || currentLocation.lon === 0) {
        return null
    }

    return locations.reduce((prev: ILocation, curr: ILocation) => {
        const prevDistance = geoDistanceBetween(prev, currentLocation)
        const currDistance = geoDistanceBetween(curr, currentLocation)

        return prevDistance < currDistance ? prev : curr
    })
}

export function geoNearestLocations<TModel>(
    locations: ILocation[],
    currentLocation?: ILocation,
    limit?: number
) {
    if (!locations || !currentLocation || currentLocation.lat === 0 || currentLocation.lon === 0) {
        return null
    }

    const sorted = locations.sort((a: ILocation, b: ILocation) => {
        const aDistance = geoDistanceBetween(a, currentLocation)
        const bDistance = geoDistanceBetween(b, currentLocation)

        return aDistance - bDistance
    });

    return limit ? sorted.slice(0, limit) as TModel[] : sorted as TModel[]
}

export function geoDistanceBetween(from: ILocation, to: ILocation, unit: ILocationUnit = 'M') {
    if ((from.lat == to.lat) && (from.lon == to.lon)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * from.lat/180;
        const radlat2 = Math.PI * to.lat/180;
        const theta = from.lon-to.lon;
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
}
