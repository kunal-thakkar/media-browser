import { Category } from "../tmdb.service";

export interface Genre {
  id: string;
  name: string;
}

export interface MediaList {
  title: string;
  items?: any[];
  category?: Category;
  discoverOption?: DiscoverOption;
  isCustom?: boolean;
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

export interface DiscoverResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}