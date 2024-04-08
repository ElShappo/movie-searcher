type MovieDescriptionProps = {
  description: string | undefined;
};

const MovieDescription = ({ description }: MovieDescriptionProps) => {
  return (
    <article className="w-1/2 max-xl:w-full rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
      <h2>Описание</h2>
      {description ? (
        <p className="pt-2">{description}</p>
      ) : (
        <p className="pt-2 italic">Описание фильма отсутствует</p>
      )}
    </article>
  );
};

export default MovieDescription;
