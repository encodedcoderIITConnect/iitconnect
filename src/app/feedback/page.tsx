"use client";

import { ArrowLeft, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-10 h-10 text-white" />
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share Your Feedback
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            We value your input! Your suggestions help us improve IIT Connect
            for everyone. Please share your thoughts, ideas, or any issues
            you&apos;ve encountered.
          </p>
        </div>

        {/* Embedded Google Form */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/50">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfUqnhijgxWOf0YzthOPY43o-msTmyi9HauPsxZuiOlsjt6DQ/viewform?embedded=true"
            width="100%"
            height="1200"
            className="w-full"
          >
            Loading…
          </iframe>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-blue-100 text-sm">
            Your feedback is valuable. Thank you for helping us make IIT Connect
            better!
          </p>
        </div>
      </div>
    </div>
  );
}
