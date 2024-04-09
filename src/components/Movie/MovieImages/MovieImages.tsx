import { Carousel, Image } from "antd";
import NoResults from "../../NoResults/NoResults";

type MovieImagesProps = {
  images: string[];
  isLoading: boolean;
};

const MovieImages = ({ images, isLoading }: MovieImagesProps) => {
  return (
    <article className="w-2/5 max-xl:w-full rounded-2xl p-4 px-8 bg-gray-800 bg-opacity-60 text-white">
      <h2>Кадры</h2>
      {isLoading ? (
        <div>Загружаю снимки...</div>
      ) : !images.length ? (
        <NoResults text="Не нашлось ни одного снимка" />
      ) : (
        <Image.PreviewGroup>
          <Carousel
            autoplay
            autoplaySpeed={4000}
            infinite={false}
            className="pt-4 pb-2"
            dots={{ className: "text-white" }}
          >
            {images.map((image) => (
              <div className="!flex !justify-center" key={image}>
                <Image src={image} alt="image" fallback="/fallback.png" className="max-h-[400px]" />
              </div>
            ))}
          </Carousel>
        </Image.PreviewGroup>
      )}
    </article>
  );
};

export default MovieImages;
