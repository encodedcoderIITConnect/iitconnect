"use client";

import { ExternalLink, Clock, Download, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BusTimingPage() {
  // Convert the Google Docs URL to embeddable format
  const originalUrl = "https://docs.google.com/document/d/1oFeyY-JxaXzPH0hWT1HTMEA_nOtyz1g1w2XYEwTC9_Y/edit?tab=t.0";
  const documentId = "1oFeyY-JxaXzPH0hWT1HTMEA_nOtyz1g1w2XYEwTC9_Y";
  
  // Multiple embed URL options for better compatibility
  const embedUrl = `https://docs.google.com/document/d/${documentId}/pub?embedded=true`;
  const previewUrl = `https://docs.google.com/document/d/${documentId}/preview`;
  const viewerUrl = `https://drive.google.com/file/d/${documentId}/preview`;

  const handleViewOriginal = () => {
    window.open(originalUrl, '_blank');
  };

  const handleViewFullscreen = () => {
    window.open(previewUrl, '_blank');
  };

  const handleViewInDrive = () => {
    window.open(viewerUrl, '_blank');
  };

  const handleDownload = () => {
    const downloadUrl = `https://docs.google.com/document/d/${documentId}/export?format=pdf`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Bus className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  IIT Ropar Bus Timings
                </h1>
                <p className="text-white/80 mt-1">
                  Campus shuttle and transportation schedules
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
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
                Preview
              </Button>
              <Button
                onClick={handleViewInDrive}
                variant="outline"
                className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Bus className="w-4 h-4" />
                Drive View
              </Button>
            </div>
          </div>
        </div>

        {/* Document Viewer Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-700">
              Bus Schedule Document
            </h2>
          </div>
          
          {/* Google Docs Embed */}
          <div className="relative min-h-[80vh]">
            {/* Primary Embed using preview URL */}
            <iframe
              src={previewUrl}
              className="w-full h-[80vh] border-0"
              title="IIT Ropar Bus Timings"
              loading="lazy"
              allow="fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            
            {/* Fallback using Drive viewer */}
            <iframe
              src={viewerUrl}
              className="w-full h-[80vh] absolute inset-0 -z-10 border-0"
              title="IIT Ropar Bus Timings - Drive View"
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            
            {/* Secondary fallback using published embed URL */}
            <iframe
              src={embedUrl}
              className="w-full h-[80vh] absolute inset-0 -z-20 border-0"
              title="IIT Ropar Bus Timings - Published"
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            
            {/* Enhanced Fallback for cases where embedding doesn't work */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 opacity-0 hover:opacity-95 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white p-8 rounded-xl shadow-xl text-center pointer-events-auto max-w-md mx-4">
                <Bus className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Document Viewer Options
                </h3>
                <p className="text-gray-600 mb-6">
                  If the document doesn&apos;t display properly, try these alternatives:
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleViewOriginal}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Original Document
                  </Button>
                  <Button
                    onClick={handleViewInDrive}
                    variant="outline"
                    className="w-full"
                  >
                    <Bus className="w-4 h-4 mr-2" />
                    View in Google Drive
                  </Button>
                  <Button
                    onClick={handleViewFullscreen}
                    variant="outline"
                    className="w-full"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Preview Mode
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download as PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile-specific message */}
          <div className="md:hidden bg-blue-600/20 backdrop-blur-sm p-4 border-t border-white/10">
            <p className="text-sm text-white text-center">
              📱 For better viewing on mobile, tap &quot;Open Original Document&quot; above
            </p>
          </div>
          
          {/* Google Docs embedding note */}
          <div className="bg-purple-600/20 backdrop-blur-sm p-4 border-t border-white/10">
            <p className="text-sm text-white text-center">
              💡 If the document doesn&apos;t load, Google Docs may require direct access. Use the buttons above to view the document.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🚌 Bus Service Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Campus Shuttle</h4>
                  <p className="text-gray-600 text-sm">
                    Regular shuttle service connecting different parts of the campus.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">City Routes</h4>
                  <p className="text-gray-600 text-sm">
                    Transportation to nearby cities and important locations.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Updated Schedule</h4>
                  <p className="text-gray-600 text-sm">
                    Check the document for the most current timings and routes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Contact Info</h4>
                  <p className="text-gray-600 text-sm">
                    For queries, contact the transportation office or check with administration.
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
