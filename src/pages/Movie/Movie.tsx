import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie, MovieActor, MovieComment } from "../../types";
import { api, prependZeroToDate } from "../../utils";

import MovieDescription from "../../components/Movie/MovieDescription/MovieDescription";
import MovieRatings from "../../components/Movie/MovieRatings/MovieRatings";
import MovieImages from "../../components/Movie/MovieImages/MovieImages";

import "./Movie.css";
import MovieTitle from "../../components/Movie/MovieTitle/MovieTitle";
import { defaultPagesCount, pageSizeOptions } from "../../constants";
import MovieComments from "../../components/Movie/MovieComments/MovieComments";
import MovieActors from "../../components/Movie/MovieActors/MovieActors";

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie>();
  const [movieImages, setMovieImages] = useState<string[]>([]);

  const [comments, setComments] = useState<MovieComment[]>([]);
  const [commentsPageNo, setCommentsPageNo] = useState<number>(1);
  const [commentsPageSize, setCommentsPageSize] = useState<number>(
    pageSizeOptions[0]
  );
  const [commentsPagesCount, setCommentsPagesCount] =
    useState<number>(defaultPagesCount);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [actors, setActors] = useState<MovieActor[]>([]);
  const [actorsPageNo, setActorsPageNo] = useState<number>(1);
  const [actorsPageSize, setActorsPageSize] = useState<number>(
    pageSizeOptions[0]
  );
  const [actorsPagesCount, setActorsPagesCount] =
    useState<number>(defaultPagesCount);
  const [actorsLoading, setActorsLoading] = useState(false);

  const commentsWithPrettyDate = useMemo(() => {
    return comments.map((comment) => {
      const copy = { ...comment };
      const date = new Date(copy.date);
      copy.date = `${date.getFullYear()}-${prependZeroToDate(
        date.getMonth() + 1
      )}-${prependZeroToDate(
        date.getDate()
      )} в ${date.getHours()}:${prependZeroToDate(date.getMinutes())}`;
      return copy;
    });
  }, [comments]);

  const commentsProps = useMemo(() => {
    return {
      comments: commentsWithPrettyDate,

      pageNo: commentsPageNo,
      pageSize: commentsPageSize,
      pagesCount: commentsPagesCount,

      isLoading: commentsLoading,

      setPageNo: setCommentsPageNo,
      setPageSize: setCommentsPageSize,
    };
  }, [
    commentsWithPrettyDate,
    commentsLoading,
    commentsPageNo,
    commentsPageSize,
    commentsPagesCount,
  ]);

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
    async function fetchMovie() {
      if (id) {
        setCommentsLoading(true);
        setActorsLoading(true);

        const movie = await api.getMovieById(id);
        setMovie(movie);

        const rawImages = await api.getMovieImagesById(id);
        const images = rawImages?.docs.map((item) => item.url);
        if (images) {
          setMovieImages(images);
        }

        const rawComments = await api.getMovieCommentsById(
          id,
          commentsPageNo,
          commentsPageSize
        );
        const comments = rawComments?.docs;
        if (comments) {
          setComments(comments);
        }

        const rawActors = await api.getMovieActorsById(
          id,
          actorsPageNo,
          actorsPageSize
        );
        const actors = rawActors?.docs;
        if (actors) {
          setActors(actors);
        }

        setCommentsLoading(false);
        setActorsLoading(false);
      }
    }
    fetchMovie();
  }, [actorsPageNo, actorsPageSize, commentsPageNo, commentsPageSize, id]);

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
        <MovieActors {...actorsProps} />
        <MovieComments {...commentsProps} />
      </div>
    </section>
  );
};

export default MoviePage;
