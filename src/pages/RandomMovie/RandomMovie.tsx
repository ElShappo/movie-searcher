import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api";
import { Button, Card, DatePicker, Divider, Slider, SliderSingleProps, Tooltip, TreeSelect, notification } from "antd";
import { ApiException } from "../../exceptions";
import { dateFormat, maxDateString, maxYear, minDateString, minYear, networksTreeData } from "../../constants";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Country, Genre, Movie, TreeData, Type } from "../../types";
import Meta from "antd/es/card/Meta";
import NoResults from "../../components/NoResults/NoResults";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const marks: SliderSingleProps["marks"] = {
  0: {
    style: {
      color: "red",
    },
    label: 0,
  },
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: {
    style: {
      color: "gray",
    },
    label: 5,
  },
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: {
    style: {
      color: "#cfca00",
    },
    label: <strong>10</strong>,
  },
};

const RandomMovie = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const chosenGenres = useMemo(() => {
    return searchParams.getAll("genre");
  }, [searchParams]);

  const chosenCountries = useMemo(() => {
    return searchParams.getAll("country");
  }, [searchParams]);

  const chosenTypes = useMemo(() => {
    return searchParams.getAll("type");
  }, [searchParams]);

  const chosenNetworks = useMemo(() => {
    return searchParams.getAll("network");
  }, [searchParams]);

  const startAndEndYears: [number, number] = useMemo(() => {
    const rawStartAndEndYears = searchParams
      .get("startAndEndYears")
      ?.split("-")
      .map((year) => +year);

    if (
      rawStartAndEndYears &&
      rawStartAndEndYears.length === 2 &&
      rawStartAndEndYears[0] >= minYear &&
      rawStartAndEndYears[1] <= maxYear
    ) {
      return rawStartAndEndYears as [number, number];
    } else {
      return [minYear, maxYear];
    }
  }, [searchParams]);

  const startAndEndKpRatings: [number, number] = useMemo(() => {
    const rawStartAndEndKpRatings = searchParams
      .get("startAndEndKpRatings")
      ?.split("-")
      .map((rating) => +rating);

    if (
      rawStartAndEndKpRatings &&
      rawStartAndEndKpRatings.length === 2 &&
      rawStartAndEndKpRatings[0] >= 0 &&
      rawStartAndEndKpRatings[1] <= 10
    ) {
      return rawStartAndEndKpRatings as [number, number];
    } else {
      return [0, 10];
    }
  }, [searchParams]);
  const [searchWasRun, setSearchWasRun] = useState(false);

  const [movie, setMovie] = useState<Movie>();
  const [movieLoading, setMovieLoading] = useState(false);

  const [genres, setGenres] = useState<TreeData[]>([]);
  const [genresLoading, setGenresLoading] = useState(false);

  const [countries, setCountries] = useState<TreeData[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const [types, setTypes] = useState<TreeData[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);

  const [notificationApi, contextHolder] = notification.useNotification();

  const handleGenresChange = (value: string[]) => {
    console.log(`selected genres ${value}`);
    const filteredValue = value.filter((val) => val !== "all");
    console.log(`filtered selected genres ${filteredValue}`);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete("genre");

    for (const singleValue of filteredValue) {
      urlSearchParams.append("genre", singleValue);
    }
    setSearchParams(urlSearchParams);
  };

  const handleCountriesChange = (value: string[]) => {
    console.log(`selected countries ${value}`);
    const filteredValue = value.filter((val) => val !== "all");
    console.log(`filtered selected countries ${filteredValue}`);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete("country");

    for (const singleValue of filteredValue) {
      urlSearchParams.append("country", singleValue);
    }
    setSearchParams(urlSearchParams);
  };

  const handleTypesChange = (value: string[]) => {
    console.log(`selected types ${value}`);
    const filteredValue = value.filter((val) => val !== "all");
    console.log(`filtered selected types ${filteredValue}`);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete("type");

    for (const singleValue of filteredValue) {
      urlSearchParams.append("type", singleValue);
    }
    setSearchParams(urlSearchParams);
  };

  const handleNetworksChange = (value: string[]) => {
    console.log(`selected networks ${value}`);
    const filteredValue = value.filter((val) => val !== "all");
    console.log(`filtered selected networks ${filteredValue}`);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete("network");

    for (const singleValue of filteredValue) {
      urlSearchParams.append("network", singleValue);
    }
    setSearchParams(urlSearchParams);
  };

  const handleCardClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  const handleSliderChange = (value: number[]) => {
    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set("startAndEndKpRatings", value.join("-"));
    setSearchParams(urlSearchParams);
  };

  useEffect(() => {
    async function fetchGenres() {
      setGenresLoading(true);
      try {
        const res = (await api.get("genres")) as Genre[];
        const genresTreeData = [
          {
            title: "All",
            value: "all",
            key: "all",
            children: [],
          },
        ] as TreeData[];

        res.forEach((genre) => {
          genresTreeData[0].children!.push({
            title: genre.name,
            value: genre.name,
            key: genre.name,
          });
        });
        setGenres(genresTreeData);
      } catch (error) {
        notificationApi.error({
          message: "Произошла ошибка",
          description: (error as ApiException).message,
          duration: 3,
        });
      }
      setGenresLoading(false);
    }
    async function fetchCountries() {
      setCountriesLoading(true);
      try {
        const res = (await api.get("countries")) as Country[];
        const countriesTreeData = [
          {
            title: "All",
            value: "all",
            key: "all",
            children: [],
          },
        ] as TreeData[];

        res.forEach((genre) => {
          countriesTreeData[0].children!.push({
            title: genre.name,
            value: genre.name,
            key: genre.name,
          });
        });
        setCountries(countriesTreeData);
      } catch (error) {
        notificationApi.error({
          message: "Произошла ошибка",
          description: (error as ApiException).message,
          duration: 3,
        });
      }
      setCountriesLoading(false);
    }

    async function fetchTypes() {
      setTypesLoading(true);
      try {
        const res = (await api.get("types")) as Type[];
        const typesTreeData = [
          {
            title: "All",
            value: "all",
            key: "all",
            children: [],
          },
        ] as TreeData[];

        res.forEach((genre) => {
          typesTreeData[0].children!.push({
            title: genre.name,
            value: genre.name,
            key: genre.name,
          });
        });
        setTypes(typesTreeData);
      } catch (error) {
        notificationApi.error({
          message: "Произошла ошибка",
          description: (error as ApiException).message,
          duration: 3,
        });
      }
      setTypesLoading(false);
    }
    fetchGenres();
    fetchCountries();
    fetchTypes();
  }, [notificationApi]);

  async function fetchMovie() {
    setMovieLoading(true);
    setSearchWasRun(true);
    try {
      const movie = await api.getRandomMovie({
        countries: chosenCountries,
        genres: chosenGenres,
        networks: chosenNetworks,
        types: chosenTypes,
        releaseYearsStart: startAndEndYears,
        kpRating: startAndEndKpRatings,
      });
      setMovie(movie);
    } catch (error) {
      notificationApi.error({
        message: "Произошла ошибка",
        description: (error as ApiException).message,
        duration: 3,
      });
    }
    setMovieLoading(false);
  }

  return (
    <>
      {contextHolder}
      <Divider className="m-0" />
      <main>
        <section className="flex flex-wrap justify-center gap-x-5 gap-y-4 pt-2 pb-4 px-4">
          <h2 className="w-full text-center">Фильтры</h2>
          <article className="flex items-center gap-x-2">
            <span className="flex items-center">Жанры: </span>
            <TreeSelect
              defaultValue={chosenGenres}
              className="w-48 max-h-20 overflow-y-auto"
              treeData={genres}
              treeCheckable
              placeholder="Выберите жанр"
              onChange={handleGenresChange}
              loading={genresLoading}
              showCheckedStrategy="SHOW_PARENT"
            />
          </article>
          <article className="flex items-center gap-x-2">
            <span className="flex items-center">Страны: </span>
            <TreeSelect
              defaultValue={chosenCountries}
              className="w-48 max-h-20 overflow-y-auto"
              treeData={countries}
              treeCheckable
              placeholder="Выберите страны"
              onChange={handleCountriesChange}
              loading={countriesLoading}
              showCheckedStrategy="SHOW_PARENT"
            />
          </article>
          <article className="flex items-center gap-x-2">
            <span className="flex items-center">Вид картины: </span>
            <TreeSelect
              defaultValue={chosenTypes}
              className="w-48 max-h-20 overflow-y-auto"
              treeData={types}
              treeCheckable
              placeholder="Выберите вид картины"
              onChange={handleTypesChange}
              loading={typesLoading}
              showCheckedStrategy="SHOW_PARENT"
            />
          </article>
          <article className="flex items-center gap-x-2">
            <span className="flex items-center">Год выпуска: </span>
            <RangePicker
              picker="year"
              defaultValue={[dayjs(startAndEndYears[0].toString()), dayjs(startAndEndYears[1].toString())]}
              minDate={dayjs(minDateString, dateFormat)}
              maxDate={dayjs(maxDateString, dateFormat)}
              id={{
                start: "startInput",
                end: "endInput",
              }}
              onChange={(date, dateString) => {
                const dateNumbers = dateString.map((str) => +str) as [number, number];
                const urlSearchParams = new URLSearchParams(searchParams);

                urlSearchParams.set("startAndEndYears", dateString.join("-"));

                console.log(dateNumbers);
                setSearchParams(urlSearchParams);
              }}
            />
          </article>
          <article className="flex items-center gap-x-2">
            <span className="flex items-center">Сеть производства: </span>
            <TreeSelect
              defaultValue={chosenNetworks}
              className="w-52 max-h-20 overflow-y-auto"
              treeData={networksTreeData}
              treeCheckable
              placeholder="Выберите сеть произв-ва"
              onChange={handleNetworksChange}
              showCheckedStrategy="SHOW_PARENT"
            />
          </article>
          <article className="flex items-center gap-x-2 w-1/2 max-sm:w-full">
            <span className="flex items-center">Рейтинг на кинопоиске: </span>
            <Slider
              marks={marks}
              min={0}
              max={10}
              step={0.1}
              range={{ draggableTrack: true }}
              defaultValue={startAndEndKpRatings}
              onChangeComplete={handleSliderChange}
              className="w-full"
            />
          </article>
          <article className="w-full flex justify-center pb-2">
            <Button type="primary" className="text-xl flex items-center px-8 py-5" onClick={fetchMovie}>
              Поехали!
            </Button>
          </article>
        </section>
        <Divider className="mt-0" />
        <section>
          <div className="px-4 gap-8 justify-center flex flex-wrap pb-20">
            {movieLoading ? (
              <Card loading={true} style={{ width: 340 }}>
                <Meta title="Loading..." description="Loading..." />
              </Card>
            ) : !movie ? (
              searchWasRun ? (
                <NoResults />
              ) : null
            ) : (
              <Card
                key={movie.id}
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={movie.poster.url || "/no-poster.jpg"} />}
                onClick={() => handleCardClick(movie.id)}
              >
                <Meta
                  title={movie.name}
                  description={
                    movie.shortDescription ? (
                      movie.shortDescription
                    ) : movie.description ? (
                      <Tooltip title={movie.description} placement="right" mouseEnterDelay={0.5}>
                        <div>{movie.description}</div>
                      </Tooltip>
                    ) : (
                      <span className="italic">Описание картины отсутствует</span>
                    )
                  }
                  className="max-h-48"
                />
              </Card>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default RandomMovie;
