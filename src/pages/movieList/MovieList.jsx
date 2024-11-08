import "./movieList.css";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { deleteMovie, getMovies } from "../../context/movieContext/apiCalls";
import Spinner from "../../components/spinner/Spinner";
import storage from "../../firebase";
import { deleteObject, ref } from "firebase/storage";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
export default function MovieList() {

  const { movies, dispatch } = useContext(MovieContext)

  useEffect(() => {
    getMovies(dispatch)
  }, [dispatch])

  const deleteFirebaseFiles = async (movie) => {
    try {
      const promises = [];
      const storageRefs = [
        movie.img,
        movie.imgTitle,
        movie.imgsm,
      ]; // Assuming these are the Firebase file URLs

      storageRefs.forEach((fileUrl) => {
        if (fileUrl) {
          const fileRef = ref(storage, fileUrl);
          promises.push(deleteObject(fileRef));
        }
      });

      await Promise.all(promises); // Wait for all deletions to complete
      console.log("All files deleted from Firebase.");
      toast.success("Movie and associated files deleted successfully!");
    } catch (error) {
      console.error("Error deleting files from Firebase:", error);
      toast.error("Failed to delete associated files from Firebase.");
    }
  };

  const handleDelete = async (movie) => {
    await deleteFirebaseFiles(movie);
    deleteMovie(movie._id, dispatch)
  };

  console.log(movies)

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "movie",
      headerName: "Movie",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    {
      field: "genre",
      headerName: "Genre",
      width: 120,
    },
    {
      field: "year",
      headerName: "Year",
      width: 120,
    },
    {
      field: "limit",
      headerName: "Limit",
      width: 120,
    },
    {
      field: "isSeries",
      headerName: "isSeries",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/movie/" + params.row._id} state={{ movie: params.row }}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      <div className="productTitleContainer">
        <h1 className="productTitle">Movie</h1>
        <Link to="/newMovie">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      {movies?.length > 0 ? (
        <DataGrid
          rows={movies}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          checkboxSelection
          getRowId={(r) => r._id}
        />
      ) : (
        <Spinner />
      )}
      <ToastContainer />
    </div>
  );
}