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

export interface GoogleSearchResultItem {
  cacheId: string,//"qxD6WYIKKksJ"
  displayLink: string,//"www.primevideo.com"
  formattedUrl: string, //"https://www.primevideo.com/.../The-Nut-Job/ 0JGH6EXV8XTNV6KBTL0UUWV6V7"
  htmlFormattedUrl: string,//"https://www.primevideo.com/.../<b>The-Nut-Job</b>/ 0JGH6EXV8XTNV6KBTL0UUWV6V7"
  htmlSnippet: string,//"&quot;<b>The Nut Job</b>&quot; is a comedy that follows Surly (voiced by Will Arnett) a mischievous squirrel who must plan a heist to get into his town&#39;s biggest nut shop in order to&nbsp;..."
  htmlTitle: string,//"The Nut Job - Prime Video"
  kind: string,//"customsearch#result"
  link: string,//"https://www.primevideo.com/detail/The-Nut-Job/0JGH6EXV8XTNV6KBTL0UUWV6V7"
  pagemap: {
    cse_thumbnail: [{
      height: string,//"268"
      src: string,//"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTSNoK27V9_YNpLxRTB0AuGu2qkxvnDO5IfNuag0MoQoO0E24tBelhYXa7u"
      width: string//"188"
    }],
    cse_image: [{
      src: string,// "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/26b26e1aa27047c6a1913789e2e6be7503035679031b6982e7592bded8581204._RI_V_TTW_.jpg"
    }]
  },
  snippet: string,// "\"The Nut Job\" is a comedy that follows Surly (voiced by Will Arnett) a mischievous squirrel who must plan a heist to get into his town's biggest nut shop in order to ..."
  title: string, //"The Nut Job - Prime Video"
}

export interface GoogleSearchResult {
  context: { title: string }
  items: GoogleSearchResultItem[],
  kind: string
  queries: {
    request: [{
      count: number,//10
      cx: string,//"1c071add967e41c16"
      inputEncoding: string,// "utf8"
      outputEncoding: string,//"utf8"
      safe: string,//"off"
      searchTerms: string,//"\"The Nut Job\""
      startIndex: number,//1
      title: string,//"Google Custom Search - \"The Nut Job\""
      totalResults: string,//"698"
    }],
    nextPage: [{
      count: number,//10
      cx: string,//"1c071add967e41c16"
      inputEncoding: string,//"utf8"
      outputEncoding: string,//"utf8"
      safe: string,//"off"
      searchTerms: string,//"\"The Nut Job\""
      startIndex: number,//11
      title: string,//"Google Custom Search - \"The Nut Job\""
      totalResults: string,//"698"
    }]
  }
  searchInformation: {
    searchTime: number,
    formattedSearchTime: string,
    totalResults: string,
    formattedTotalResults: string
  }
  url: {
    type: string,

  }
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