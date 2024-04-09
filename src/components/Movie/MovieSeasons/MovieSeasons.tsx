import { Button, Card } from "antd";
import { MovieSeason } from "../../../types";
import Meta from "antd/es/card/Meta";
import NoResults from "../../NoResults/NoResults";
import { useMemo, useState } from "react";
import { prettifyDate } from "../../../utils";

type MovieSeasonsProps = {
  seasons: MovieSeason[];
  isLoading: boolean;
};

const MovieSeasons = ({ seasons, isLoading }: MovieSeasonsProps) => {
  const [seasonNo, setSeasonNo] = useState(1);

  const season = useMemo(() => {
    return seasons.find((season) => season.number === seasonNo);
  }, [seasonNo, seasons]);

  return (
    <article className="overflow-auto rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
      <h2>Сезоны и серии:</h2>
      {isLoading ? (
        <div>Загружаю список сезонов...</div>
      ) : !isLoading && !seasons.length ? (
        <NoResults text="Список сезонов отсутствует" />
      ) : (
        <div className="pt-4">
          <section className="w-full flex flex-wrap gap-4">
            {seasons.map((season, index) => {
              return (
                <Button
                  key={season.number}
                  type={index + 1 === seasonNo ? "primary" : "default"}
                  shape="circle"
                  onClick={() => setSeasonNo(index + 1)}
                >
                  {index + 1}
                </Button>
              );
            })}
          </section>

          <section className="w-full flex gap-5 overflow-auto py-4">
            {season?.episodes.map((episode) => (
              <Card
                key={episode.number}
                className="min-w-[400px] max-lg:min-w-[360px] max-sm:min-w-[300px]"
                cover={<img src={episode.still?.url || "/fallback.png"} alt="example" />}
              >
                <Meta
                  title={
                    <section>
                      <h2 className="text-sm text-right text-gray-600 italic">
                        {prettifyDate(episode.airDate, false)}
                      </h2>
                      <h3>{episode.name}</h3>
                      <h3 className="text-sm text-gray-600 italic pt-2">Эпизод {episode.number}</h3>
                    </section>
                  }
                  description={
                    <section>
                      <div>Описание: {episode.description || "отсутствует"}</div>
                    </section>
                  }
                />
              </Card>
            ))}
          </section>
        </div>
      )}
    </article>
  );
};

export default MovieSeasons;
