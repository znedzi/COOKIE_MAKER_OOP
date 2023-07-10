import { log } from "console";

import { Entries } from "../types/entries";

export const handlebarsHelpers = {
    findPrice: (entries: Entries, selectedItem: string): number => {
        const found = entries.find(el => el[0] === selectedItem);

        if (!found) {
            throw new Error(`Cannot find price of "${selectedItem}".`);
        }

        const [, price] = found;
        return price;
    },

    pricify: (price: number): string => price.toFixed(2),

    isNotInArray: <T>(array: T[], element: T): boolean => !array.includes(element),

    //Typ generyczny spowoduje, że jedynie typy elementów znajdujące się w tablicy może być wyszukiwane użyte jako element. Np. tylko typy number itp.  Typ generyczny sam trzyma nam informację na temat typu jakiego używamy.
    isInArray: <T>(array: T[], element: T): boolean => array.includes(element),
};