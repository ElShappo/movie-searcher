import { ageRatings, networks } from "./constants";

export type AgeRating = (typeof ageRatings)[number];
export type Country = {
  name: string;
  slug: string;
};

export type Type = Country;
export type Genre = Country;

export type Movie = {
  id: string;
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

export type MovieImage = {
  url: string;
  createdAt: string;
  height: number;
  movieId: number;
  previewUrl: string;
  type: string;
  updatedAt: string;
  width: number;
  id: string;
};

export type MovieImageResponse = {
  docs: MovieImage[];
  total: number;
  limit: number;
  page: number;
  pages: number;
};

export type MovieComment = {
  id: number;
  moveId: number;
  title: string;
  type: "Позитивный" | "Нейтральный" | "Негативный";
  review: string;
  date: string;
  author: string;
  userRating: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
};

export type MovieCommentResponse = {
  docs: MovieComment[];
  total: number;
  limit: number;
  page: number;
  pages: number;
};

export type MovieActor = {
  id: number;
  name: string;
  enName: string;
  photo: string;
  age: number;
  sex: string;
};

export type MovieActorResponse = {
  docs: MovieActor[];
  total: number;
  limit: number;
  page: number;
  pages: number;
};

export type MovieSeason = {
  movieId: number;
  number: number;
  createdAt: string;
  episodes: {
    number: number;
    name: string;
    enName: string;
    still?: {
      url: string;
      previewUrl: string;
    };
    duration: number;
    date: string;
    airDate: string;
    description: string | null;
  }[];
};

export type MovieSeasonResponse = {
  docs: MovieSeason[];
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

export type NotificationType = "success" | "info" | "warning" | "error";

export type MoviePickRadioOption = "movieFilters" | "movieName";

export type Networks = (typeof networks)[number];
