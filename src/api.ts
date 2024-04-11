import { maxLimit, movieImagesLimit } from "./constants";
import {
  CountriesException,
  GenresException,
  MovieActorsByIdException,
  MovieByIdException,
  MovieCommentsByIdException,
  MovieImagesByIdException,
  MovieSeasonsByIdException,
  MoviesByFiltersException,
  MoviesByNameException,
  NetworksException,
  TypesException,
} from "./exceptions";
import { MovieImageResponse, MovieCommentResponse, MovieActorResponse, MovieSeasonResponse } from "./types";

class Api {
  #oldApiPath = "https://api.kinopoisk.dev/v1";
  #apiPath = "https://api.kinopoisk.dev/v1.4";
  #apiKey = String(process.env.REACT_APP_API_KEY);
  #selectFieldsMoviesPage = ["id", "name", "description", "shortDescription", "poster"];

  #countries: [] | undefined;
  #types: [] | undefined;
  #genres: [] | undefined;
  #networks: [] | undefined;

  async get(mode: "countries" | "types" | "genres" | "networks") {
    let key: string;
    switch (mode) {
      case "countries":
        if (this.#countries) {
          return this.#countries;
        }
        key = "countries.name";
        break;
      case "types":
        if (this.#types) {
          return this.#types;
        }
        key = "type";
        break;
      case "genres":
        if (this.#genres) {
          return this.#genres;
        }
        key = "genres.name";
        break;
      case "networks":
        if (this.#networks) {
          return this.#networks;
        }
        key = "networks.items.name";
        break;
    }
    const url = new URL(`${this.#oldApiPath}/movie/possible-values-by-field`);
    url.searchParams.set("field", key);
    const href = url.href;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      // console.log(result);

      switch (mode) {
        case "countries":
          this.#countries = result;
          break;
        case "types":
          this.#types = result;
          break;
        case "genres":
          this.#genres = result;
          break;
        case "networks":
          this.#networks = result;
          break;
      }

      return result;
    } catch (error) {
      switch (mode) {
        case "countries":
          throw new CountriesException();
        case "types":
          throw new TypesException();
        case "genres":
          throw new GenresException();
        case "networks":
          throw new NetworksException();
      }
    }
  }

  // is used when there is only filtering by name
  async #getMoviesByName(page: number, limit: number, name: string) {
    const url = new URL(`${this.#apiPath}/movie/search`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("query", name);

    const href = url.href;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      throw new MoviesByNameException();
    }
  }

  async #getMoviesByFilters({
    limit,
    page,
    years,
    countries,
    ratingsMpaa,
  }: {
    limit: number;
    page: number;
    years?: [number, number];
    countries?: string[]; // one can get list of all countries
    ratingsMpaa?: string[];
  }) {
    const url = new URL(`${this.#apiPath}/movie`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    for (const field of this.#selectFieldsMoviesPage) {
      url.searchParams.append("selectFields", field);
    }

    if (years && years[0] && years[1]) {
      url.searchParams.append("year", years.join("-"));
    }
    if (countries) {
      for (const country of countries) {
        url.searchParams.append("countries.name", String(country));
      }
    }
    if (ratingsMpaa) {
      for (const rating of ratingsMpaa) {
        url.searchParams.append("ratingMpaa", String(rating));
      }
    }

    const href = url.href;
    console.log(`Total href = ${href}`);

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      throw new MoviesByFiltersException();
    }
  }

  async getMovies({
    limit,
    page,
    name,
    years,
    countries,
    ratingsMpaa,
  }: {
    limit: number;
    page: number;
    name?: string;
    years?: [number, number];
    countries?: string[]; // one can get list of all countries
    ratingsMpaa?: string[];
  }) {
    if (name) {
      return this.#getMoviesByName(page, limit, name);
    }
    return this.#getMoviesByFilters({
      limit,
      page,
      years,
      countries,
      ratingsMpaa,
    });
  }

  async getMovieById(id: string) {
    const href = `${this.#apiPath}/movie/${id}`;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      throw new MovieByIdException();
    }
  }

  async getMovieImagesById(id: string) {
    const url = new URL(`${this.#apiPath}/image`);

    url.searchParams.set("page", "1");
    url.searchParams.set("limit", String(movieImagesLimit));
    url.searchParams.set("movieId", id);

    const href = url.href;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result as MovieImageResponse;
    } catch (error) {
      throw new MovieImagesByIdException();
    }
  }

  async getMovieCommentsById(id: string, page: number, limit: number) {
    const url = new URL(`${this.#apiPath}/review`);

    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("movieId", id);

    const href = url.href;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result as MovieCommentResponse;
    } catch (error) {
      throw new MovieCommentsByIdException();
    }
  }

  async getMovieActorsById(id: string, page: number, limit: number) {
    const url = new URL(`${this.#apiPath}/person`);

    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("movies.id", id);
    url.searchParams.append("notNullFields", "name");
    url.searchParams.append("notNullFields", "photo");
    // url.searchParams.append("profession.value", "Актер");
    // url.searchParams.append("profession.value", "Актриса");

    const href = url.href;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result as MovieActorResponse;
    } catch (error) {
      throw new MovieActorsByIdException();
    }
  }

  async getMovieSeasonsById(id: string) {
    const url = new URL(`${this.#apiPath}/season`);

    url.searchParams.set("page", "1");
    url.searchParams.set("limit", String(maxLimit));
    url.searchParams.set("movieId", id);

    const href = url.href;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result as MovieSeasonResponse;
    } catch (error) {
      throw new MovieSeasonsByIdException();
    }
  }

  async getRandomMovie({
    genres,
    countries,
    types,
    releaseYearsStart,
    kpRating,
    networks,
  }: {
    genres?: string[]; // one can get list of all genres
    countries?: string[]; // one can get list of all countries
    types?: string[]; // one can get list of all types
    releaseYearsStart?: [number, number];
    kpRating?: [number, number];
    networks?: string[]; // one can get list of all networks (probably)
  }) {
    const url = new URL(`${this.#apiPath}/movie/random`);

    if (genres) {
      for (const genre of genres) {
        url.searchParams.append("genres.name", String(genre));
      }
    }
    if (countries) {
      for (const country of countries) {
        url.searchParams.append("countries.name", String(country));
      }
    }
    if (types) {
      for (const type of types) {
        url.searchParams.append("type", String(type));
      }
    }
    if (releaseYearsStart) {
      url.searchParams.append("releaseYears.start", releaseYearsStart.join("-"));
    }
    if (kpRating) {
      url.searchParams.append("rating.kp", kpRating.join("-"));
    }
    if (networks) {
      for (const network of networks) {
        url.searchParams.append("networks.items.name", network);
      }
    }

    const href = url.href;

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      console.error(`Could not fetch movies with href = ${href}`);
      console.error(error);
    }
  }
}

export const api = new Api();
