import { Dispatch, SetStateAction } from 'react';
import { MAP_API_KEY, MAP_API_URL } from './constants.ts';
import { IFormData, IResponseItem } from './interfaces';

export async function runSuggest(lang: string, query: string, setSuggestions: Dispatch<SetStateAction<IResponseItem[]>>) {
    try {
        const url = new URL(`${MAP_API_URL}suggest`);

        url.searchParams.set('apikey', MAP_API_KEY);
        url.searchParams.set('lang', lang);
        url.searchParams.set('query', query);
        url.searchParams.set('type', 'regional.address');

        const response = await fetch(url.toString(), {
            mode: 'cors',
        });
        const json = await response.json();

        if (json?.items?.length) {
            setSuggestions(json.items);
        } else {
            setSuggestions([]);
        }
    } catch (ex) {
        setSuggestions([]);
    }
}

export async function runGeocode(lang: string, formData: IFormData, setGeocode: Dispatch<SetStateAction<IResponseItem[]>>) {
    try {
        const url = new URL(`${MAP_API_URL}geocode`);

        url.searchParams.set('apikey', MAP_API_KEY);
        url.searchParams.set('lang', lang);
        url.searchParams.set('query', `${formData.street} ${formData.houseNumber}, ${formData.city}, ${formData.zip}, ${formData.country}`);
        url.searchParams.set('type', 'regional.address');

        const response = await fetch(url.toString(), {
            mode: 'cors',
        });
        const json = await response.json();

        if (json?.items?.length) {
            setGeocode(json.items);
        } else {
            setGeocode([]);
        }
    } catch (ex) {
        // eslint-disable-next-line no-console
        console.log(ex);

        setGeocode([]);
    }
}