import { User } from './user.model';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { Artist } from './artist.model';
import { Release } from './release.model';

export interface Rating {
    rating?: number;
    uid?: string;
    release_id?: string;
    comment?: string;
    rank?: number;
    posted?: Timestamp;
    user?: User;
    artists?: string[];
    release?: Release;
}
