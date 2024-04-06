class API {
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
      const result = await response.json();
      console.log(result);

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
      console.error(`Could not get ${key} with href = ${href}`);
      console.error(error);
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
    name: string;
    years?: [number, number];
    countries?: string[]; // one can get list of all countries
    ratingsMpaa?: string[];
  }) {
    // const url = new URL(`${this.#apiPath}/movie/search`);
    const url = new URL(`${this.#apiPath}/movie`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    for (const field of this.#selectFieldsMoviesPage) {
      url.searchParams.append("selectFields", field);
    }

    if (years) {
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
    // url.searchParams.set("query", name);

    const href = url.href;
    console.log(`Total href = ${href}`);

    try {
      const response = await fetch(href, {
        headers: {
          "X-API-KEY": this.#apiKey,
        },
      });
      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      console.error(`Could not fetch movies with href = ${href}`);
      console.error(error);
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
      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      console.error(`Could not fetch movies with href = ${href}`);
      console.error(error);
    }
  }
}

export const api = new API();
