import { TreeData } from "./types";

export const USERNAME = "elshappo";
export const PASSWORD = "42";

export const debounceTimeout = 1000;
export const dateFormat = "YYYY-MM-DD";

export const minYear = 1920;
export const maxYear = new Date().getFullYear();
export const minDateString = `${minYear}-00-00`;
export const maxDateString = `${maxYear}-00-00`;

export const pageSizeOptions = [10, 20, 50, 100];
export const maxLimit = 200; // don't allow to get more that 'maxLimit' items at a time
export const movieImagesLimit = 20; // such number of images is more than enough
export const defaultPagesCount = 1;
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

export const networksTreeData: TreeData[] = [
  {
    title: "All",
    value: "all",
    key: "all",
    children: [
      {
        title: "HBO",
        value: "HBO",
        key: "HBO",
      },
      {
        title: "Netflix",
        value: "Netflix",
        key: "Netflix",
      },
      {
        title: "Amazon",
        value: "Amazon",
        key: "Amazon",
      },
      {
        title: "Hulu",
        value: "Hulu",
        key: "Hulu",
      },
    ],
  },
];
