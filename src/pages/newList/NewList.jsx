import { useEffect, useState } from "react";
import "./newList.css";
import storage from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createMovie, getMovies } from "../../context/movieContext/apiCalls";
import { useContext } from "react";
import { ListContext } from "../../context/listContext/ListContext";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { createList } from "../../context/listContext/apiCalls";
import { useNavigate } from "react-router-dom";
import { fetchGenres } from "../../api/fetchGenres";

export default function NewList() {

  const navigate = useNavigate()
  const { dispatch } = useContext(ListContext)
  const { movies, dispatch: dispatchMovie } = useContext(MovieContext)

  useEffect(() => {
    getMovies(dispatchMovie)
  }, [dispatchMovie])

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres)
    };
    loadGenres();
}, []);
  const [list, setList] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedContents, setSelectedContents] = useState([]);

  const handleChangeGenre = (event) => {
    const options = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedGenres(options);
    setList((prevList) => ({ ...prevList, genre: options }));

  };

  const handleChangeContent = (event) => {
    const options = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedContents(options);
    setList((prevList) => ({ ...prevList, content: options }));

  };

  const handleChange = (e) => {
    const value = e.target.value
    setList({ ...list, [e.target.name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createList(list, dispatch,navigate)
  }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New List</h1>
      <form className="addProductForm">
        <div className="formLeft">

          <div className="addProductItem">
            <label>Title</label>
            <input type="text" placeholder="Comedy Movies" name="title" onChange={handleChange} />
          </div>
          <div className="addProductItem">
            <label>Type</label>
            <select name="type" id="type" onChange={handleChange}>
              <option value="">Type</option>
              <option value="series">Series</option>
              <option value="movie">Movie</option>
            </select>
          </div>

          <div className="addProductItem">
            <label>Genre</label>
            <select
              multiple
              value={selectedGenres}
              name="genre"
              id="genre"
              onChange={handleChangeGenre}
            >
              {genres.map((genre) => (
                <option key={genre.value} value={genre.value}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="formRight">

          <div className="addProductItem">
            <label>Content</label>
            <select
              multiple
              value={selectedContents}
              name="content"
              id="content"
              onChange={handleChangeContent}
              style={{ height: '300px' }}
            >
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}

            </select>
          </div>
        </div>
        <button className="addProductButton" onClick={handleSubmit}>Create</button>
      </form >
    </div >
  );
}