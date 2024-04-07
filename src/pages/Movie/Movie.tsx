import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../types";
import { api } from "../../utils";
import { Carousel, Divider, Image } from "antd";
import "./Movie.css";

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
      {movie?.name ? (
        <h1 className="text-4xl pt-10 text-center text-white font-extrabold">{movie?.name}</h1>
      ) : (
        <h1 className="text-4xl pt-10 text-center text-white font-extrabold italic">Без названия</h1>
      )}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 pt-8 px-14">
        <article className="w-2/6 max-xl:w-full rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
          <h2>Описание</h2>
          {movie?.description ? (
            <p className="pt-2">{movie?.description}</p>
          ) : (
            <p className="pt-2 italic">Описание фильма отсутствует</p>
          )}
        </article>
        <article className="w-1/5 max-xl:w-full rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
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
        <article className="w-2/5 max-xl:w-full rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
          <h2>Кадры</h2>
          {movieImages.length ? (
            <Image.PreviewGroup>
              <Carousel
                autoplay
                autoplaySpeed={4000}
                infinite={false}
                className="pt-4 pb-2"
                dots={{ className: "text-white" }}
              >
                {movieImages.map((image) => (
                  <div className="!flex !justify-center" key={image}>
                    <Image src={image} alt="image" fallback="fallback.png" className="max-h-[400px]" />
                  </div>
                ))}
              </Carousel>
            </Image.PreviewGroup>
          ) : (
            <p className="pt-2 italic">По данной картине не нашлось ни одного снимка</p>
          )}
        </article>
      </div>
    </section>
  );
};

export default MoviePage;
