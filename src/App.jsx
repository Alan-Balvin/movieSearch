
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css"

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    const apiKey = "d1e81602"; 
    const response = await fetch(
      `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.Search) {
      setResults(data.Search);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-page">
      <h1>Movie Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="results">
        {results.map((movie) => (
          <div key={movie.imdbID} className="result-item">
            <img src={movie.Poster} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <button onClick={() => navigate(`/details/${movie.imdbID}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const DetailsPage = ({ imdbID }) => {
  const [details, setDetails] = useState(null);

  React.useEffect(() => {
    const fetchDetails = async () => {
      const apiKey = "d1e81602";
      const response = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
      );
      const data = await response.json();
      setDetails(data);
    };

    fetchDetails();
  }, [imdbID]);

  if (!details) return <p>Loading...</p>;

  return (
    <div className="details-page">
      <h1>{details.Title}</h1>
      <img src={details.Poster} alt={details.Title} />
      <p>
        <strong>Year:</strong> {details.Year}
      </p>
      <p>
        <strong>Genre:</strong> {details.Genre}
      </p>
      <p>
        <strong>Director:</strong> {details.Director}
      </p>
      <p>
        <strong>Plot:</strong> {details.Plot}
      </p>
      <Link to="/">Back to Search</Link>
    </div>
  );
};

DetailsPage.propTypes = {
  imdbID: PropTypes.string.isRequired,
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/details/:imdbID" element={<DetailsRoute />} />
      </Routes>
    </Router>
  );
};

const DetailsRoute = () => {
  const { imdbID } = useParams();
  return <DetailsPage imdbID={imdbID} />;
};

export default App;