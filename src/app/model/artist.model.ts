import { Image } from './image.model';

export interface Artist {
    id?: string;
    name?: string;
    external_urls?: object;
    followers?: object;
    genres?: string[];
    images?: Image[];
    popularity?: number;
    type?: string;
    ratings_count?: number;
    average?: number;
}
