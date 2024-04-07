import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../types";
import { api } from "../../utils";
import { Divider } from "antd";

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    async function fetchMovie() {
      if (id) {
        const movie = await api.getMovieById(id);
        setMovie(movie);
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
      <h1 className="text-4xl pt-10 text-center text-white font-extrabold">{movie?.name}</h1>
      <div className="flex flex-wrap gap-x-8 pt-8 px-14">
        <article className="w-2/5 rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
          <h2>Описание</h2>
          <p className="pt-2">{movie?.description}</p>
        </article>
        <article className="w-1/5 rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
          <h2>Рейтинги</h2>
          <div className="flex items-baseline">
            <h4>IMDB: </h4>
            <p className="pt-2 pl-2">{movie?.rating.imdb}</p>
          </div>
          <div className="flex items-baseline">
            <h4>Кинопоиск: </h4>
            <p className="pt-2 pl-2">{movie?.rating.kp}</p>
          </div>
          <Divider className="m-3" />
          <div className="flex items-baseline">
            <h4>Российские критики: </h4>
            <p className="pl-2">{movie?.rating.russianFilmCritics}</p>
          </div>
          <div className="flex items-baseline">
            <h4>Зарубежные критики: </h4>
            <p className="pt-2 pl-2">{movie?.rating.filmCritics}</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default MoviePage;
