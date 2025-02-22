"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-eme"; // Import contrib-eme for DRM support

export default function FairPlayPlayer() {
  const playerRef = useRef(null);
  const [videoEl, setVideoEl] = useState(null);

  const onVideo = useCallback((el) => {
    setVideoEl(el);
  }, []);

  useEffect(() => {
    if (!videoEl || playerRef.current) return;

    const player = videojs(videoEl, {
      techOrder: ["html5"],
      html5: {
        vhs: { overrideNative: true }
      }
    });

    player.on("ready", () => {
      player.src({
        src: "https://travelxp.akamaized.net/676026372b3f6946db2f607d/manifest_v2_hd_20122024_1558.m3u8",
        type: "application/x-mpegURL",
        keySystems: {
          "com.apple.fps.1_0": {
            certificateUri: "https://travelxp.akamaized.net/cert/fairplay/fairplay.cer",
            licenseUri: "https://c8eaeae1-drm-fairplay-licensing.axprod.net/AcquireLicense",
            licenseHeaders: {
              "X-AxDRM-Message":
                "eyJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjQ1ODc2N2QtYTgzYi00MWQ0LWFlNjgtYWNhNzAwZDNkODRmIiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsInZlcnNpb24iOjIsImxpY2Vuc2UiOnsiZXhwaXJhdGlvbl9kYXRldGltZSI6IjIwMjUtMDItMjNUMDc6MzA6NDguMDQxWiIsImFsbG93X3BlcnNpc3RlbmNlIjp0cnVlLCJyZWFsX3RpbWVfZXhwaXJhdGlvbiI6dHJ1ZX0sImNvbnRlbnRfa2V5X3VzYWdlX3BvbGljaWVzIjpbeyJuYW1lIjoiUG9saWN5IEEiLCJ3aWRldmluZSI6eyJkZXZpY2Vfc2VjdXJpdHlfbGV2ZWwiOiJTV19TRUNVUkVfQ1JZUFRPIn19XSwiY29udGVudF9rZXlzX3NvdXJjZSI6eyJpbmxpbmUiOlt7ImlkIjoiYmJkZjFmYWVlZmE5ODRjNjNhZjVkNmYzYzA1MDQwMDkiLCJ1c2FnZV9wb2xpY3kiOiJQb2xpY3kgQSJ9LHsiaWQiOiJhMzAzYzM1NzRiMTIzYmZlZGM3YWEyZmZkNmY1M2JmMSIsInVzYWdlX3BvbGljeSI6IlBvbGljeSBBIn0seyJpZCI6ImI0ZTU0MjVjM2NhYjc4NTE0MTgwZDQ2MTA3NzBkNmJkIiwidXNhZ2VfcG9saWN5IjoiUG9saWN5IEEifSx7ImlkIjoiZTdkMjQ0NzI1MGQ5YmE0MmE0MzIzNzRmODU3ZjJhYzgiLCJ1c2FnZV9wb2xpY3kiOiJQb2xpY3kgQSJ9XX19LCJpYXQiOjE3NDAyMTMwNDgsImV4cCI6MTc0MDI5OTQ0OH0.mvYEfdiPegA8XDuZMGmFNRdiXlTlT3gCNUTfzWt6AxA"
            },
            getContentId: (emeOptions, initData) => {
              if (!initData) return "default-content-id";
              try {
                const contentId = new TextDecoder().decode(initData);
                console.log("Extracted Content ID:", contentId);
                return contentId.startsWith("skd://") ? contentId : new URL(contentId).hostname;
              } catch (error) {
                console.error("Error extracting content ID:", error);
                return "default-content-id";
              }
            }
          }
        }
      });
    });

    player.eme();

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoEl]);

  return (
    <div className="w-96">
      <video ref={onVideo} className="video-js vjs-default-skin w-40" />
    </div>
  );
}
