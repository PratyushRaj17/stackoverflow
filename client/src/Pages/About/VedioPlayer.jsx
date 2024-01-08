import React, { useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import video from "../../assets/Intro.mp4";

const VideoPlayer = () => {
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current.getInternalPlayer();

    let touchStartTime;
    let touchEndTime;

    const handleTouchStart = () => {
      touchStartTime = new Date().getTime();
    };

    const handleTouchEnd = (event) => {
      touchEndTime = new Date().getTime();
      const touchDuration = touchEndTime - touchStartTime;

      const isDoubleTap = touchDuration < 300;

      if (isDoubleTap) {
        const currentPosition = player.getCurrentTime();
        const seekTime = event.clientX > window.innerWidth / 2 ? currentPosition + 10 : currentPosition - 5;
        player.seekTo(seekTime);
      } else if (touchDuration < 500) {
        player.togglePlay();
      }
    };

    const handleLongPress = (event, direction) => {
      const speed = direction === "forward" ? 2 : -1;
      player.playbackRate = speed;

      const resetPlaybackRate = () => {
        player.playbackRate = 1;
        document.removeEventListener("mouseup", resetPlaybackRate);
      };

      document.addEventListener("mouseup", resetPlaybackRate);
    };

    // Add touch event listeners
    player.wrapper.addEventListener("touchstart", handleTouchStart);
    player.wrapper.addEventListener("touchend", (event) => handleTouchEnd(event));

    // Add long press event listeners
    player.wrapper.addEventListener("mousedown", (event) => {
      const direction = event.clientX > window.innerWidth / 2 ? "forward" : "backward";
      const timeout = direction === "forward" ? 1000 : 500;

      const longPressTimer = setTimeout(() => {
        handleLongPress(event, direction);
      }, timeout);

      document.addEventListener("mouseup", () => {
        clearTimeout(longPressTimer);
        player.playbackRate = 1;
      });
    });

    // Cleanup event listeners
    return () => {
      player.wrapper.removeEventListener("touchstart", handleTouchStart);
      player.wrapper.removeEventListener("touchend", () => handleTouchEnd());
      player.wrapper.removeEventListener("mousedown", () => handleLongPress());
      document.removeEventListener("mouseup", () => player.playbackRate = 1);
    };
  }, []); // Run only on mount

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url={video}
        controls
        width={"90%"}
        height={"90%"}
      />
    </div>
  );
};

export default VideoPlayer;
