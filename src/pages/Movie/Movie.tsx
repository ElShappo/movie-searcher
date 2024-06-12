import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Button, notification } from "antd";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  MovieActorsByIdException,
  MovieByIdException,
  MovieCommentsByIdException,
  MovieImagesByIdException,
  MovieSeasonsByIdException,
} from "../../exceptions";

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

  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchMovie() {
      if (id) {
        setMovieLoading(true);

        try {
          const movie = await api.getMovieById(id);
          setMovie(movie);
        } catch (error) {
          notificationApi.error({
            message: "Произошла ошибка",
            description: (error as MovieByIdException).message,
            duration: 3,
          });
        }

        setMovieLoading(false);
      }
    }
    fetchMovie();
  }, [id, notificationApi]);

  useEffect(() => {
    async function fetchImages() {
      if (id) {
        setMovieImagesLoading(true);

        try {
          const rawImages = await api.getMovieImagesById(id);
          const images = rawImages.docs.map((item) => item.url);
          setMovieImages(images);
        } catch (error) {
          notificationApi.error({
            message: "Произошла ошибка",
            description: (error as MovieImagesByIdException).message,
            duration: 3,
          });
        }

        setMovieImagesLoading(false);
      }
    }
    fetchImages();
  }, [id, notificationApi]);

  useEffect(() => {
    async function fetchSeasons() {
      if (id) {
        setSeasonsLoading(true);

        try {
          const rawSeasons = await api.getMovieSeasonsById(id);
          const seasons = rawSeasons.docs;
          setSeasons(seasons);
        } catch (error) {
          notificationApi.error({
            message: "Произошла ошибка",
            description: (error as MovieSeasonsByIdException).message,
            duration: 3,
          });
        }

        setSeasonsLoading(false);
      }
    }
    fetchSeasons();
  }, [id, notificationApi]);

  useEffect(() => {
    async function fetchActors() {
      if (id) {
        setActorsLoading(true);

        try {
          const rawActors = await api.getMovieActorsById(id, actorsPageNo, actorsPageSize);
          const actors = rawActors.docs;
          setActors(actors);
          setActorsPagesCount(rawActors.pages);
        } catch (error) {
          notificationApi.error({
            message: "Произошла ошибка",
            description: (error as MovieActorsByIdException).message,
            duration: 3,
          });
        }

        setActorsLoading(false);
      }
    }
    fetchActors();
  }, [actorsPageNo, actorsPageSize, id, notificationApi]);

  useEffect(() => {
    async function fetchComments() {
      if (id) {
        setCommentsLoading(true);

        try {
          const rawComments = await api.getMovieCommentsById(id, commentsPageNo, commentsPageSize);
          const comments = rawComments.docs;
          setComments(comments);
          setCommentsPagesCount(rawComments.pages);
        } catch (error) {
          notificationApi.error({
            message: "Произошла ошибка",
            description: (error as MovieCommentsByIdException).message,
            duration: 3,
          });
        }

        setCommentsLoading(false);
      }
    }
    fetchComments();
  }, [commentsPageNo, commentsPageSize, id, notificationApi]);

  return (
    <main>
      {contextHolder}
      <div
        className="bg-cover min-h-[700px] shadow-inner brightness-90"
        style={{
          backgroundImage: `url(${movie?.backdrop?.url})`,
          boxShadow: "inset 0 0 200px 200px rgba(0,0,0,0.9)",
        }}
      >
        <div className="px-6 pt-6">
          <Button type="text" className="flex items-center" onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon fontSize="large" />
          </Button>
        </div>
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
    </main>
  );
};

export default MoviePage;
