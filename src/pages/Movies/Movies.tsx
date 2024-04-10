import {
  Card,
  DatePicker,
  Divider,
  Input,
  Pagination,
  PaginationProps,
  Radio,
  RadioChangeEvent,
  Tooltip,
  TreeSelect,
  notification,
} from "antd";
import Meta from "antd/es/card/Meta";
import { FormEvent, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  ageRatings,
  dateFormat,
  debounceTimeout,
  defaultPagesCount,
  maxDateString,
  maxYear,
  minDateString,
  minYear,
  pageSizeOptions,
} from "../../constants";
import { Country, Movie, MoviePickRadioOption, MovieUniversalSearchResponse, TreeData } from "../../types";
import NoResults from "../../components/NoResults/NoResults";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api";
import { ApiException, CountriesException } from "../../exceptions";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialDebouncedValue = searchParams.get("name") || "";
  const initialPageSize = +(searchParams.get("pageSize") || pageSizeOptions[0]);
  const initialPageNo = +(searchParams.get("pageNo") || 1);

  let initialRadioValue: MoviePickRadioOption;
  let initialStartAndEndYears: [number, number];

  if (searchParams.get("radioValue") === "movieFilters" || searchParams.get("radioValue") === "movieName") {
    initialRadioValue = searchParams.get("radioValue") as MoviePickRadioOption;
  } else {
    initialRadioValue = "movieFilters";
  }

  const rawInitialStartAndEndYears = searchParams
    .get("startAndEndYears")
    ?.split("-")
    .map((year) => +year);

  if (
    rawInitialStartAndEndYears &&
    rawInitialStartAndEndYears.length === 2 &&
    rawInitialStartAndEndYears[0] >= minYear &&
    rawInitialStartAndEndYears[1] <= maxYear
  ) {
    initialStartAndEndYears = rawInitialStartAndEndYears as [number, number];
  } else {
    initialStartAndEndYears = [minYear, maxYear];
  }

  const initialChosenAgeRatings = searchParams.getAll("ageRating");
  const initialChosenCountries = searchParams.getAll("country");

  const [inputValue, setInputValue] = useState(initialDebouncedValue);
  const [debouncedInputValue, setDebouncedInputValue] = useState(initialDebouncedValue);

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pagesCount, setPagesCount] = useState(defaultPagesCount);
  const [pageNo, setPageNo] = useState(initialPageNo);

  const [chosenAgeRatings, setChosenAgeRatings] = useState<string[]>(initialChosenAgeRatings);
  const [chosenCountries, setChosenCountries] = useState<string[]>(initialChosenCountries);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [startAndEndYears, setStartAndEndYears] = useState<[number, number] | undefined>(initialStartAndEndYears);

  const [countries, setCountries] = useState<TreeData[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const [radioValue, setRadioValue] = useState<MoviePickRadioOption>(initialRadioValue);

  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  };

  const onPaginationChange: PaginationProps["onChange"] = (pageNo, pageSize) => {
    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set("pageSize", pageSize.toString());
    urlSearchParams.set("pageNo", pageNo.toString());

    setSearchParams(urlSearchParams);

    setPageNo(pageNo);
    setPageSize(pageSize);
    console.log(pageNo, pageSize);
  };

  const handleAgeRatingChange = (value: string[]) => {
    console.log(`selected age ratings ${value}`);
    const filteredValue = value.filter((val) => val !== "all");
    console.log(`filtered selected age ratings ${filteredValue}`);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete("ageRating");

    for (const singleValue of filteredValue) {
      urlSearchParams.append("ageRating", singleValue);
    }

    setSearchParams(urlSearchParams);
    setChosenAgeRatings(filteredValue);
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
    setChosenCountries(filteredValue);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);

    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set("radioValue", e.target.value);

    setSearchParams(urlSearchParams);
    setRadioValue(e.target.value);
  };

  const handleCardClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  useEffect(() => {
    async function fetchCountries() {
      setCountriesLoading(true);

      try {
        const countries = (await api.get("countries")) as Country[];
        const countriesTreeData = [
          {
            title: "All",
            value: "all",
            key: "all",
            children: [],
          },
        ] as TreeData[];

        countries.forEach((country) => {
          countriesTreeData[0].children!.push({
            title: country.name,
            value: country.name,
            key: country.name,
          });
        });

        setCountries(countriesTreeData);
      } catch (error) {
        notificationApi.error({
          message: "Произошла ошибка",
          description: (error as CountriesException).message,
          duration: 3,
        });
      }
      setCountriesLoading(false);
    }
    fetchCountries();
  }, [notificationApi]);

  useEffect(() => {
    if (radioValue === "movieFilters") {
      setInputValue("");
    } else {
      setChosenCountries([]);
      setChosenAgeRatings([]);
      setStartAndEndYears(undefined);
    }
  }, [radioValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const urlSearchParams = new URLSearchParams(searchParams);

      urlSearchParams.set("name", inputValue);

      setSearchParams(urlSearchParams);
      setDebouncedInputValue(inputValue);
    }, debounceTimeout);
    return () => clearTimeout(timeoutId);
  }, [inputValue, searchParams, setSearchParams]);

  useEffect(() => {
    async function fetchMovies() {
      const timeoutId = setTimeout(() => {
        setMoviesLoading(true);
      }, 500);

      try {
        const response = (await api.getMovies({
          limit: pageSize,
          page: pageNo,
          name: debouncedInputValue,
          years: startAndEndYears,
          countries: chosenCountries,
          ratingsMpaa: chosenAgeRatings,
        })) as MovieUniversalSearchResponse;

        const movies = response.docs;

        console.warn("Got movies: ");
        console.warn(movies);

        setMovies(movies);
        setMoviesLoading(false);

        setPagesCount(response.pages);
      } catch (error) {
        notificationApi.error({
          message: "Произошла ошибка",
          description: (error as ApiException).message,
          duration: 3,
        });
      } finally {
        clearTimeout(timeoutId);
      }
    }
    fetchMovies();
  }, [chosenAgeRatings, chosenCountries, debouncedInputValue, notificationApi, pageNo, pageSize, startAndEndYears]);

  const filteredMovies = useMemo(() => {
    // return movies.filter((movie) => movie.name && (movie.poster.url || movie.description || movie.shortDescription));
    return movies;
  }, [movies]);

  return (
    <>
      {contextHolder}
      <Divider className="m-0" />
      <main>
        <section className="w-full flex flex-wrap items-center gap-x-3 gap-y-2 justify-center pt-4">
          <span className="pb-1">Выбрать фильм: </span>
          <Radio.Group onChange={onRadioChange} value={radioValue}>
            <Radio value={"movieFilters" as MoviePickRadioOption}>По фильтрам</Radio>
            <Radio value={"movieName" as MoviePickRadioOption}>По названию</Radio>
          </Radio.Group>
        </section>
        {radioValue === "movieFilters" ? (
          <section className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2 pb-4">
            <article className="flex items-center gap-x-2">
              <span className="flex items-center">Years: </span>
              <RangePicker
                picker="year"
                defaultValue={[
                  dayjs(initialStartAndEndYears[0].toString()),
                  dayjs(initialStartAndEndYears[1].toString()),
                ]}
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
                  setStartAndEndYears(dateNumbers);
                }}
              />
            </article>
            <article className="flex items-center gap-x-2">
              <span className="flex items-center">Countries: </span>
              <TreeSelect
                defaultValue={initialChosenCountries}
                className="w-48 max-h-20 overflow-y-auto"
                treeData={countries}
                treeCheckable
                placeholder="Choose countries"
                onChange={handleCountriesChange}
                loading={countriesLoading}
                showCheckedStrategy="SHOW_PARENT"
              />
            </article>
            <article className="flex items-center gap-x-2">
              <span className="flex items-center">Age rating: </span>
              <TreeSelect
                defaultValue={initialChosenAgeRatings}
                className="w-48 max-h-20 overflow-y-auto"
                treeData={ageRatings}
                treeCheckable
                placeholder="Choose age rating"
                onChange={handleAgeRatingChange}
                showCheckedStrategy="SHOW_PARENT"
              />
            </article>
          </section>
        ) : (
          <section className="flex flex-wrap justify-center pb-4">
            <div className="w-[40%] max-xl:w-[50%] max-sm:w-full px-10 max-md:px-4 max-sm:px-10 pt-2">
              <Input
                defaultValue={initialDebouncedValue}
                placeholder="Find movie or series: "
                onChange={handleInputChange}
              />
            </div>
          </section>
        )}
        <Divider className="mt-0" />
        <section>
          <div className="px-4 gap-8 justify-center flex flex-wrap pb-20">
            {moviesLoading ? (
              new Array(pageSize).fill(1).map((val, index) => (
                <Card key={index} loading={true} style={{ width: 240 }}>
                  <Meta title="Loading..." description="Loading..." />
                </Card>
              ))
            ) : !moviesLoading && !filteredMovies.length ? (
              <NoResults />
            ) : (
              filteredMovies.map((movie) => (
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
              ))
            )}
          </div>
        </section>
      </main>
      <footer className="w-full fixed flex justify-center bottom-0 bg-[#242424] bg-opacity-80">
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={pageNo}
          onChange={onPaginationChange}
          total={pagesCount * 10}
          pageSizeOptions={pageSizeOptions}
          className="py-2"
        />
      </footer>
    </>
  );
};

export default Movies;
