"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ExternalLink,
  Shield,
  Sparkles,
  Music,
  Play,
  ImageIcon,
  Code,
  Search,
  Brain,
  FileText,
  Users,
  Star,
  Zap,
  Palette,
  GraduationCap,
} from "lucide-react";

interface LibraryResource {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  features: string[];
  normalPrice: string;
  studentPrice: string;
  instructions: string;
  link?: string;
  isPremium: boolean;
  provider?: string;
}

const libraryResources: LibraryResource[] = [
  {
    id: "grammarly",
    name: "Grammarly Premium",
    description:
      "Advanced writing assistant with grammar, spelling, and style suggestions",
    category: "Writing & Productivity",
    icon: <FileText className="h-6 w-6" />,
    features: [
      "Advanced grammar checking",
      "Plagiarism detection",
      "Writing style suggestions",
      "Tone adjustments",
    ],
    normalPrice: "$30/month",
    studentPrice: "Free",
    instructions: "Sign up with your @iitrpr.ac.in email to get premium access",
    link: "https://grammarly.com/edu",
    isPremium: true,
    provider: "Grammarly",
  },
  {
    id: "turnitin",
    name: "Turnitin Library Assist",
    description: "Plagiarism detection and writing feedback tool",
    category: "Academic Tools",
    icon: <Shield className="h-6 w-6" />,
    features: [
      "Plagiarism detection",
      "Citation assistance",
      "Writing feedback",
      "Academic integrity",
    ],
    normalPrice: "$3/paper",
    studentPrice: "Free",
    instructions: "Access through library portal with student credentials",
    isPremium: true,
    provider: "Turnitin",
  },
  {
    id: "research-papers",
    name: "Research Papers Access",
    description: "Access to IEEE, ACM, and other research databases",
    category: "Academic Research",
    icon: <BookOpen className="h-6 w-6" />,
    features: [
      "IEEE Xplore access",
      "ACM Digital Library",
      "SpringerLink",
      "ScienceDirect",
    ],
    normalPrice: "$1000+/year",
    studentPrice: "Free on Campus",
    instructions: "Connect to campus WiFi or use VPN for off-campus access",
    isPremium: true,
    provider: "Multiple Publishers",
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    description: "Ad-free YouTube with background play and downloads",
    category: "Entertainment",
    icon: <Play className="h-6 w-6" />,
    features: [
      "Ad-free videos",
      "Background play",
      "Offline downloads",
      "YouTube Music",
    ],
    normalPrice: "₹129/month",
    studentPrice: "₹79/month",
    instructions: "Verify student status with second student ID",
    link: "https://youtube.com/premium/student",
    isPremium: false,
    provider: "Google",
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium Student",
    description: "Music streaming with offline access and no ads",
    category: "Entertainment",
    icon: <Music className="h-6 w-6" />,
    features: [
      "Ad-free music",
      "Offline downloads",
      "High-quality audio",
      "Unlimited skips",
    ],
    normalPrice: "₹119/month",
    studentPrice: "₹59/month",
    instructions: "Verify enrollment with student ID through SheerID",
    link: "https://spotify.com/student",
    isPremium: false,
    provider: "Spotify",
  },
  {
    id: "adobe-creative",
    name: "Adobe Creative Cloud",
    description: "Complete suite of creative applications",
    category: "Design & Creative",
    icon: <Palette className="h-6 w-6" />,
    features: [
      "Photoshop",
      "Illustrator",
      "Premiere Pro",
      "After Effects",
      "20+ apps",
    ],
    normalPrice: "₹4,500/month",
    studentPrice: "₹1,676/month",
    instructions: "Get 60% student discount with valid student ID",
    link: "https://adobe.com/education",
    isPremium: false,
    provider: "Adobe",
  },
  {
    id: "canva-pro",
    name: "Canva Pro for Education",
    description: "Professional design tools and templates",
    category: "Design & Creative",
    icon: <ImageIcon className="h-6 w-6" />,
    features: [
      "Premium templates",
      "Background remover",
      "Brand kit",
      "Team collaboration",
    ],
    normalPrice: "₹500/month",
    studentPrice: "Free",
    instructions: "Sign up with educational email for free pro access",
    link: "https://canva.com/education",
    isPremium: true,
    provider: "Canva",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot Pro",
    description: "AI-powered code completion and suggestions",
    category: "Development",
    icon: <Code className="h-6 w-6" />,
    features: [
      "AI code suggestions",
      "Multi-language support",
      "Context-aware completions",
      "Learning assistance",
    ],
    normalPrice: "$10/month",
    studentPrice: "Free",
    instructions: "Apply for GitHub Student Developer Pack with student ID",
    link: "https://education.github.com/pack",
    isPremium: true,
    provider: "GitHub",
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    description: "AI-powered search and research assistant",
    category: "AI & Research",
    icon: <Search className="h-6 w-6" />,
    features: [
      "Advanced AI search",
      "Academic citations",
      "Research assistance",
      "Unlimited queries",
    ],
    normalPrice: "$20/month",
    studentPrice: "50% off",
    instructions: "Contact support with student ID for educational discount",
    link: "https://perplexity.ai",
    isPremium: false,
    provider: "Perplexity AI",
  },
  {
    id: "gemini-pro",
    name: "Google Gemini Pro",
    description: "Advanced AI assistant for research and coding",
    category: "AI & Research",
    icon: <Brain className="h-6 w-6" />,
    features: [
      "Advanced reasoning",
      "Code generation",
      "Research assistance",
      "Multimodal AI",
    ],
    normalPrice: "$20/month",
    studentPrice: "Free credits",
    instructions: "Google Workspace for Education provides free access",
    link: "https://cloud.google.com/edu",
    isPremium: true,
    provider: "Google",
  },
  {
    id: "pressreader",
    name: "PressReader",
    description:
      "Access to 7,000+ newspapers and magazines from around the world",
    category: "Academic Research",
    icon: <FileText className="h-6 w-6" />,
    features: [
      "7,000+ publications",
      "60+ languages",
      "Current & back issues",
      "Offline reading",
      "Translation tools",
    ],
    normalPrice: "$30/month",
    studentPrice: "Free on Campus",
    instructions:
      "Access free on campus WiFi network with student ID verification",
    isPremium: true,
    provider: "PressReader",
  },
  {
    id: "matlab",
    name: "MATLAB Academic License",
    description:
      "Numerical computing, data analysis, and visualization software for engineering and science.",
    category: "Software & Tools",
    icon: <Brain className="h-6 w-6" />,
    features: [
      "Numerical computing",
      "Data analysis",
      "Visualization",
      "Toolboxes for engineering and science",
    ],
    normalPrice: "$100+/year",
    studentPrice: "Free",
    instructions:
      "Access MATLAB via institute license. Sign in with your @iitrpr.ac.in email.",
    link: "https://www.mathworks.com/academia/tah-portal/indian-institute-of-technology-ropar-1117203.html",
    isPremium: true,
    provider: "MathWorks",
  },
];

