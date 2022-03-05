import { Artist } from './artist.model';
import { Image } from './image.model';
import { AlbumType } from './abumType.model';

export interface Release {
  id?: string;
  album_type?: AlbumType;
  external_urls?: object;
  name?: string;
  artists?: Artist[];
  release_date?: string;
  release_date_precision?: string;
  total_tracks?: number;
  images?: Image[];
  popularity?: number;
  rating?: number;
  tracks: Release[];
  ratings_count?: number;
}
