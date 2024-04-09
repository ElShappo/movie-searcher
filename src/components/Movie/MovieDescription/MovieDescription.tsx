import NoResults from "../../NoResults/NoResults";

type MovieDescriptionProps = {
  description: string | undefined;
  isLoading: boolean;
};

const MovieDescription = ({ description, isLoading }: MovieDescriptionProps) => {
  return (
    <article className="w-1/2 max-xl:w-full rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
      <h2>Описание</h2>
      {isLoading ? (
        <div>Загружаю описание...</div>
      ) : !description ? (
        <NoResults text="Описание фильма отсутствует" />
      ) : (
        <p className="pt-2" dangerouslySetInnerHTML={{ __html: description }}></p>
      )}
    </article>
  );
};

export default MovieDescription;
