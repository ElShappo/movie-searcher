export class ApiException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiException";
  }
}

export class CountriesException extends ApiException {
  constructor() {
    super("Не удалось получить список стран");
    this.name = "CountriesException";
  }
}

export class TypesException extends ApiException {
  constructor() {
    super("Не удалось получить тип картины");
    this.name = "TypesException";
  }
}

export class GenresException extends ApiException {
  constructor() {
    super("Не удалось получить список жанров");
    this.name = "GenresException";
  }
}

export class NetworksException extends ApiException {
  constructor() {
    super("Не удалось получить список каналов");
    this.name = "NetworksException";
  }
}

export class MoviesByNameException extends ApiException {
  constructor() {
    super("Не удалось получить список картин по названию");
    this.name = "MoviesByNameException";
  }
}

export class MoviesByFiltersException extends ApiException {
  constructor() {
    super("Не удалось получить список картин по выставленным фильтрам");
    this.name = "MoviesByFiltersException";
  }
}

export class MovieByIdException extends ApiException {
  constructor() {
    super("Не удалось загрузить картину");
    this.name = "MovieByIdException";
  }
}

export class MovieImagesByIdException extends ApiException {
  constructor() {
    super("Не удалось получить снимки картины");
    this.name = "MovieImagesByIdException";
  }
}

export class MovieCommentsByIdException extends ApiException {
  constructor() {
    super("Не удалось получить список комментариев");
    this.name = "MovieCommentsByIdException";
  }
}

export class MovieActorsByIdException extends ApiException {
  constructor() {
    super("Не удалось получить список актёров");
    this.name = "MovieActorsByIdException";
  }
}

export class MovieSeasonsByIdException extends ApiException {
  constructor() {
    super("Не удалось получить список сезонов");
    this.name = "MovieSeasonsByIdException";
  }
}
