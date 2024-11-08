import { useEffect, useState } from "react";
import "./newMovie.css";
import storage from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGenres } from "../../api/fetchGenres";
import axiosInstance from "../../api/axiosInstance";
import { STREAM_URL } from "../../api";

export default function NewMovie() {
  const { dispatch } = useContext(MovieContext)
  const navigate = useNavigate()

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres)
    };
    loadGenres();
  }, []);

  const [movie, setMovie] = useState(null)
  const [img, setImg] = useState(null)
  const [imgTitle, setImgTitle] = useState(null)
  const [imgSm, setImgSm] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [video, setVideo] = useState(null)

  const [trailerSubtitle, setTrailerSubtitle] = useState(null)
  const [videoSubtitle, setVideoSubtitle] = useState(null)
  const [trailerSubtitleContent, setTrailerSubtitleContent] = useState(null)
  const [videoSubtitleContent, setVideoSubtitleContent] = useState(null)

  const [uploadProgress, setUploadProgress] = useState(0); // New state for tracking upload progress

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChangeGenre = (event) => {
    const options = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
    setMovie((prevMovie) => ({ ...prevMovie, genre: options }));

  };

  const handleChange = (e) => {
    const value = e.target.value
    setMovie({ ...movie, [e.target.name]: value })

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
          setMovie((prev) => ({ ...prev, [e.target.name]: downloadURL }));
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

      // Update the movie state to include the new video URL
      setMovie((prevMovie) => ({
        ...prevMovie,
        [e.target.name]: videoUrl,  // Update the videoUrl field in the movie object
      }));
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [e.target.name]: null,
      }));
      setVideoState(videoUrl)


      console.log('Video uploaded successfully:', videoUrl);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };




  console.log(movie)

  const handleSubmit = (e) => {
    e.preventDefault()
    createMovie(movie, dispatch, navigate)

  }

  useEffect(() => {
    const fetchSubtitle = async () => {
      if (trailerSubtitle) {
        try {
          const response = await fetch(trailerSubtitle);
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
  }, [trailerSubtitle]);

  useEffect(() => {
    const fetchSubtitle = async () => {
      if (videoSubtitle) {
        try {
          const response = await fetch(videoSubtitle);
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
  }, [videoSubtitle]);

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm" onSubmit={handleSubmit}>

        <div className="addProductItem">
          <label>Image</label>
          <input type="file" id="img" name="img" onChange={(e) => handleImageSelect(e, setImg)} required />
          {img && <img src={img} alt="Image Preview" className="imagePreview" />}
          {uploadProgress.img &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.img} max="100"></progress>
              <span>{Math.round(uploadProgress.img)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Title Image</label>
          <input type="file" id="imgTitle" name="imgTitle" onChange={(e) => handleImageSelect(e, setImgTitle)} required />
          {imgTitle && <img src={imgTitle} alt="Image Preview" className="imagePreview" />}
          {uploadProgress.imgTitle &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.imgTitle} max="100"></progress>
              <span>{Math.round(uploadProgress.imgTitle)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Thumbnail Image</label>
          <input type="file" id="imgSm" name="imgsm" onChange={(e) => handleImageSelect(e, setImgSm)} required />
          {imgSm && <img src={imgSm} alt="Image Preview" className="imagePreview" />}
          {uploadProgress.imgsm &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.imgsm} max="100"></progress>
              <span>{Math.round(uploadProgress.imgsm)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Title</label>
          <input type="text" placeholder="Cold Case" name="title" onChange={handleChange} required />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input type="text" placeholder="Description" name="desc" onChange={handleChange} required />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input type="text" placeholder="Year" name="year" onChange={handleChange} required />
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input type="text" placeholder="Duration" name="duration" onChange={handleChange} required />
        </div>
        <div className="addProductItem">
          <label>Limit</label>
          <input type="text" placeholder="Limit" name="limit" onChange={handleChange} required />
        </div>

        <div className="addProductItem">
          <label>Genre</label>
          <select
            multiple
            value={selectedOptions}
            name="genre"
            id="genre"
            onChange={handleChangeGenre}
            required
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="addProductItem">
          <label>Is Series?</label>
          <select name="isSeries" id="isSeries" onChange={handleChange} required>
            <option value="">isSeries</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="addProductItem">
          <label>Trailer</label>
          <input type="file" placeholder="" name="trailer" onChange={(e) => handleVideoUpload(e, setTrailer)} />
          {trailer && <video src={`${STREAM_URL}?filename=${movie.trailer}`} key={movie.trailer} autoPlay controls progress alt="Image Preview" className="imagePreview" />}
          {uploadProgress.trailer &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.trailer} max="100"></progress>
              <span>{Math.round(uploadProgress.trailer)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Video</label>
          <input type="file" placeholder="" name="video" onChange={(e) => handleVideoUpload(e, setVideo)} />
          {video && <video src={`${STREAM_URL}?filename=${movie.video}`} key={movie.video} autoPlay controls progress alt="Image Preview" className="imagePreview" />}
          {uploadProgress.video &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.video} max="100"></progress>
              <span>{Math.round(uploadProgress.video)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Trailer Subtitle</label>
          {trailerSubtitle && (
            <div>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{trailerSubtitleContent}</pre> {/* Display VTT content */}
            </div>
          )}
          < input type="file" placeholder="" name="trailerSubtitle" onChange={(e) => handleImageSelect(e, setTrailerSubtitle)} />
          {uploadProgress.trailerSubtitle &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.trailerSubtitle} max="100"></progress>
              <span>{Math.round(uploadProgress.trailerSubtitle)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Video Subtitle</label>
          {videoSubtitle && (
            <div>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{videoSubtitleContent}</pre> {/* Display VTT content */}
            </div>
          )}
          <input type="file" placeholder="" name="videoSubtitle" onChange={(e) => handleImageSelect(e, setVideoSubtitle)} />
          {uploadProgress.videoSubtitle &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.videoSubtitle} max="100"></progress>
              <span>{Math.round(uploadProgress.videoSubtitle)}%</span>
            </div>
          }
        </div>

        <button className="addProductButton" >Create</button>
      </form >
    </div >
  );
}