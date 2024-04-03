import {IDealer, ILocation} from "~/types";
import {geoDistanceBetween, geoNearestLocations} from "~/lib/helpers";

/**
 * Handle place selected from either search or geolocation
 *
 * @param dealers
 * @param location
 */
const sortDealersByLocation = (
    dealers: IDealer[],
    location: ILocation,
) => {
    const nearest = geoNearestLocations<IDealer>(dealers as unknown as ILocation[], location)

    if (nearest && nearest.length > 0) {
        const nearestDealers = nearest.map((dealer: IDealer) => {
            const loc: ILocation = {
                lat: dealer.lat,
                lon: dealer.lon
            }

            const distance = geoDistanceBetween(location, loc)

            return {
                ...dealer,
                distance: parseFloat(distance.toFixed(2))
            }
        })

        return nearestDealers;

        /*setClosestDealers(nearestDealers);
        setActiveDealer(nearestDealers[0]);
        setActiveDealerIndex(0);

        if (!selectedDealer) {
            setSelectedDealer(nearestDealers[0])
        }*/
    }

    return dealers;
}

export {
    sortDealersByLocation
}
