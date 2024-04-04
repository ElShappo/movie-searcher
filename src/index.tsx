import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movie from "./pages/Movie/Movie";
import Movies from "./pages/Movies/Movies";
import RandomMovie from "./pages/RandomMovie/RandomMovie";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/random" element={<RandomMovie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
