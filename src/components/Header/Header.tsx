import { Button, Divider } from "antd";
import MovieIcon from "@mui/icons-material/Movie";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="flex">
      <div className="grow-0 flex items-center p-8 px-32">
        <img src="camera.svg" alt="logo" height={72} width={72} />
        <span className="pl-8 text-6xl font-semibold text-kinopoisk">MovieSearcher</span>
      </div>
      <Divider type="vertical" className="h-auto m-0" />
      <nav className="flex-grow gap-x-4 flex justify-end items-center p-8">
        <Button
          onClick={() => navigate(`/movies`)}
          type="text"
          className="flex items-center h-auto text-3xl text-kinopoisk"
          icon={<MovieIcon fontSize="large" />}
        >
          Movies
        </Button>
        <Button
          onClick={() => navigate(`/random`)}
          type="text"
          className="flex items-center h-auto text-3xl text-kinopoisk"
          icon={<ShuffleIcon fontSize="large" />}
        >
          Random movie
        </Button>
        <Button
          target="_blank"
          href="https://github.com/ElShappo"
          type="text"
          className="flex items-center h-auto text-3xl text-kinopoisk no-underline"
          icon={<GitHubIcon fontSize="large" />}
        >
          GitHub
        </Button>
      </nav>
    </header>
  );
};

export default Header;
