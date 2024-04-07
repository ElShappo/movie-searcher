import { ageRatings } from "./constants";

export type AgeRating = (typeof ageRatings)[number];
export type Country = {
  name: string;
  slug: string;
};

export type Movie = {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  rating: {
    kp: number;
    imdb: number;
    tmdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
  };
  backdrop: {
    url: string;
    previewUrl: string;
  };
  poster: {
    url: string;
    previewUrl: string;
  };
  [index: string]: any;
};

export type MovieUniversalSearchResponse = {
  docs: Movie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
};

export type TreeData = {
  title: string;
  value: string;
  key: string;
  children?: TreeData[];
};

export type MoviePickRadioOption = "movieFilters" | "movieName";