import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../types";
import { api } from "../../utils";

import MovieDescription from "../../components/Movie/MovieDescription/MovieDescription";
import MovieRatings from "../../components/Movie/MovieRatings/MovieRatings";
import MovieImages from "../../components/Movie/MovieImages/MovieImages";

import "./Movie.css";
import MovieTitle from "../../components/Movie/MovieTitle/MovieTitle";

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie>();
  const [movieImages, setMovieImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMovie() {
      if (id) {
        const movie = await api.getMovieById(id);
        setMovie(movie);

        const rawImages = await api.getMovieImagesById(id);
        const images = rawImages?.docs.map((item) => item.url);
        if (images) {
          setMovieImages(images);
        }
      }
    }
    fetchMovie();
  }, [id]);
  return (
    <section
      className="bg-cover min-h-[700px] shadow-inner brightness-90"
      style={{
        backgroundImage: `url(${movie?.backdrop.url})`,
        boxShadow: "inset 0 0 200px 200px rgba(0,0,0,0.9)",
      }}
    >
      <MovieTitle title={movie?.name} />
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 pt-8 px-14">
        <MovieDescription description={movie?.description} />
        <MovieRatings rating={movie?.rating} />
        <MovieImages images={movieImages} />
      </div>
    </section>
  );
};

export default MoviePage;
