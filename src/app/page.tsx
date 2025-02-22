"use client";
import { useEffect, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function FairPlayPlayer() {
  let player;
  const [videoEl, setVideoEl] = useState(null);

  const onVideo = useCallback((el) => {
    setVideoEl(el);
  }, []);

  useEffect(() => {
    if (videoEl == null) return;

    player = videojs(videoEl, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true,
      techOrder: ["html5"],
      html5: {
        vhs: {
          overrideNative: true
        },
        drm: {
          fairplay: {
            licenseUri: "https://c8eaeae1-drm-fairplay-licensing.axprod.net/AcquireLicense",
            certificateUri: "https://travelxp.akamaized.net/cert/fairplay/fairplay.cer",
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9..."
            },
            getContentId: (emeOptions, initData) => {
              if (initData) {
                const contentId = new TextDecoder().decode(initData);
                console.log("Extracted Content ID:", contentId);
                const url = new URL(contentId);
                return url.hostname;
              }
              return "default-content-id";
            }
          }
        }
      },
      sources: [
        {
          src: "https://travelxp.akamaized.net/676026372b3f6946db2f607d/manifest_v2_hd_20122024_1558.m3u8",
          type: "application/x-mpegURL"
        }
      ]
    });
  }, [videoEl]); // Re-run effect when `videoEl` changes

  return (
    <div>
      <video ref={onVideo} className="video-js vjs-default-skin" />
    </div>
  );
}
