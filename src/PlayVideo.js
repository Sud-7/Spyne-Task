import { useEffect } from "react";

export default function PlayVideo({ captions, videoUrl }) {
  useEffect(() => {
    console.log(captions);
  }, [captions]);

  const generateWebVTT = () => {
    let webVTTString = "WEBVTT\n\n";
    captions.forEach((caption) => {
      webVTTString += `${caption.startTime} --> ${caption.endTime}\n`;
      webVTTString += `${caption.text}\n\n`;
    });
    return webVTTString;
  };

  return (
    <div className="video-container">
      <video style={{ width: "90%" }} src={videoUrl} controls>
        <track
          kind="subtitles"
          src={`data:text/vtt;charset=utf-8,${encodeURIComponent(
            generateWebVTT()
          )}`}
          srcLang="en"
          label="English"
          default
        />
      </video>
    </div>
  );
}
