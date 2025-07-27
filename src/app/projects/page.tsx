"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  Users,
  Star,
  GitBranch,
  ExternalLink,
  Search,
  Plus,
  Code,
  Globe,
  Github,
  Calendar,
  Tag,
  User,
  BookOpen,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: "web" | "mobile" | "ai-ml" | "iot" | "research" | "other";
  status: "planning" | "development" | "completed" | "seeking-members";
  teamSize: number;
  maxTeamSize: number;
  technologies: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  createdDate: string;
  owner: {
    name: string;
    avatar: string;
    year: string;
  };
  githubUrl?: string;
  liveUrl?: string;
  whatsappGroup?: string;
  likes: number;
  isLiked: boolean;
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "web" | "mobile" | "ai-ml" | "iot" | "research" | "other"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "planning" | "development" | "completed" | "seeking-members"
  >("all");

  // Sample projects data
  const [projects] = useState<Project[]>([
    {
      id: "1",
      title: "IIT Connect Mobile App",
      description:
        "Mobile application for IIT Connect platform with React Native. Looking for developers interested in mobile development.",
      category: "mobile",
      status: "seeking-members",
      teamSize: 2,
      maxTeamSize: 5,
      technologies: ["React Native", "TypeScript", "Firebase", "Expo"],
      difficulty: "intermediate",
      duration: "3-4 months",
      createdDate: "2025-07-20",
      owner: {
        name: "Rahul Sharma",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        year: "B.Tech 3rd Year",
      },
      githubUrl: "https://github.com/example/iit-connect-mobile",
      whatsappGroup: "https://chat.whatsapp.com/example",
      likes: 23,
      isLiked: false,
    },
    {
      id: "2",
      title: "Smart Campus IoT System",
      description:
        "IoT-based system for monitoring campus facilities like lighting, temperature, and occupancy using sensors and microcontrollers.",
      category: "iot",
      status: "development",
      teamSize: 4,
      maxTeamSize: 6,
      technologies: ["Arduino", "Raspberry Pi", "Python", "MQTT", "InfluxDB"],
      difficulty: "advanced",
      duration: "6 months",
      createdDate: "2025-07-15",
      owner: {
        name: "Priya Patel",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
        year: "M.Tech 1st Year",
      },
      githubUrl: "https://github.com/example/smart-campus",
      likes: 45,
      isLiked: true,
    },
    {
      id: "3",
      title: "AI-Powered Study Buddy",
      description:
        "Machine learning application that helps students with personalized study recommendations and doubt resolution.",
      category: "ai-ml",
      status: "planning",
      teamSize: 1,
      maxTeamSize: 4,
      technologies: ["Python", "TensorFlow", "Flask", "React", "NLP"],
      difficulty: "advanced",
      duration: "4-5 months",
      createdDate: "2025-07-22",
      owner: {
        name: "Arjun Singh",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        year: "B.Tech 4th Year",
      },
      whatsappGroup: "https://chat.whatsapp.com/example2",
      likes: 67,
      isLiked: false,
    },
    {
      id: "4",
      title: "Campus Event Management System",
      description:
        "Full-stack web application for managing campus events, registrations, and announcements with admin panel.",
      category: "web",
      status: "completed",
      teamSize: 3,
      maxTeamSize: 3,
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind"],
      difficulty: "intermediate",
      duration: "2 months",
      createdDate: "2025-05-10",
      owner: {
        name: "Sneha Gupta",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        year: "B.Tech 3rd Year",
      },
      githubUrl: "https://github.com/example/event-management",
      liveUrl: "https://campus-events.vercel.app",
      likes: 89,
      isLiked: true,
    },
    {
      id: "5",
      title: "Quantum Computing Research",
      description:
        "Research project on quantum algorithms for optimization problems. Looking for students interested in theoretical computer science.",
      category: "research",
      status: "seeking-members",
      teamSize: 2,
      maxTeamSize: 4,
      technologies: ["Qiskit", "Python", "Mathematics", "LaTeX"],
      difficulty: "advanced",
      duration: "8-10 months",
      createdDate: "2025-07-18",
      owner: {
        name: "Dr. Vikash Kumar",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        year: "Faculty",
      },
      likes: 34,
      isLiked: false,
    },
    {
      id: "6",
      title: "Campus Food Delivery App",
      description:
        "Simple web app for ordering food from mess and canteen with real-time tracking and payment integration.",
      category: "web",
      status: "development",
      teamSize: 2,
      maxTeamSize: 4,
      technologies: ["React", "Express.js", "MongoDB", "Socket.io", "Razorpay"],
      difficulty: "beginner",
      duration: "2-3 months",
      createdDate: "2025-07-25",
      owner: {
        name: "Rohit Sharma",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        year: "B.Tech 2nd Year",
      },
      githubUrl: "https://github.com/example/food-delivery",
      whatsappGroup: "https://chat.whatsapp.com/example3",
      likes: 12,
      isLiked: false,
    },
  ]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "web":
        return "text-blue-600 bg-blue-100";
      case "mobile":
        return "text-green-600 bg-green-100";
      case "ai-ml":
        return "text-purple-600 bg-purple-100";
      case "iot":
        return "text-orange-600 bg-orange-100";
      case "research":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "text-yellow-600 bg-yellow-100";
      case "development":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "seeking-members":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600";
      case "intermediate":
        return "text-yellow-600";
      case "advanced":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FolderOpen className="h-8 w-8 mr-3 text-blue-600" />
                College Projects
              </h1>
              <p className="text-gray-600 mt-1">
                Collaborate on projects, join teams, and build amazing things
                together
              </p>
            </div>

            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Apps</option>
              <option value="ai-ml">AI/ML</option>
              <option value="iot">IoT</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="development">In Development</option>
              <option value="completed">Completed</option>
              <option value="seeking-members">Seeking Members</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Teams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "development").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Seeking Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    projects.filter((p) => p.status === "seeking-members")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        project.category
                      )}`}
                    >
                      {project.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Star
                    className={`h-4 w-4 mr-1 ${
                      project.isLiked
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                  {project.likes}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {project.teamSize}/{project.maxTeamSize} members
                  </div>
                  <div
                    className={`font-medium ${getDifficultyColor(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Duration: {project.duration}
                </div>

                <div className="flex items-center">
                  <img
                    src={project.owner.avatar}
                    alt={project.owner.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    {project.owner.name} • {project.owner.year}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-1" />
                      Live
                    </Button>
                  )}
                  {project.whatsappGroup && (
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      Group
                    </Button>
                  )}
                </div>

                <Button
                  size="sm"
                  disabled={project.teamSize >= project.maxTeamSize}
                >
                  {project.teamSize >= project.maxTeamSize
                    ? "Team Full"
                    : "Join Project"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No projects found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
