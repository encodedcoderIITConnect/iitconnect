"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Download, Heart, Eye, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
}

const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/campus/SAB.png",
    title: "Student Academic Block",
    description:
      "The iconic SAB building - heart of academic activities at IIT Ropar",
    category: "Architecture",
    tags: ["SAB", "academic", "building", "modern"],
    likes: 45,
    views: 234,
  },
  {
    id: "2",
    src: "/campus/spiral.jpg",
    title: "Spiral Architecture",
    description:
      "Beautiful spiral design showcasing modern architectural excellence",
    category: "Architecture",
    tags: ["spiral", "design", "modern", "structure"],
    likes: 32,
    views: 187,
  },
  {
    id: "3",
    src: "/campus/lights-on.jpg",
    title: "Campus at Night",
    description: "Campus illuminated under the night sky - a mesmerizing view",
    category: "Nature",
    tags: ["night", "lights", "campus", "evening"],
    likes: 67,
    views: 345,
  },
  {
    id: "4",
    src: "/campus/Sunset.jpg",
    title: "Golden Hour",
    description:
      "Breathtaking sunset view from campus - nature's daily masterpiece",
    category: "Nature",
    tags: ["sunset", "golden", "sky", "evening"],
    likes: 89,
    views: 456,
  },
  {
    id: "5",
    src: "/campus/Sunset_2.jpg",
    title: "Evening Serenity",
    description:
      "Another stunning sunset capturing the peaceful campus atmosphere",
    category: "Nature",
    tags: ["sunset", "peaceful", "sky", "serene"],
    likes: 73,
    views: 298,
  },
  {
    id: "6",
    src: "/campus/Leaves.jpg",
    title: "Campus Greenery",
    description:
      "Lush green foliage showcasing the natural beauty of our campus",
    category: "Nature",
    tags: ["leaves", "green", "nature", "plants"],
    likes: 41,
    views: 189,
  },
  {
    id: "7",
    src: "/campus/Academics.jpg",
    title: "Academic Excellence",
    description:
      "Academic buildings representing the pursuit of knowledge and innovation",
    category: "Architecture",
    tags: ["academic", "education", "building", "learning"],
    likes: 56,
    views: 267,
  },
];

const categories = ["All", "Architecture", "Nature", "Events"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    let filtered = galleryImages;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((img) => img.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredImages(filtered);
  }, [selectedCategory, searchTerm]);

  const handleLike = (imageId: string) => {
    const newLikedImages = new Set(likedImages);
    if (likedImages.has(imageId)) {
      newLikedImages.delete(imageId);
    } else {
      newLikedImages.add(imageId);
    }
    setLikedImages(newLikedImages);
  };

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Campus Gallery</h1>
          <p className="text-blue-100 text-lg">
            Discover the beauty of IIT Ropar through stunning visuals
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-white text-blue-600 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Coming Soon Upload Button */}
          <div className="text-center">
            <Button
              disabled
              className="bg-white/20 text-white border border-white/30 hover:bg-white/30 cursor-not-allowed"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photos (Coming Soon)
            </Button>
          </div>
        </div>

        {/* Gallery Grid - Pinterest Style */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => openModal(image)}
            >
              {/* Image */}
              <div className="relative">
                <Image
                  src={image.src}
                  alt={image.title}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Right Action Buttons */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(image.id);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                      likedImages.has(image.id)
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedImages.has(image.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-white flex items-center justify-center backdrop-blur-md transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Overlay with Details */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                    {image.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-2 line-clamp-2 drop-shadow">
                    {image.description}
                  </p>

                  {/* Stats and Category */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {image.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {image.views}
                      </span>
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs border border-white/30">
                      {image.category}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-black/30 backdrop-blur-sm text-white/90 px-2 py-1 rounded-full text-xs border border-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="bg-black/30 backdrop-blur-sm text-white/90 px-2 py-1 rounded-full text-xs border border-white/20">
                        +{image.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick View Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No images found
            </h3>
            <p className="text-blue-200">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Modal for Full Image View */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="max-w-4xl max-h-[90vh] w-full bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={800}
                height={600}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedImage.title}
              </h2>
              <p className="text-blue-100 mb-4">{selectedImage.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-blue-200">
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    {selectedImage.likes} likes
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {selectedImage.views} views
                  </span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-blue-100">
                  {selectedImage.category}
                </span>
              </div>
              {/* All Tags in Modal */}
              <div className="flex flex-wrap gap-1 mt-4">
                {selectedImage.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500/30 text-blue-100 px-2 py-1 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
