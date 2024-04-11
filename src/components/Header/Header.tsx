import { Button } from "antd";
import MovieIcon from "@mui/icons-material/Movie";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="flex flex-wrap max-xl:flex-col">
      <div className="flex justify-center p-4 xl:w-2/5">
        <Button
          onClick={() => navigate("/")}
          type="text"
          className="flex flex-wrap gap-y-4 justify-center items-center py-2 max-md:px-8 h-auto"
        >
          <img src="/camera.svg" alt="logo" height={40} width={40} className="max-md:h-12 max-md:w-12" />
          <span className="pl-6 text-4xl max-md:text-3xl font-semibold text-kinopoisk">MovieSearcher</span>
        </Button>
      </div>
      <nav className="flex-auto gap-x-4 max-md:gap-x-0 flex flex-wrap justify-center items-center">
        <Button
          onClick={() => navigate(`/`)}
          type="text"
          className="flex items-center h-auto text-2xl max-md:text-xl text-kinopoisk"
          icon={<MovieIcon fontSize="large" />}
        >
          Movies
        </Button>
        <Button
          onClick={() => navigate(`/random`)}
          type="text"
          className="flex items-center h-auto text-2xl max-md:text-xl text-kinopoisk"
          icon={<ShuffleIcon fontSize="large" />}
        >
          Random movie
        </Button>
        <Button
          onClick={() => navigate(`/faq`)}
          type="text"
          className="flex items-center h-auto text-2xl max-md:text-xl text-kinopoisk"
          icon={<HelpIcon fontSize="large" />}
        >
          FAQ
        </Button>
        <Button
          target="_blank"
          href="https://github.com/ElShappo"
          type="text"
          className="flex items-center h-auto text-2xl max-md:text-xl text-kinopoisk no-underline"
          icon={<GitHubIcon fontSize="large" />}
        >
          GitHub
        </Button>
      </nav>
    </header>
  );
};

export default Header;
