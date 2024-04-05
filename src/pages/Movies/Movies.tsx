import { Card, DatePicker, Divider, Input, Select, SelectProps } from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { dateFormat, minDateString } from "../../constants";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const Movies = () => {
  useEffect(() => {
    console.log(process.env.REACT_APP_API_KEY);
  }, []);
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
            defaultValue={["a10", "c12"]}
            onChange={handleChange}
            options={options}
          />
        </article>
        <article className="flex items-center gap-x-2">
          <span className="text-xl max-md:text-base flex items-center">Age rating: </span>
          <Select
            className="w-48 max-h-20 overflow-y-auto"
            mode="multiple"
            allowClear
            placeholder="Choose age rating"
            defaultValue={["a10", "c12"]}
            onChange={handleChange}
            options={options}
          />
        </article>
      </section>
      <section className="flex flex-wrap justify-center">
        <div className="w-full text-center text-xl max-md:text-base">Search by name:</div>
        <div className="w-[40%] max-xl:w-[50%] max-sm:w-full px-10 max-md:px-4 max-sm:px-10 pt-2">
          <Input placeholder="Find movie or series: " />
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
      </section>
    </main>
  );
};

export default Movies;
