type MovieTitleProps = {
  title: string | undefined;
};

const MovieTitle = ({ title }: MovieTitleProps) => {
  return (
    <>
      {title ? (
        <h1 className="text-4xl pt-10 text-center text-white font-extrabold">
          {title}
        </h1>
      ) : (
        <h1 className="text-4xl pt-10 text-center text-white font-extrabold italic">
          Без названия
        </h1>
      )}
    </>
  );
};

export default MovieTitle;
