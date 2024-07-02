import React, { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";

const CaptionInput = ({ addCaption }) => {
  const [captions, setCaptions] = useState([
    { startTime: "00:00:00.000", endTime: "00:00:02.000", text: "" },
  ]);
  const [errors, setErrors] = useState([]);

  // this is for the commit
  useEffect(() => {
    const handler = setTimeout(() => {
      addCaption(captions);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [captions, addCaption]);

  const timeToComparableFormat = (time) => {
    return time.replace(/[:.]/g, "");
  };

  const addMilliseconds = (time, msToAdd) => {
    let [hours, minutes, seconds] = time.split(":");
    let [secs, millis] = seconds.split(".");

    let totalMillis =
      parseInt(hours) * 3600000 +
      parseInt(minutes) * 60000 +
      parseInt(secs) * 1000 +
      parseInt(millis) +
      msToAdd;
    hours = Math.floor(totalMillis / 3600000)
      .toString()
      .padStart(2, "0");
    minutes = Math.floor((totalMillis % 3600000) / 60000)
      .toString()
      .padStart(2, "0");
    secs = Math.floor((totalMillis % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    millis = (totalMillis % 1000).toString().padStart(3, "0");

    return `${hours}:${minutes}:${secs}.${millis}`;
  };

  const isValidCaption = (captions, index) => {
    let isValid = true;
    const newErrors = [];

    for (let i = 0; i < captions.length; i++) {
      const { startTime, endTime, text } = captions[i];
      if (!startTime || !endTime || !text) {
        newErrors[index] = "All fields must be filled.";
        isValid = false;
      } else if (
        timeToComparableFormat(endTime) < timeToComparableFormat(startTime)
      ) {
        newErrors[index] =
          "End time must be greater than or equal to start time.";
        isValid = false;
      } else if (
        i > 0 &&
        timeToComparableFormat(startTime) <
          timeToComparableFormat(captions[i - 1].endTime)
      ) {
        newErrors[index] =
          "Start time must be greater than or equal to the end time of the previous caption.";
        isValid = false;
      } else {
        newErrors[index] = "";
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleAddCaption = () => {
    const lastCaption = captions[captions.length - 1];
    if (isValidCaption([lastCaption], captions.length - 1)) {
      const newStartTime = addMilliseconds(lastCaption.endTime, 0);
      const newEndTime = addMilliseconds(newStartTime, 2000);
      setCaptions([
        ...captions,
        { startTime: newStartTime, endTime: newEndTime, text: "" },
      ]);
    }
  };

  const handleCaptionChange = (index, field, value) => {
    const updatedCaptions = [...captions];
    updatedCaptions[index][field] = value;
    setCaptions(updatedCaptions);
    isValidCaption(updatedCaptions, index);
  };

  const handleRemoveCaption = (index) => {
    const updatedCaptions = [...captions];
    updatedCaptions.splice(index, 1);
    setCaptions(updatedCaptions);
  };

  return (
    <div className="caption-input-parent">
      <button className="add-caption-button" onClick={handleAddCaption}>
        Add Caption
      </button>
      <div className="caption-child">
        {captions.map((caption, index) => (
          <div className="caption-parent">
            <div key={index} className="caption-input-container">
              <div className="input-container">
                <div className="input-field">
                  <ReactInputMask
                    type="text"
                    mask="99:99:99.999"
                    maskChar="_"
                    value={caption.startTime}
                    onChange={(e) =>
                      handleCaptionChange(index, "startTime", e.target.value)
                    }
                    placeholder="00:00:00.000"
                  />
                </div>
                <div className="input-field">
                  <ReactInputMask
                    type="text"
                    mask="99:99:99.999"
                    maskChar="_"
                    value={caption.endTime}
                    onChange={(e) =>
                      handleCaptionChange(index, "endTime", e.target.value)
                    }
                    placeholder="00:00:00.000"
                  />
                </div>
              </div>
              <div className="text-container">
                <textarea
                  value={caption.text}
                  onChange={(e) =>
                    handleCaptionChange(index, "text", e.target.value)
                  }
                  placeholder="Enter caption text..."
                />
              </div>
            </div>
            {errors[index] && <p className="error-text">{errors[index]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaptionInput;
