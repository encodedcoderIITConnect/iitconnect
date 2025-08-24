"use client";

import { ExternalLink, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HolidaysPage() {
  const pdfUrl = "https://www.iitrpr.ac.in/sites/default/files/Holidays%20%282025%29.pdf";

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };

  const handleViewFullscreen = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  IIT Ropar Holidays 2025
                </h1>
                <p className="text-white/80 mt-1">
                  Official holiday calendar for the academic year 2025
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleViewFullscreen}
                variant="outline"
                className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>

        {/* PDF Viewer Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-700">
              Holiday Calendar Document
            </h2>
          </div>
          
          {/* PDF Embed */}
          <div className="relative min-h-[80vh]">
            {/* Primary PDF Embed with enhanced parameters */}
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
              className="w-full h-[80vh] border-0"
              title="IIT Ropar Holidays 2025"
              loading="lazy"
              allow="fullscreen"
            />
            
            {/* Fallback object embed (for browsers that don't support iframe PDF) */}
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-[80vh] absolute inset-0 -z-10"
              title="IIT Ropar Holidays 2025 - Fallback"
            >
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center p-8">
                  <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">PDF Viewer</h3>
                  <p className="text-gray-600 mb-4">
                    Your browser doesn&apos;t support PDF viewing
                  </p>
                  <Button
                    onClick={handleViewFullscreen}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View PDF
                  </Button>
                </div>
              </div>
            </object>
            
            {/* Enhanced Fallback */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 opacity-0 hover:opacity-95 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white p-8 rounded-xl shadow-xl text-center pointer-events-auto max-w-md mx-4">
                <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  PDF Viewer Options
                </h3>
                <p className="text-gray-600 mb-6">
                  If the PDF doesn&apos;t display properly, try these alternatives:
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleViewFullscreen}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile-specific message */}
          <div className="md:hidden bg-blue-600/20 backdrop-blur-sm p-4 border-t border-white/10">
            <p className="text-sm text-white text-center">
              📱 For better viewing on mobile, tap &quot;Open in New Tab&quot; above
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mt-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            📅 Important Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-white">Official Document</h4>
                  <p className="text-white/70 text-sm">
                    This is the official holiday calendar published by IIT Ropar administration.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-white">Academic Year 2025</h4>
                  <p className="text-white/70 text-sm">
                    Covers all national holidays, festivals, and institute-specific breaks.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-white">Stay Updated</h4>
                  <p className="text-white/70 text-sm">
                    Check the official IIT Ropar website for any updates or changes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-white">Plan Ahead</h4>
                  <p className="text-white/70 text-sm">
                    Use this calendar to plan your academic schedule and travel arrangements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
