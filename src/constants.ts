import { TreeData } from "./types";

export const debounceTimeout = 1000;
export const dateFormat = "YYYY-MM-DD";
export const minDateString = "1920-00-00";
export const pageSizeOptions = [10, 20, 50, 100];
export const maxLimit = 200; // don't allow to get more that 'maxLimit' items at a time
export const movieImagesLimit = 20; // such number of images is more than enough
export const defaultPagesCount = 50;
export const loadingMessage = "Идёт загрузка...";

export const ageRatings: TreeData[] = [
  {
    title: "All",
    value: "all",
    key: "all",
    children: [
      {
        title: "G",
        value: "g",
        key: "g",
      },
      {
        title: "PG",
        value: "pg",
        key: "pg",
      },
      {
        title: "PG-13",
        value: "pg13",
        key: "pg13",
      },
      {
        title: "R",
        value: "r",
        key: "r",
      },
      {
        title: "NC-17",
        value: "nc17",
        key: "nc17",
      },
    ],
  },
];
