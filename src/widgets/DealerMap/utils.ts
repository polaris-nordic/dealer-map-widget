import {IDealer} from "~/types";

export function getDealerById(id: number, dealers: IDealer[]): IDealer {
    return dealers.find((dealer) => dealer.id === id) || null!
}