const categories = [
  "All",
  "Writing & Productivity",
  "Academic Tools",
  "Academic Research",
  "Entertainment",
  "Design & Creative",
  "Development",
  "AI & Research",
];

export default function LibraryPage() {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = libraryResources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Writing & Productivity":
        return <FileText className="h-4 w-4" />;
      case "Academic Tools":
        return <GraduationCap className="h-4 w-4" />;
      case "Academic Research":
        return <BookOpen className="h-4 w-4" />;
      case "Entertainment":
        return <Play className="h-4 w-4" />;
      case "Design & Creative":
        return <Palette className="h-4 w-4" />;
      case "Development":
        return <Code className="h-4 w-4" />;
      case "AI & Research":
        return <Brain className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">Student Library Access</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to access student resources
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Student Resource Library
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Access premium tools and services for free or at discounted rates
            with your student ID. Save thousands while learning and creating!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white/30 text-white hover:bg-white/40"
                  }`}
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg text-white">
                      {resource.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {resource.provider}
                      </p>
                    </div>
                  </div>
                  {resource.isPremium && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      FREE
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{resource.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Regular:{" "}
                    <span className="line-through">{resource.normalPrice}</span>
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    {resource.studentPrice}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="p-4 bg-gray-50/50">
                <h4 className="font-medium text-gray-900 mb-2">
                  Key Features:
                </h4>
                <ul className="space-y-1">
                  {resource.features.slice(0, 3).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <Zap className="h-3 w-3 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                  {resource.features.length > 3 && (
                    <li className="text-sm text-gray-500">
                      +{resource.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Instructions */}
              <div className="p-4 border-t border-gray-200/50">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  How to Access:
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {resource.instructions}
                </p>

                {resource.link && (
                  <Button
                    onClick={() => window.open(resource.link, "_blank")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Access
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 max-w-md mx-auto">
              <Search className="h-16 w-16 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Resources Found
              </h3>
              <p className="text-white/80">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}

        {/* Important Note */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-300/30 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-yellow-400 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Important Notes:</h3>
              <ul className="text-white/90 space-y-1 text-sm">
                <li>
                  • Always use your @iitrpr.ac.in email for student verification
                </li>
                <li>• Keep your student ID ready for verification processes</li>
                <li>
                  • Some resources require annual re-verification of student
                  status
                </li>
                <li>
                  • Contact IT support if you have trouble accessing any
                  resource
                </li>
                <li>• Respect the terms of service for all platforms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
