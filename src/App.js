import React, { useState } from "react";
import "./styles.css";
import InputMask from "react-input-mask";
import PlayVideo from "./PlayVideo";
import CaptionInput from "./CaptionInput";

export default function App() {
  const [videoUrl, setVideoUrl] = useState(
    "https://videos.pexels.com/video-files/3818936/3818936-hd_1920_1080_30fps.mp4"
  );
  const [captions, setCaptions] = useState([]);
  const [isValidVideoUrl, setIsValidVideoUrl] = useState(false);
  const [showCaptionsForm, setShowCaptionsForm] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  const validateVideoUrl = () => {
    // Validation logic for video URL
    const videoRegex = /\.(mp4|ogg|webm)$/i;
    const isValid = videoRegex.test(videoUrl);
    setIsValidVideoUrl(isValid);

    if (isValid) {
      setShowCaptionsForm(true);
    }
  };

  const handleInputChange = (e) => {
    setVideoUrl(e.target.value);
    setIsValidVideoUrl(false); // Reset validation on input change
    setShowCaptionsForm(false); // Hide captions form on input change
    setPlayVideo(false); // Hide video playback on input change
    setCaptions([]); // Reset captions on input change
  };

  const addCaption = (caption) => {
    // Function to add caption to the captions state
    setCaptions(caption);
  };

  const handleStartPlayback = () => {
    // Function to start video playback with captions
    setPlayVideo(true);
  };

  return (
    <div className="App">
      {!isValidVideoUrl && !showCaptionsForm && !playVideo && (
        <>
          <h1>Enter Video URL</h1>
          <InputMask
            type="text"
            mask=""
            maskChar=""
            value={videoUrl}
            onChange={handleInputChange}
            placeholder="Enter video URL"
          />
          <button onClick={validateVideoUrl}>Validate</button>
        </>
      )}

      {isValidVideoUrl && showCaptionsForm && !playVideo && (
        <div className="edit-container">
          <PlayVideo captions={captions} videoUrl={videoUrl} />
          <CaptionInput addCaption={addCaption} />
        </div>
      )}

      {playVideo && <PlayVideo captions={captions} videoUrl={videoUrl} />}

      {/* {showCaptionsForm && !playVideo && (
        <button className="add-caption-button" onClick={handleStartPlayback}>
          Show Preview
        </button>
      )} */}
    </div>
  );
}
