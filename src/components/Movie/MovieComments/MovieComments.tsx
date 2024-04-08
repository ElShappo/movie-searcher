import { Avatar, Card, Pagination, PaginationProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { MovieComment } from "../../../types";
import Meta from "antd/es/card/Meta";
import NoResults from "../../NoResults/NoResults";
import { pageSizeOptions } from "../../../constants";
import MoodIcon from "@mui/icons-material/Mood";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";

type MovieCommentsProps = {
  comments: MovieComment[];

  pageNo: number;
  pageSize: number;
  pagesCount: number;

  isLoading: boolean;

  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setPagesCount: React.Dispatch<React.SetStateAction<number>>;
};

const MovieComments = ({
  comments,
  pageNo,
  pageSize,
  pagesCount,
  isLoading,
  setPageNo,
  setPageSize,
  setPagesCount,
}: MovieCommentsProps) => {
  const onPaginationChange: PaginationProps["onChange"] = (
    pageNo,
    pageSize
  ) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
    console.log(pageNo, pageSize);
  };

  return (
    <article className="w-1/2 max-xl:w-full max-h-[600px] overflow-auto rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
      <h2>Комментарии</h2>
      <div className="flex flex-col gap-4 justify-center pt-4">
        {isLoading ? (
          new Array(pageSize).fill(1).map((val, index) => (
            <Card key={index} loading={true} style={{ width: 240 }}>
              <Meta title="Loading..." description="Loading..." />
            </Card>
          ))
        ) : !isLoading && !comments.length ? (
          <NoResults />
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <Meta
                title={
                  <section>
                    <div className="flex w-full pb-4">
                      <div className="flex-grow">
                        {comment.type === "Позитивный" ? (
                          <MoodIcon color="success" />
                        ) : comment.type === "Нейтральный" ? (
                          <SentimentNeutralIcon color="info" />
                        ) : (
                          <MoodBadIcon color="error" />
                        )}
                      </div>
                      <h2 className="text-sm text-right text-gray-600 italic">
                        {comment.date}
                      </h2>
                    </div>
                    <h2 className="text-xl flex gap-x-2">
                      <Avatar size={35} icon={<UserOutlined />} />{" "}
                      <span>{comment.author}</span>
                    </h2>
                  </section>
                }
                description={
                  <section>
                    <h3 className="pb-2 text-lg text-gray-500 font-bold">
                      {comment.title}
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: comment.review }}></p>
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

export default MovieComments;
