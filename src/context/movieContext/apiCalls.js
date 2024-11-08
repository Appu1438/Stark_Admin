import axiosInstance from "../../api/axiosInstance";
import { createMovieFailure, createMovieStart, createMovieSuccess, deleteMovieFailure, deleteMovieStart, deleteMovieSuccess, getMoviesFailure, getMoviesStart, getMoviesSuccess, updateMovieFailure, updateMovieStart, updateMovieSuccess } from "./MovieAction";

export const getMovies = async (dispatch) => {
    dispatch(getMoviesStart());
    try {
        const res = await axiosInstance.get(`movies/`);
        dispatch(getMoviesSuccess(res.data));
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        dispatch(getMoviesFailure());
    }
};

export const createMovie = async (movie, dispatch,navigate) => {
    dispatch(createMovieStart());
    try {
        const res = await axiosInstance.post(`movies/`, movie);
        dispatch(createMovieSuccess(res.data));
        navigate('/movies')
    } catch (error) {
        console.error("Failed to create movies:", error);
        dispatch(createMovieFailure());
    }
};

export const updateMovie = async (movie, dispatch, navigate) => {
    dispatch(updateMovieStart());
    try {
        const res = await axiosInstance.put(`movies/${movie._id}`, movie);
        dispatch(updateMovieSuccess(res.data));
        navigate('/movies')
    } catch (error) {
        console.error("Failed to update movie:", error);
        dispatch(updateMovieFailure());
    }
};

export const deleteMovie = async (id, dispatch) => {
    dispatch(deleteMovieStart());
    try {
        await axiosInstance.delete(`movies/${id}`);
        dispatch(deleteMovieSuccess(id));
    } catch (error) {
        console.error("Failed to delete movies:", error);
        dispatch(deleteMovieFailure());
    }
};
