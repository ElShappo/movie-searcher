import { Card, DatePicker, Divider, Input, Pagination, PaginationProps, Select, SelectProps } from "antd";
import Meta from "antd/es/card/Meta";
import { FormEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ageRatings, dateFormat, minDateString, pageSizeOptions } from "../../constants";
import { api } from "../../utils";
import { Country } from "../../types";

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
  const [pageSize, setPageSize] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [movies, setMovies] = useState<[]>([]);

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
      const countries = (await api.get("countries")) as Country[];
      console.log(countries);
      setCountries(
        countries.map((country) => ({
          label: country.name,
          value: country.name,
        }))
      );
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // useEffect(() => {
  //   async function fetchMovies() {
  //     const movies = await api.getMovies({ limit: pageSize, page: pageNo, name: debouncedInputValue });
  //     setMovies(movies);
  //   }
  //   fetchMovies();
  // }, [debouncedInputValue, pageNo, pageSize]);

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
            onFocus={(_, info) => {
              console.log("Focus:", info.range);
            }}
            onBlur={(_, info) => {
              console.log("Blur:", info.range);
            }}
          />
        </article>
        <article className="flex items-center gap-x-2">
          <span className="text-xl max-md:text-base flex items-center">Countries: </span>
          <Select
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
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <div className="flex justify-center">
          <Pagination onChange={onPaginationChange} total={500} pageSizeOptions={pageSizeOptions} />
        </div>
      </section>
    </main>
  );
};

export default Movies;
