import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie, MovieActor, MovieComment, MovieSeason } from "../../types";

import MovieDescription from "../../components/Movie/MovieDescription/MovieDescription";
import MovieRatings from "../../components/Movie/MovieRatings/MovieRatings";
import MovieImages from "../../components/Movie/MovieImages/MovieImages";

import "./Movie.css";
import MovieTitle from "../../components/Movie/MovieTitle/MovieTitle";
import { defaultPagesCount, pageSizeOptions } from "../../constants";
import MovieComments from "../../components/Movie/MovieComments/MovieComments";
import MovieActors from "../../components/Movie/MovieActors/MovieActors";
import { api } from "../../api";
import MovieSeasons from "../../components/Movie/MovieSeasons/MovieSeasons";

const MoviePage = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<Movie>();
  const [movieLoading, setMovieLoading] = useState(false);

  const [movieImages, setMovieImages] = useState<string[]>([]);
  const [movieImagesLoading, setMovieImagesLoading] = useState(false);

  const [comments, setComments] = useState<MovieComment[]>([]);
  const [commentsPageNo, setCommentsPageNo] = useState<number>(1);
  const [commentsPageSize, setCommentsPageSize] = useState<number>(pageSizeOptions[0]);
  const [commentsPagesCount, setCommentsPagesCount] = useState<number>(defaultPagesCount);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [actors, setActors] = useState<MovieActor[]>([]);
  const [actorsPageNo, setActorsPageNo] = useState<number>(1);
  const [actorsPageSize, setActorsPageSize] = useState<number>(pageSizeOptions[0]);
  const [actorsPagesCount, setActorsPagesCount] = useState<number>(defaultPagesCount);
  const [actorsLoading, setActorsLoading] = useState(false);

  const [seasons, setSeasons] = useState<MovieSeason[]>([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);

  const commentsProps = useMemo(() => {
    return {
      comments,

      pageNo: commentsPageNo,
      pageSize: commentsPageSize,
      pagesCount: commentsPagesCount,

      isLoading: commentsLoading,

      setPageNo: setCommentsPageNo,
      setPageSize: setCommentsPageSize,
    };
  }, [comments, commentsLoading, commentsPageNo, commentsPageSize, commentsPagesCount]);

  const actorsProps = useMemo(() => {
    return {
      actors,

      pageNo: actorsPageNo,
      pageSize: actorsPageSize,
      pagesCount: actorsPagesCount,

      isLoading: actorsLoading,

      setPageNo: setActorsPageNo,
      setPageSize: setActorsPageSize,
    };
  }, [actors, actorsLoading, actorsPageNo, actorsPageSize, actorsPagesCount]);

  // useEffect(() => {
  //   async function fetchMovie() {
  //     if (id) {
  //       setCommentsLoading(true);
  //       setActorsLoading(true);
  //       setSeasonsLoading(true);

  //       const movie = await api.getMovieById(id);
  //       setMovie(movie);

  //       const rawImages = await api.getMovieImagesById(id);
  //       const images = rawImages?.docs.map((item) => item.url);
  //       if (images) {
  //         setMovieImages(images);
  //       }

  //       const rawComments = await api.getMovieCommentsById(id, commentsPageNo, commentsPageSize);
  //       const comments = rawComments?.docs;
  //       if (comments) {
  //         setComments(comments);
  //         setCommentsPagesCount(rawComments.pages);
  //       }

  //       const rawActors = await api.getMovieActorsById(id, actorsPageNo, actorsPageSize);
  //       const actors = rawActors?.docs;
  //       if (actors) {
  //         setActors(actors);
  //         setActorsPagesCount(rawActors.pages);
  //       }

  //       const rawSeasons = await api.getMovieSeasonsById(id);
  //       const seasons = rawSeasons?.docs;
  //       console.log("Got seasons:");
  //       console.log(seasons);
  //       if (seasons) {
  //         setSeasons(seasons);
  //       }

  //       setCommentsLoading(false);
  //       setActorsLoading(false);
  //       setSeasonsLoading(false);
  //     }
  //   }
  //   fetchMovie();
  // }, [actorsPageNo, actorsPageSize, commentsPageNo, commentsPageSize, id]);

  useEffect(() => {
    async function fetchMovie() {
      if (id) {
        setMovieLoading(true);

        const movie = await api.getMovieById(id);
        setMovie(movie);

        setMovieLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    async function fetchImages() {
      if (id) {
        setMovieImagesLoading(true);

        const rawImages = await api.getMovieImagesById(id);
        const images = rawImages?.docs.map((item) => item.url);
        if (images) {
          setMovieImages(images);
        }

        setMovieImagesLoading(false);
      }
    }
    fetchImages();
  }, [id]);

  useEffect(() => {
    async function fetchSeasons() {
      if (id) {
        setSeasonsLoading(true);

        const rawSeasons = await api.getMovieSeasonsById(id);
        const seasons = rawSeasons?.docs;
        console.log("Got seasons:");
        console.log(seasons);
        if (seasons) {
          setSeasons(seasons);
        }

        setSeasonsLoading(false);
      }
    }
    fetchSeasons();
  }, [id]);

  useEffect(() => {
    async function fetchActors() {
      if (id) {
        setActorsLoading(true);

        const rawActors = await api.getMovieActorsById(id, actorsPageNo, actorsPageSize);
        const actors = rawActors?.docs;
        if (actors) {
          setActors(actors);
          setActorsPagesCount(rawActors.pages);
        }

        setActorsLoading(false);
      }
    }
    fetchActors();
  }, [actorsPageNo, actorsPageSize, id]);

  useEffect(() => {
    async function fetchComments() {
      if (id) {
        setCommentsLoading(true);

        const rawComments = await api.getMovieCommentsById(id, commentsPageNo, commentsPageSize);
        const comments = rawComments?.docs;
        if (comments) {
          setComments(comments);
          setCommentsPagesCount(rawComments.pages);
        }

        setCommentsLoading(false);
      }
    }
    fetchComments();
  }, [commentsPageNo, commentsPageSize, id]);

  return (
    <section>
      <div
        className="bg-cover min-h-[700px] shadow-inner brightness-90"
        style={{
          backgroundImage: `url(${movie?.backdrop.url})`,
          boxShadow: "inset 0 0 200px 200px rgba(0,0,0,0.9)",
        }}
      >
        <MovieTitle title={movie?.name} />
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 py-8 px-14">
          <MovieDescription description={movie?.description} isLoading={movieLoading} />
          <MovieRatings rating={movie?.rating} isLoading={movieLoading} />
          <MovieImages images={movieImages} isLoading={movieImagesLoading} />
        </div>
      </div>
      <div>
        {seasons.length ? <MovieSeasons seasons={seasons} isLoading={seasonsLoading} /> : null}
        <MovieActors {...actorsProps} />
        <MovieComments {...commentsProps} />
      </div>
    </section>
  );
};

export default MoviePage;
