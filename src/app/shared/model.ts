import { UploadMetadata } from "@angular/fire/storage/interfaces";
import { Category } from "../tmdb.service";

export interface Genre {
  id: string;
  name: string;
}

export interface MediaList {
  title: string;
  items?: Media[];
  category?: Category;
  discoverOption?: DiscoverOption;
  isCustom?: boolean;
}

export interface StorageData {
  metadata: UploadMetadata,
  data: any
}

export interface Media {
  poster_path: string;
  adult?: boolean;
  overview?: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language?: number;
  title: string;
  backdrop_path?: string;
  popularity: number;
  vote_count: number;
  video?: boolean;
  vote_average?: number;
}

export class DiscoverOption {
  page?: number;
  with_original_language?: String;
  sort_by?: String;
  certification?: String;
  certification_country?: String;
  primary_release_date?: String;
  primary_release_year?: String;
  with_genres?: String;
}

export interface ScrollableItem {
  addHandler: Function;
  routerLink: string;
  posterImg: string;
  title: string;
  info: string;
}

export interface DiscoverResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

export interface KodiExport {
  version: string;
  movie: KodiExportMovie[];
}

export interface KodiExportMovie {
  title: string,
  originaltitle: string,
  ratings: [
    {
      name: string;
      max: string
      value: string,
      votes: string
    }
  ],
  userrating: number,
  top250: number,
  outline: [],
  plot: string;
  tagline: [],
  runtime: number,
  thumb: [
    {
      aspect: string,
      preview: string;
    }
  ],
  fanart: [
    {
      preview: string
    }
  ],
  mpaa: [],
  playcount: 0,
  lastplayed: [],
  file: [],
  path: string,
  filenameandpath: string,
  basepath: string,
  id: string,
  uniqueid: [
    {
      type: string,
      default?: boolean,
      text: string
    }
  ],
  genre: string[],
  country: string,
  credits: string,
  director: string,
  premiered: string,
  year: number,
  studio: string,
  trailer: any[],
  fileinfo: {
    streamdetails: {
      video: {
        codec: string,
        aspect: number,
        width: number,
        height: number,
        durationinseconds: number,
        stereomode: []
      },
      audio: [
        {
          codec: string,
          language: string,
          channels: number
        }
      ],
      subtitle: {
        language: string
      }
    }
  },
  actor: [
    {
      name: string,
      role: string,
      order: number,
      thumb: string
    }
  ],
  dateadded: Date,
  art: {
    fanart: string,
    poster: string
  }
}