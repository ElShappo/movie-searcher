import { ageRatings } from "./constants";

export type AgeRating = (typeof ageRatings)[number];
export type Country = {
  name: string;
  slug: string;
};
