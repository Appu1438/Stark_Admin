import { Link, useLocation, useNavigate } from "react-router-dom";
import "./movie.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Publish } from '@mui/icons-material';
import { useContext, useEffect, useState } from "react";
import storage from "../../firebase";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { updateMovie } from "../../context/movieContext/apiCalls";
import { fetchGenres } from "../../api/fetchGenres";
import axiosInstance from "../../api/axiosInstance";
import { STREAM_URL } from "../../api";
export default function Movie() {

    const { dispatch } = useContext(MovieContext)
    const navigate = useNavigate()
    const location = useLocation()
    const movie = location.state.movie

    const [genres, setGenres] = useState([]);

    const [movieData, setMovieData] = useState(movie)
    const [img, setImg] = useState(null)
    const [imgTitle, setImgTitle] = useState(null)
    const [imgSm, setImgSm] = useState(null)
    const [trailer, setTrailer] = useState(null)
    const [video, setVideo] = useState(null)

    const [trailerSubtitle, setTrailerSubtitle] = useState(null)
    const [videoSubtitle, setVideoSubtitle] = useState(null)
    const [trailerSubtitleContent, setTrailerSubtitleContent] = useState(null)
    const [videoSubtitleContent, setVideoSubtitleContent] = useState(null)

    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const loadGenres = async () => {
            const fetchedGenres = await fetchGenres();
            setGenres(fetchedGenres)
        };
        loadGenres();
    }, []);

    const handleChangeGenre = (event) => {
        const options = Array.from(event.target.selectedOptions, (option) => option.value);
        setMovieData((prevMovie) => ({ ...prevMovie, genre: options }));

    };

    const handleChange = (e) => {
        const value = e.target.value
        setMovieData({ ...movieData, [e.target.name]: value })

    }

    const handleImageSelect = (e, setState) => {
        const image = e.target.files[0];
        if (!image) return;

        const filename = new Date().getTime() + image.name;
        const storageRef = ref(storage, `items/${filename}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [e.target.name]: progress,
                }));
                console.log(progress);

            },
            (error) => {
                console.error('Upload failed:', error);
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [e.target.name]: null,
                }));
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setMovieData((prev) => ({ ...prev, [e.target.name]: downloadURL }));
                    setState(downloadURL);
                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        [e.target.name]: null,
                    }));
                });
            }
        );
    };

    // Handle the video file input and upload
    const handleVideoUpload = (e, setVideoState) => {
        const file = e.target.files[0]; // Get the selected file

        if (file) {
            uploadVideo(e, setVideoState); // Pass the file to the upload function
        }
    };
    // Frontend: Upload Video to Node.js Backend
    const uploadVideo = async (e, setVideoState) => {
        const formData = new FormData();
        formData.append('video', e.target.files[0]);

        try {
            const response = await axiosInstance.post('movies/upload-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    // Calculate the percentage of the upload
                    const total = progressEvent.total;
                    const current = progressEvent.loaded;
                    const percentage = Math.round((current * 100) / total);

                    // Update the progress state
                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        [e.target.name]: percentage,
                    }));
                },
            });

            // Assuming the response contains the video URL in response.data.videoUrl
            const videoUrl = response.data.videoUrl;
            console.log(response.data)

            // Update the movie state to include the new video URL
            setMovieData((prevMovie) => ({
                ...prevMovie,
                [e.target.name]: videoUrl,  // Update the videoUrl field in the movie object
            }));

            setVideoState(videoUrl)

            setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [e.target.name]: null,
            }));
            
            console.log('Video uploaded successfully:', videoUrl);
        } catch (error) {
            setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [e.target.name]: null,
            }));
            console.error('Error uploading video:', error);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault()
        updateMovie(movieData, dispatch, navigate)

    }

    useEffect(() => {
        const fetchSubtitle = async () => {
            if (movie.trailerSubtitle) {
                try {
                    const response = await fetch(movie.trailerSubtitle);
                    const subtitleText = await response.text();  // Convert to text
                    const linesToShow = 3; // Number of lines to show at the start and end

                    // Split the subtitle content by line breaks
                    const subtitleLines = subtitleText.split('\n');

                    // Get the first few lines and the last few lines
                    const firstLines = subtitleLines.slice(0, linesToShow).join('\n');
                    const lastLines = subtitleLines.slice(-linesToShow).join('\n');

                    // Combine the first and last parts with a separator (optional)
                    const displayedSubtitle = `${firstLines}\n...\n${lastLines}`;
                    setTrailerSubtitleContent(displayedSubtitle);
                } catch (error) {
                    console.error('Error fetching subtitle:', error);
                }
            }
        };

        fetchSubtitle();
    }, [trailerSubtitle, movieData.trailerSubtitle]);

    useEffect(() => {
        const fetchSubtitle = async () => {
            if (movie.videoSubtitle) {
                try {
                    const response = await fetch(movie.videoSubtitle);
                    const subtitleText = await response.text();  // Convert to text
                    const linesToShow = 3; // Number of lines to show at the start and end

                    // Split the subtitle content by line breaks
                    const subtitleLines = subtitleText.split('\n');

                    // Get the first few lines and the last few lines
                    const firstLines = subtitleLines.slice(0, linesToShow).join('\n');
                    const lastLines = subtitleLines.slice(-linesToShow).join('\n');

                    // Combine the first and last parts with a separator (optional)
                    const displayedSubtitle = `${firstLines}\n...\n${lastLines}`;
                    setVideoSubtitleContent(displayedSubtitle);
                } catch (error) {
                    console.error('Error fetching subtitle:', error);
                }
            }
        };

        fetchSubtitle();
    }, [videoSubtitle, movieData.videoSubtitle]);

    console.log(movieData)
    return (
        <div className="product">
            <div className="productTitleContainer">
                <h1 className="productTitle">Movie</h1>
                <Link to="/newMovie">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>
            <div className="productTop">
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <img src={movie.img} alt="" className="productInfoImg" />
                        <span className="productName">{movieData.title}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">id:</span>
                            <span className="productInfoValue"> {movieData._id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Genre:</span>
                            <span className="productInfoValue">{movieData.genre[0]}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Year:</span>
                            <span className="productInfoValue">{movieData.year}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Limit:</span>
                            <span className="productInfoValue">{movieData.limit}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm">
                    <div className="productFormLeft">
                        <label>Movie Name</label>
                        <input type="text" placeholder={movieData.title} name="title" value={movieData.title} onChange={handleChange} />
                        <label>Year</label>
                        <input type="text" placeholder={movieData.year} name="year" value={movieData.year} onChange={handleChange} />
                        <label>Genre</label>
                        <select
                            multiple
                            value={movieData.genre}
                            name="genre"
                            id="genre"
                            style={{ height: '200px', width: '200px' }}
                            onChange={handleChangeGenre}
                        >
                            {genres.map((genre) => (
                                <option key={genre.value} value={genre.value}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                        <label>Limit</label>
                        <input type="text" placeholder={movieData.limit} name="limit" value={movieData.limit} onChange={handleChange} />
                        <label>Duration</label>
                        <input type="text" placeholder={movieData.duration} name="duration" value={movieData.duration} onChange={handleChange} />
                        <label>Description</label>
                        <input type="text" placeholder={movieData.desc} name="desc" value={movieData.desc} onChange={handleChange} />
                        <label>Is Series?</label>
                        <select name="isSeries" id="isSeries" value={movieData.isSeries} onChange={handleChange}>
                            <option value="">isSeries</option>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                        <label>Trailer</label>
                        <div className="productUpload">
                            <video src={`${STREAM_URL}?filename=${movieData.trailer}`} key={trailer} controls alt="" className="productUploadImg" style={{ width: '250px', height: '200px' }} />
                            <label for="trailer">
                                <Publish />
                            </label>
                            <input type="file" id="trailer" name="trailer" style={{ display: "none" }} onChange={e => handleVideoUpload(e, setTrailer)} />
                        </div>
                        {uploadProgress.trailer &&
                            <div className="progressBarContainer">
                                <progress value={uploadProgress.trailer} max="100"></progress>
                                <span>{Math.round(uploadProgress.trailer)}%</span>
                            </div>
                        }
                        <label>Video</label>
                        <div className="productUpload">
                            <video src={`${STREAM_URL}?filename=${movieData.video}`} key={video} controls alt="" className="productUploadImg" style={{ width: '250px', height: '200px' }} />
                            <label for="video">
                                <Publish />
                            </label>
                            <input type="file" id="video" name="video" style={{ display: "none" }} onChange={e => handleVideoUpload(e, setVideo)} />
                        </div>
                        {uploadProgress.video &&
                            <div className="progressBarContainer">
                                <progress value={uploadProgress.video} max="100"></progress>
                                <span>{Math.round(uploadProgress.video)}%</span>
                            </div>
                        }

                        <label>Trailer Subtitle</label>
                        <div className="productUpload">
                            <label for="trailerSubtitle">
                                <Publish />
                            </label>
                            <input type="file" id="trailerSubtitle" name="trailerSubtitle" style={{ display: "none" }} onChange={e => handleImageSelect(e, setTrailerSubtitle)} />
                            {movieData.trailerSubtitle ? (
                                <div>
                                    <p>Trailer Subtitle Already Uploaded</p>
                                    <pre style={{ whiteSpace: 'pre-wrap' }}>{trailerSubtitleContent}</pre> {/* Display VTT content */}
                                </div>
                            ) : (
                                <p> Trailer Subtitle Not Uploaded</p>

                            )}
                        </div>
                        {uploadProgress.trailerSubtitle &&
                            <div className="progressBarContainer">
                                <progress value={uploadProgress.trailerSubtitle} max="100"></progress>
                                <span>{Math.round(uploadProgress.trailerSubtitle)}%</span>
                            </div>
                        }

                        <label>Video Subtitle</label>
                        <div className="productUpload">
                            <label for="videoSubtitle">
                                <Publish />
                            </label>
                            <input type="file" id="videoSubtitle" name="videoSubtitle" style={{ display: "none" }} onChange={e => handleImageSelect(e, setVideoSubtitle)} />
                            {movieData.videoSubtitle ? (
                                <div>
                                    <p>Movie Subtitle Already Uploaded</p>
                                    <pre style={{ whiteSpace: 'pre-wrap' }}>{videoSubtitleContent}</pre> {/* Display VTT content */}
                                </div>
                            ) : (
                                <p>Movie Subtitle Not Uploaded</p>

                            )}
                        </div>
                        {uploadProgress.videoSubtitle &&
                            <div className="progressBarContainer">
                                <progress value={uploadProgress.videoSubtitle} max="100"></progress>
                                <span>{Math.round(uploadProgress.videoSubtitle)}%</span>
                            </div>
                        }
                    </div>
                    <div className="productFormRight">
                        <div className="productUpload">
                            <img src={movieData.img} alt="" className="productUploadImg" />
                            <label for="img">
                                <Publish />
                            </label>
                            <input type="file" id="img" name="img" style={{ display: "none" }} onChange={e => handleImageSelect(e, setImg)} />
                        </div>
                        {uploadProgress.img &&
                            <div className="progressBarContainer">
                                <progress value={uploadProgress.img} max="100"></progress>
                                <span>{Math.round(uploadProgress.img)}%</span>
                            </div>
                        }
                        <div className="productUpload">
                            <img src={movieData.imgTitle} alt="" className="productUploadImg" />
                            <label for="imgTitle">
                                <Publish />
                            </label>
                            <input type="file" id="imgTitle" name="imgTitle" style={{ display: "none" }} onChange={e => handleImageSelect(e, setImgTitle)} />
                        </div>
                        {uploadProgress.imgTitle &&
                            <div className="progressBarContainer">
                                <progress value={uploadProgress.imgTitle} max="100"></progress>
                                <span>{Math.round(uploadProgress.imgTitle)}%</span>
                            </div>
                        }
                        <div className="productUpload">
                            <img src={movieData.imgsm} alt="" className="productUploadImg" />
                            <label for="imgsm">
                                <Publish />
                            </label>
                            <input type="file" id="imgsm" name="imgsm" style={{ display: "none" }} onChange={e => handleImageSelect(e, setImgSm)} />
                        </div>
                        {uploadProgress.imgsm &&
                            <div className="progressBarContainer">
                                <progress value={uploadProgress.imgsm} max="100"></progress>
                                <span>{Math.round(uploadProgress.imgsm)}%</span>
                            </div>
                        }
                        <button className="productButton" onClick={handleSubmit}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}