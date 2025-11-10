"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Download,
  Heart,
  Eye,
  Search,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
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
    src: "https://ik.imagekit.io/rzomyrznq/SAB.png",
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
    src: "https://ik.imagekit.io/rzomyrznq/spiral.jpg",
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
    src: "https://ik.imagekit.io/rzomyrznq/lights-on.jpg",
    title: "Campus at Night",
    description: "Campus illuminated under the night sky - a mesmerizing view",
    category: "Nature",
    tags: ["night", "lights", "campus", "evening"],
    likes: 67,
    views: 345,
  },
  {
    id: "4",
    src: "https://ik.imagekit.io/rzomyrznq/Sunset.jpg",
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
    src: "https://ik.imagekit.io/rzomyrznq/Sunset_2.jpg",
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
    src: "https://ik.imagekit.io/rzomyrznq/Leaves.jpg",
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
    src: "https://ik.imagekit.io/rzomyrznq/Academics.jpg",
    title: "Academic Excellence",
    description:
      "Academic buildings representing the pursuit of knowledge and innovation",
    category: "Architecture",
    tags: ["academic", "education", "building", "learning"],
    likes: 56,
    views: 267,
  },
  ...(() => {
    const urls = [
      "https://ik.imagekit.io/rzomyrznq/IMG_2025111010525114.JPG",
      "https://ik.imagekit.io/rzomyrznq/IMG_2025111010525117.JPG",
      "https://ik.imagekit.io/rzomyrznq/IMG_202511101052517.JPG",
      "https://ik.imagekit.io/rzomyrznq/IMG_2568.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_2574.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_2610.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_2627.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_2631.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_2667.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_2673.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3166.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3267.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3284.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3292.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3371.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3562.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3565.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3568.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3569.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3879.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3880.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3882.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3886.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3905.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3922.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_3981.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4199.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4209.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4216.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4304.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4314.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4331.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4353.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4361.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4364.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4370.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4384.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4390.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4396.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4398.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4399.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4411.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4578.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4975.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4987.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_4994.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5004.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5014.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5019.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5020.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5030.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5033.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5038.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5041.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5046.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5052.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5066.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5082.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5084.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5088.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5090.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5096.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5110.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5117.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5121.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5125.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5133.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5136.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5141.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5142.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5147.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5155.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5164.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5171.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5173.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5177.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5179.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5195.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5206.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5235.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5245.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5248.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5255.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5258.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5273.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5277.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5286.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5294.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5295.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5310.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5315.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5334.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5336.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5380.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5389.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5397.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5407.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5410.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5413.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5418.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5436.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5438.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5443.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5458.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5459.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5463.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5465.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5466.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5478.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5487.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5778.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5783.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5798.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5804.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5810.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5930.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5932.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5937.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5951.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5979.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5981.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5984.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5989.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5990.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_5993.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6001.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6003.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6006.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6007.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6008.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6049.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6051.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6241.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6268.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6284.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6413.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6416.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6465.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6710.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6712.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6713.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6714.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6715.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6723.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6727.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6736.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6741.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6744.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6745.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6747.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6750.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6751.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6755.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6757.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6769.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6774.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6779.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6790.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6791.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6792.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6801.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6808.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6825.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6850.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6859.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_6861.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7107.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7116.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7117.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7134.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7194.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7220.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7603.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7609.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7633.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7642.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7649.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_7823.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_8239.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_8247.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_8924.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_9127.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_9405.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_9413.jpg",
      "https://ik.imagekit.io/rzomyrznq/IMG_9541.JPG",
    ];

    const startId = 8;
    return urls.map((u, i) => {
      const filename = u.split("/").pop() || `image_${i}`;
      const nameRaw = filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1);
      const lower = nameRaw.toLowerCase();
      const category =
        lower.includes("academ") ||
        lower.includes("sab") ||
        lower.includes("spiral")
          ? "Architecture"
          : lower.includes("sunset") ||
            lower.includes("lights") ||
            lower.includes("leaves")
          ? "Nature"
          : "Photography";
      const tags = nameRaw
        .split(/\W+/)
        .filter(Boolean)
        .slice(0, 4)
        .map((t) => t.toLowerCase());

      return {
        id: String(startId + i),
        src: u,
        title: name,
        description: `Captured moment: ${name}`,
        category,
        tags: tags.length ? tags : ["campus", "photo"],
        likes: 0,
        views: 0,
      };
    });
  })(),
];

const categories = ["All", "Architecture", "Nature", "Photography"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    const index = filteredImages.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(index);
    setSelectedImage(image);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const goToNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const goToPreviousImage = () => {
    const prevIndex =
      (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleFitToView = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageName || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case "ArrowLeft":
          goToPreviousImage();
          break;
        case "ArrowRight":
          goToNextImage();
          break;
        case "Escape":
          closeModal();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentImageIndex, filteredImages]);

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

          {/* Share Your Moment Button */}
          <div className="text-center">
            <Link href="/gallery/submit">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Share Your Moment
              </Button>
            </Link>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image.src, image.title);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-white flex items-center justify-center backdrop-blur-md transition-all duration-300"
                    title="Download Image"
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

      {/* Enhanced Modal for Full Image View */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close Button - Top Right */}
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40"
            title="Close (Esc)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Previous Button - Left Side */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPreviousImage();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40"
            title="Previous (←)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Button - Right Side */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextImage();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40"
            title="Next (→)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Main Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-16 lg:p-20"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor:
                zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
          >
            <div
              className="relative max-w-full max-h-full transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel}) translate(${
                  imagePosition.x / zoomLevel
                }px, ${imagePosition.y / zoomLevel}px)`,
              }}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={1920}
                height={1080}
                className="max-w-full max-h-[calc(100vh-160px)] w-auto h-auto object-contain select-none"
                draggable={false}
                priority
              />
            </div>
          </div>

          {/* Bottom Control Panel */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 sm:p-4 md:p-6 pb-20 sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-7xl mx-auto">
              {/* Image Info */}
              <div className="mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
                  {selectedImage.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
                  {selectedImage.description}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-6 text-gray-300 text-xs sm:text-sm">
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">{selectedImage.likes} likes</span>
                      <span className="xs:hidden">{selectedImage.likes}</span>
                    </span>
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">{selectedImage.views} views</span>
                      <span className="xs:hidden">{selectedImage.views}</span>
                    </span>
                    <span className="bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm border border-white/20">
                      {selectedImage.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-xs border border-blue-400/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Zoom and Download Controls */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                {/* Zoom Out */}
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:bg-white/5 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-300 border border-white/20"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Zoom Level Display */}
                <div className="bg-white/10 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20 min-w-[60px] sm:min-w-[70px] md:min-w-[80px] text-center">
                  <span className="text-white font-medium text-xs sm:text-sm">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                </div>

                {/* Zoom In */}
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:bg-white/5 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-300 border border-white/20"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Fit to View */}
                <button
                  onClick={handleFitToView}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg flex items-center justify-center transition-all duration-300 border border-white/20"
                  title="Fit to View"
                >
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Divider */}
                <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/20 mx-1 sm:mx-2" />

                {/* Download Button */}
                <button
                  onClick={() =>
                    handleDownload(selectedImage.src, selectedImage.title)
                  }
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all duration-300 border border-blue-500 text-xs sm:text-sm"
                  title="Download Original Image"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium hidden xs:inline">Download</span>
                </button>

                {/* Image Counter */}
                <div className="bg-white/10 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20">
                  <span className="text-white font-medium text-xs sm:text-sm">
                    {currentImageIndex + 1} / {filteredImages.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
