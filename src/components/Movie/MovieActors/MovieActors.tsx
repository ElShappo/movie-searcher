import { Card, Pagination, PaginationProps } from "antd";
import { MovieActor } from "../../../types";
import Meta from "antd/es/card/Meta";
import NoResults from "../../NoResults/NoResults";
import { loadingMessage, pageSizeOptions } from "../../../constants";

type MovieCommentsProps = {
  actors: MovieActor[];

  pageNo: number;
  pageSize: number;
  pagesCount: number;

  isLoading: boolean;

  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

const MovieActors = ({
  actors,
  pageNo,
  pageSize,
  pagesCount,
  isLoading,
  setPageNo,
  setPageSize,
}: MovieCommentsProps) => {
  const onPaginationChange: PaginationProps["onChange"] = (pageNo, pageSize) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
    console.log(pageNo, pageSize);
  };

  return (
    <article className="overflow-auto rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
      <h2>Актёры</h2>
      <div className="flex overflow-auto gap-4 py-4">
        {isLoading ? (
          new Array(pageSize).fill(1).map((val, index) => (
            <Card key={index} loading={true} className="min-w-[190px] max-lg:min-w-[170px] max-sm:min-w-[160px]">
              <Meta title={loadingMessage} description={"Загружаю данные об актёрах..."} />
            </Card>
          ))
        ) : !actors.length ? (
          <NoResults text="Нет данных об актёрах" />
        ) : (
          actors.map((actor) => (
            <Card
              key={actor.id}
              className="min-w-[190px] max-lg:min-w-[170px] max-sm:min-w-[160px]"
              cover={<img alt="example" src={actor.photo || "/fallback.png"} className="max-h-[350px]" />}
            >
              <Meta
                title={actor.name}
                description={
                  <section>
                    {actor.age ? <div>Возраст: {actor.age}</div> : null}
                    {actor.sex ? <div>Пол: {actor.sex}</div> : null}
                  </section>
                }
              />
            </Card>
          ))
        )}
      </div>
      <footer className="flex justify-center pt-4">
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={pageNo}
          onChange={onPaginationChange}
          total={pagesCount * 10}
          pageSizeOptions={pageSizeOptions}
        />
      </footer>
    </article>
  );
};

export default MovieActors;
