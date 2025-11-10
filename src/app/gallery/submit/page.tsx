"use client";

import { ArrowLeft, Camera, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubmitPhoto() {
  const [iframeHeight, setIframeHeight] = useState(2300);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;

      // Adjust height based on screen width
      if (width < 640) {
        // Mobile: smaller screens need more vertical space
        setIframeHeight(2300);
      } else if (width < 768) {
        // Small tablets
        setIframeHeight(2300);
      } else if (width < 1024) {
        // Tablets
        setIframeHeight(2300);
      } else {
        // Desktop and larger
        setIframeHeight(2200);
      }
    };

    // Set initial height
    updateHeight();

    // Update on window resize
    window.addEventListener("resize", updateHeight);

    // Cleanup
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Gallery</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-10 h-10 text-white" />
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <Heart className="w-8 h-8 text-red-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share Your IIT Ropar Moment
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Capture the essence of campus life! Share your favorite memories,
            stunning views, and unforgettable experiences with the IIT Connect
            community.
          </p>
        </div>

        {/* Embedded Google Form */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/50 pt-10 mb-10">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfUFd95h_teJUCl3IwxjoSVf-_Twc3rQXDirtvwHhD_0RFtHw/viewform?embedded=true"
            width="100%"
            height={iframeHeight}
            className="w-full border-0 rounded-lg shadow-2xl pt-5"
          >
            Loading…
          </iframe>
        </div>

        {/* Open in New Page Button */}
        <div className="text-center mb-6">
          <button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSfUFd95h_teJUCl3IwxjoSVf-_Twc3rQXDirtvwHhD_0RFtHw/viewform",
                "_blank"
              )
            }
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white hover:cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Open Form in New Page
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-blue-100 text-sm">
            By submitting, you grant IIT Connect permission to showcase your
            photo on our platform. Photo credit will be given.
          </p>
        </div>
      </div>
    </div>
  );
}
