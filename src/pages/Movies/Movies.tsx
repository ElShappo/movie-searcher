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

  const debouncedValue = useMemo(() => searchParams.get("name") || "", [searchParams]);
  const pageSize = useMemo(() => +(searchParams.get("pageSize") || pageSizeOptions[0]), [searchParams]);
  const pageNo = useMemo(() => +(searchParams.get("pageNo") || 1), [searchParams]);

  const radioValue: MoviePickRadioOption = useMemo(() => {
    if (searchParams.get("radioValue") === "movieFilters" || searchParams.get("radioValue") === "movieName") {
      return searchParams.get("radioValue") as MoviePickRadioOption;
    } else {
      return "movieFilters";
    }
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

  const chosenAgeRatings = useMemo(() => searchParams.getAll("ageRating"), [searchParams]);
  const chosenCountries = useMemo(() => searchParams.getAll("country"), [searchParams]);

  const [inputValue, setInputValue] = useState(debouncedValue);
  const [pagesCount, setPagesCount] = useState(defaultPagesCount);

  const [movies, setMovies] = useState<Movie[] | undefined>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  const [countries, setCountries] = useState<TreeData[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

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

  const onRadioChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);

    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set("radioValue", e.target.value);
    setSearchParams(urlSearchParams);
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
      searchParams.delete("name");
    } else {
      const keys = ["ageRating", "country", "startAndEndYears"];
      for (const key of keys) {
        searchParams.delete(key);
      }
    }
  }, [radioValue, searchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const urlSearchParams = new URLSearchParams(searchParams);

      urlSearchParams.set("name", inputValue);

      setSearchParams(urlSearchParams);
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
          name: debouncedValue,
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
  }, [chosenAgeRatings, chosenCountries, debouncedValue, pageNo, pageSize, startAndEndYears, notificationApi]);

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
              <span className="flex items-center">Countries: </span>
              <TreeSelect
                defaultValue={chosenCountries}
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
                defaultValue={chosenAgeRatings}
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
              <Input defaultValue={debouncedValue} placeholder="Find movie or series: " onChange={handleInputChange} />
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
            ) : !movies?.length ? (
              <NoResults />
            ) : (
              movies?.map((movie) => (
                <Card
                  key={movie.id}
                  hoverable
                  style={{ width: 240 }}
                  cover={<img alt="example" src={movie.poster?.url || "/no-poster.jpg"} />}
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
