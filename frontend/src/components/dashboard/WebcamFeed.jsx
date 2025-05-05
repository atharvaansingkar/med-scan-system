import { useEffect, useRef } from "react";
import { useDashboardStore } from "../../lib/store";
import { supabase } from "../../lib/supabase";
import "../../styles/webcam-feed.css";

export default function WebcamFeed() {
  const {
    isScanning,
    capturedImage,
    addCapturedImage,
    setProcessFrameFunction,
  } = useDashboardStore();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const stopWebcam = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (isScanning) {
      navigator.mediaDevices
        .getUserMedia({ video: true }) // ✅ Fix: use any available camera
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(console.error);
    } else {
      stopWebcam();
    }

    return stopWebcam;
  }, [isScanning]);

  // Setup manual frame capture
  useEffect(() => {
    if (!videoRef.current) return;

    setProcessFrameFunction(async () => {
      const videoEl = videoRef.current;
      if (!videoEl || !videoEl.videoWidth) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoEl, 0, 0);

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      addCapturedImage(imgData);

      try {
        const OCR_URL = process.env.REACT_APP_OCR_URL;
        if (!OCR_URL) throw new Error("OCR URL is not defined in environment variables.");
      
        const res = await fetch(OCR_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imgData }),
        });
      
        const json = await res.json();

        if (!res.ok || !json.success) {
          console.error("OCR error:", json.error);
          return;
        }

        // ✅ Fetch user correctly
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("No user found!");
          return;
        }

        const scan = {
          user_id: user.id,
          raw_name: json.data.raw_name,    // ✅ must use raw_name, not name
          mfg_date: json.data.mfg_date,
          exp_date: json.data.exp_date,
          status: json.data.status,
          accuracy: json.data.accuracy,
        };
        console.log("Scan going to insert:", scan);


        const { data: inserted, error } = await supabase
          .from("scans")
          .insert([scan])
          .select()
          .single();

        if (error) {
          console.error("Insert error:", error);
        } else {
          useDashboardStore.getState().addScanResult(inserted);
          await useDashboardStore.getState().fetchStats();
        }
      } catch (err) {
        console.error("OCR request failed:", err);
      }
    });
  }, [videoRef, addCapturedImage, setProcessFrameFunction]);

  return (
    <div className="webcam-feed-card">
      <div className="webcam-container">
        <video ref={videoRef} autoPlay playsInline muted className="webcam-video" />
      </div>
      <div className="captured-container">
        {capturedImage && <img src={capturedImage} alt="Captured" className="captured-image" />}
      </div>
    </div>
  );
}
