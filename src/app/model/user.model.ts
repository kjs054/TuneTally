import { Rating } from './rating.model';
import { SpotifyAuth } from './spotifyAuth.model';

export interface User {
    uid?: string;
    display_name?: string;
    email?: string;
    image_url?: string;
    ratings?: Rating[];
    followers?: User[];
    following?: User[];
    service?: string;
    spotify?: SpotifyAuth;
}
