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
} from "antd";
import Meta from "antd/es/card/Meta";
import { FormEvent, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ageRatings, dateFormat, minDateString, pageSizeOptions } from "../../constants";
import { api } from "../../utils";
import { Country, Movie, MoviePickRadioOption, MovieUniversalSearchResponse, TreeData } from "../../types";
import NoResults from "../../components/NoResults/NoResults";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const Movies = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [pagesCount, setPagesCount] = useState(50);
  const [pageNo, setPageNo] = useState(1);

  const [chosenAgeRatings, setChosenAgeRatings] = useState<string[]>([]);
  const [chosenCountries, setChosenCountries] = useState<string[]>([]);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [startAndEndYears, setStartAndEndYears] = useState<[number, number]>();

  const [countries, setCountries] = useState<TreeData[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const [radioValue, setRadioValue] = useState<MoviePickRadioOption>("movieFilters");

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  };

  const onPaginationChange: PaginationProps["onChange"] = (pageNo, pageSize) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
    console.log(pageNo, pageSize);
  };

  const handleAgeRatingChange = (value: string[]) => {
    console.log(`selected age ratings ${value}`);
    const filteredValue = value.filter((val) => val !== "all");
    console.log(`filtered selected age ratings ${filteredValue}`);
    setChosenAgeRatings(filteredValue);
  };

  const handleCountriesChange = (value: string[]) => {
    console.log(`selected countries ${value}`);
    const filteredValue = value.filter((val) => val !== "all");
    console.log(`filtered selected countries ${filteredValue}`);
    setChosenCountries(filteredValue);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setRadioValue(e.target.value);
  };

  useEffect(() => {
    async function fetchCountries() {
      setCountriesLoading(true);
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
      setCountriesLoading(false);
    }
    fetchCountries();
  }, []);

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
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    async function fetchMovies() {
      const timeoutId = setTimeout(() => {
        setMoviesLoading(true);
      }, 500);

      const response = (await api.getMovies({
        limit: pageSize,
        page: pageNo,
        name: debouncedInputValue,
        years: startAndEndYears,
        countries: chosenCountries,
        ratingsMpaa: chosenAgeRatings,
      })) as MovieUniversalSearchResponse;

      const movies = response.docs;

      clearTimeout(timeoutId);

      console.warn("Got movies: ");
      console.warn(movies);

      setMovies(movies);
      setMoviesLoading(false);

      setPagesCount(response.pages);
    }
    fetchMovies();
  }, [chosenAgeRatings, chosenCountries, countries, debouncedInputValue, pageNo, pageSize, startAndEndYears]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => movie.name && (movie.poster.url || movie.description || movie.shortDescription));
    // return movies;
  }, [movies]);

  return (
    <>
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
                minDate={dayjs(minDateString, dateFormat)}
                maxDate={dayjs()}
                id={{
                  start: "startInput",
                  end: "endInput",
                }}
                onChange={(date, dateString) => {
                  const dateNumbers = dateString.map((str) => +str) as [number, number];
                  console.log(dateNumbers);
                  setStartAndEndYears(dateNumbers);
                }}
              />
            </article>
            <article className="flex items-center gap-x-2">
              <span className="flex items-center">Countries: </span>
              <TreeSelect
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
              <Input placeholder="Find movie or series: " onChange={handleInputChange} />
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
                  cover={<img alt="example" src={movie.poster.url || "no-poster.jpg"} />}
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
