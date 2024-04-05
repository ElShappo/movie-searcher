import { Card, DatePicker, Divider, Input, Pagination, PaginationProps, Select, SelectProps } from "antd";
import Meta from "antd/es/card/Meta";
import { FormEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ageRatings, dateFormat, minDateString, pageSizeOptions } from "../../constants";
import { api } from "../../utils";
import { Country, Movie, MovieUniversalSearchResponse } from "../../types";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const ageRatingOptions: SelectProps["options"] = ageRatings.map((age) => ({
  label: age,
  value: age,
}));

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const Movies = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [countries, setCountries] = useState<SelectProps["options"]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [pageNo, setPageNo] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagesCount, setPagesCount] = useState(50);
  const [startAndEndYears, setStartAndEndYears] = useState<[number, number]>();

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  };

  const onPaginationChange: PaginationProps["onChange"] = (pageNo, pageSize) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
    console.log(pageNo, pageSize);
  };

  useEffect(() => {
    async function fetchCountries() {
      setCountriesLoading(true);
      const countries = (await api.get("countries")) as Country[];
      console.log(countries);
      setCountries(
        countries.map((country) => ({
          label: country.name,
          value: country.name,
        }))
      );
      setCountriesLoading(false);
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    async function fetchMovies() {
      const timeoutId = setTimeout(() => {
        setCardLoading(true);
      }, 500);

      const response = (await api.getMovies({
        limit: pageSize,
        page: pageNo,
        name: debouncedInputValue,
        years: startAndEndYears,
        countries: countries?.map((country) => String(country.value)),
      })) as MovieUniversalSearchResponse;

      const movies = response.docs;

      clearTimeout(timeoutId);

      console.warn("Got movies: ");
      console.warn(movies);

      setMovies(movies);
      setCardLoading(false);
      setPagesCount(response.pages);
    }
    fetchMovies();
  }, [countries, debouncedInputValue, pageNo, pageSize, startAndEndYears]);

  return (
    <main>
      <section className="flex flex-wrap justify-center gap-x-5 gap-y-2 p-5">
        <article className="flex items-center gap-x-2">
          <span className="text-xl max-md:text-base flex items-center">Years: </span>
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
          <span className="text-xl max-md:text-base flex items-center">Countries: </span>
          <Select
            loading={countriesLoading}
            className="w-48 max-h-20 overflow-y-auto"
            mode="multiple"
            allowClear
            placeholder="Choose countries"
            onChange={handleChange}
            options={countries}
          />
        </article>
        <article className="flex items-center gap-x-2">
          <span className="text-xl max-md:text-base flex items-center">Age rating: </span>
          <Select
            className="w-48 max-h-20 overflow-y-auto"
            mode="multiple"
            allowClear
            placeholder="Choose age rating"
            onChange={handleChange}
            options={ageRatingOptions}
          />
        </article>
      </section>
      <section className="flex flex-wrap justify-center">
        <div className="w-full text-center text-xl max-md:text-base">Search by name:</div>
        <div className="w-[40%] max-xl:w-[50%] max-sm:w-full px-10 max-md:px-4 max-sm:px-10 pt-2">
          <Input placeholder="Find movie or series: " onChange={handleInputChange} />
        </div>
      </section>
      <Divider />
      <section>
        <div className="px-4 gap-8 justify-center pb-4 flex flex-wrap">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              loading={cardLoading}
              hoverable
              style={{ width: 240 }}
              cover={<img alt="example" src={movie.poster.url} />}
            >
              <Meta title={movie.name} description={movie.shortDescription} />
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Pagination onChange={onPaginationChange} total={pagesCount} pageSizeOptions={pageSizeOptions} />
        </div>
      </section>
    </main>
  );
};

export default Movies;
