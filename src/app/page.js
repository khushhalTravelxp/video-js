"use client";
import { useEffect, useRef } from "react";
import shaka from "shaka-player";

export default function ShakaPlayer() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    async function initPlayer() {
      if (!videoRef.current) return;

      shaka.polyfill.installAll();

      playerRef.current = new shaka.Player(videoRef.current);

      playerRef.current.addEventListener("error", (event) => {
        console.error("Error code", event.detail.code, "object", event.detail);
      });

      playerRef.current.getNetworkingEngine().registerRequestFilter((type, request) => {
        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
          request.headers["X-AxDRM-Message"] =
            "eyJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjQ1ODc2N2QtYTgzYi00MWQ0LWFlNjgtYWNhNzAwZDNkODRmIiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsInZlcnNpb24iOjIsImxpY2Vuc2UiOnsiZXhwaXJhdGlvbl9kYXRldGltZSI6IjIwMjUtMDItMjNUMDc6MzA6NDguMDQxWiIsImFsbG93X3BlcnNpc3RlbmNlIjp0cnVlLCJyZWFsX3RpbWVfZXhwaXJhdGlvbiI6dHJ1ZX0sImNvbnRlbnRfa2V5X3VzYWdlX3BvbGljaWVzIjpbeyJuYW1lIjoiUG9saWN5IEEiLCJ3aWRldmluZSI6eyJkZXZpY2Vfc2VjdXJpdHlfbGV2ZWwiOiJTV19TRUNVUkVfQ1JZUFRPIn19XSwiY29udGVudF9rZXlzX3NvdXJjZSI6eyJpbmxpbmUiOlt7ImlkIjoiYmJkZjFmYWVlZmE5ODRjNjNhZjVkNmYzYzA1MDQwMDkiLCJ1c2FnZV9wb2xpY3kiOiJQb2xpY3kgQSJ9LHsiaWQiOiJhMzAzYzM1NzRiMTIzYmZlZGM3YWEyZmZkNmY1M2JmMSIsInVzYWdlX3BvbGljeSI6IlBvbGljeSBBIn0seyJpZCI6ImI0ZTU0MjVjM2NhYjc4NTE0MTgwZDQ2MTA3NzBkNmJkIiwidXNhZ2VfcG9saWN5IjoiUG9saWN5IEEifSx7ImlkIjoiZTdkMjQ0NzI1MGQ5YmE0MmE0MzIzNzRmODU3ZjJhYzgiLCJ1c2FnZV9wb2xpY3kiOiJQb2xpY3kgQSJ9XX19LCJpYXQiOjE3NDAyMTMwNDgsImV4cCI6MTc0MDI5OTQ0OH0.mvYEfdiPegA8XDuZMGmFNRdiXlTlT3gCNUTfzWt6AxA";
        }
      });

      const drmConfig = {};
      drmConfig["com.apple.fps"] = "https://c8eaeae1-drm-fairplay-licensing.axprod.net/AcquireLicense";
      playerRef.current.configure({
        drm: {
          servers: drmConfig,
          advanced: {
            "com.apple.fps": {
              serverCertificateUri: "https://travelxp.akamaized.net/cert/fairplay/fairplay.cer",
              getContentId: (emeOptions, initData) => {
                return new TextDecoder().decode(initData.filter((item) => item !== 0 && item !== 150));
              }
            }
          }
        },
        streaming: {
          useNativeHlsForFairPlay: false
        }
      });

      try {
        await playerRef.current.load("https://travelxp.akamaized.net/676026372b3f6946db2f607d/manifest_v2_hd_20122024_1558.m3u8");
        console.log("The video has been loaded successfully!");
      } catch (error) {
        console.error("Error loading video", error);
      }
    }

    if (shaka.Player.isBrowserSupported()) {
      initPlayer();
    } else {
      console.error("Browser not supported!");
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return <video ref={videoRef} controls width="70%" height="700px" />;
}
