"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  Users,
  Star,
  Search,
  Plus,
  Globe,
  Github,
  Calendar,
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
      title: "Train Social",
      description:
        "Social networking platform for train travelers to connect, share experiences, and find travel companions during their journey.",
      category: "web",
      status: "completed",
      teamSize: 3,
      maxTeamSize: 3,
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      difficulty: "intermediate",
      duration: "4 months",
      createdDate: "2024-08-15",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        year: "Student Project",
      },
      liveUrl: "https://train-social.vercel.app",
      likes: 45,
      isLiked: false,
    },
    {
      id: "2",
      title: "Department Database",
      description:
        "Comprehensive database system for managing department information, faculty details, courses, and student records.",
      category: "web",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["PostgreSQL", "Express.js", "React", "Prisma"],
      difficulty: "intermediate",
      duration: "3 months",
      createdDate: "2024-09-01",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        year: "Student Project",
      },
      githubUrl: "https://github.com/example/dept-database",
      likes: 32,
      isLiked: false,
    },
    {
      id: "3",
      title: "Superset",
      description:
        "Data visualization and business intelligence platform for analyzing campus statistics and generating insights.",
      category: "web",
      status: "development",
      teamSize: 4,
      maxTeamSize: 5,
      technologies: ["Python", "Apache Superset", "PostgreSQL", "Docker"],
      difficulty: "advanced",
      duration: "5 months",
      createdDate: "2024-10-10",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        year: "Student Project",
      },
      likes: 28,
      isLiked: false,
    },
    {
      id: "4",
      title: "Calee App",
      description:
        "Mobile application for managing college calendars, events, assignments, and academic schedules in one place.",
      category: "mobile",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["React Native", "Firebase", "TypeScript", "Expo"],
      difficulty: "intermediate",
      duration: "3 months",
      createdDate: "2024-07-20",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
        year: "Student Project",
      },
      liveUrl: "https://calee-app.com",
      likes: 56,
      isLiked: true,
    },
    {
      id: "5",
      title: "RideMate",
      description:
        "Carpooling and ride-sharing platform specifically designed for college students to share rides to various destinations.",
      category: "web",
      status: "completed",
      teamSize: 3,
      maxTeamSize: 3,
      technologies: ["Next.js", "MongoDB", "Google Maps API", "Tailwind"],
      difficulty: "intermediate",
      duration: "4 months",
      createdDate: "2024-06-15",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        year: "Student Project",
      },
      liveUrl: "https://ridemate.vercel.app",
      likes: 67,
      isLiked: true,
    },
    {
      id: "6",
      title: "AutoGrade",
      description:
        "Automated grading system using AI to evaluate assignments, quizzes, and provide instant feedback to students.",
      category: "ai-ml",
      status: "development",
      teamSize: 4,
      maxTeamSize: 5,
      technologies: ["Python", "TensorFlow", "Flask", "NLP", "OpenAI"],
      difficulty: "advanced",
      duration: "6 months",
      createdDate: "2024-09-05",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        year: "Student Project",
      },
      githubUrl: "https://github.com/example/autograde",
      likes: 89,
      isLiked: true,
    },
    {
      id: "7",
      title: "FestEz",
      description:
        "Complete festival management system for organizing college fests, handling registrations, events, and participant tracking.",
      category: "web",
      status: "completed",
      teamSize: 5,
      maxTeamSize: 5,
      technologies: [
        "React",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "Payment Gateway",
      ],
      difficulty: "intermediate",
      duration: "5 months",
      createdDate: "2024-05-10",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        year: "Student Project",
      },
      liveUrl: "https://festez.app",
      likes: 94,
      isLiked: true,
    },
    {
      id: "8",
      title: "IoT Testbed",
      description:
        "IoT infrastructure for testing and deploying IoT applications with various sensors and actuators across campus.",
      category: "iot",
      status: "development",
      teamSize: 4,
      maxTeamSize: 6,
      technologies: ["Arduino", "Raspberry Pi", "MQTT", "InfluxDB", "Grafana"],
      difficulty: "advanced",
      duration: "8 months",
      createdDate: "2024-08-01",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        year: "Student Project",
      },
      githubUrl: "https://github.com/example/iot-testbed",
      likes: 41,
      isLiked: false,
    },
    {
      id: "9",
      title: "MessEase",
      description:
        "Mess management system for menu planning, feedback collection, attendance tracking, and mess bill management.",
      category: "web",
      status: "completed",
      teamSize: 3,
      maxTeamSize: 3,
      technologies: ["Next.js", "MongoDB", "Prisma", "Tailwind CSS"],
      difficulty: "beginner",
      duration: "3 months",
      createdDate: "2024-07-01",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
        year: "Student Project",
      },
      liveUrl: "https://messease.app",
      likes: 78,
      isLiked: true,
    },
    {
      id: "10",
      title: "Guest House Management",
      description:
        "Comprehensive guest house booking and management system for visitors, faculty, and official guests.",
      category: "web",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["React", "Express.js", "MySQL", "Bootstrap"],
      difficulty: "intermediate",
      duration: "4 months",
      createdDate: "2024-06-10",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        year: "Student Project",
      },
      likes: 52,
      isLiked: false,
    },
    {
      id: "11",
      title: "Sports Management",
      description:
        "Complete sports facility booking, tournament management, and player registration system for campus sports activities.",
      category: "web",
      status: "completed",
      teamSize: 3,
      maxTeamSize: 3,
      technologies: ["Django", "PostgreSQL", "React", "Tailwind"],
      difficulty: "intermediate",
      duration: "4 months",
      createdDate: "2024-05-15",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        year: "Student Project",
      },
      liveUrl: "https://sports-portal.iitropar.ac.in",
      likes: 63,
      isLiked: true,
    },
    {
      id: "12",
      title: "Snap Nutrition",
      description:
        "AI-powered nutrition tracking app that analyzes food photos to provide nutritional information and dietary recommendations.",
      category: "ai-ml",
      status: "development",
      teamSize: 3,
      maxTeamSize: 4,
      technologies: ["Python", "TensorFlow", "Computer Vision", "React Native"],
      difficulty: "advanced",
      duration: "6 months",
      createdDate: "2024-09-20",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        year: "Student Project",
      },
      likes: 45,
      isLiked: false,
    },
    {
      id: "13",
      title: "Hostel Management",
      description:
        "End-to-end hostel management system for room allocation, maintenance requests, visitor management, and mess integration.",
      category: "web",
      status: "completed",
      teamSize: 4,
      maxTeamSize: 4,
      technologies: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "Tailwind"],
      difficulty: "intermediate",
      duration: "5 months",
      createdDate: "2024-04-10",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        year: "Student Project",
      },
      liveUrl: "https://hostel.iitropar.ac.in",
      likes: 81,
      isLiked: true,
    },
    {
      id: "14",
      title: "Library Management",
      description:
        "Digital library management system with book cataloging, borrowing, returns, and online reservation features.",
      category: "web",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["PHP", "MySQL", "jQuery", "Bootstrap"],
      difficulty: "beginner",
      duration: "3 months",
      createdDate: "2024-03-15",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
        year: "Student Project",
      },
      likes: 39,
      isLiked: false,
    },
    {
      id: "15",
      title: "OLX CampusKart",
      description:
        "Campus marketplace for students to buy, sell, and exchange books, electronics, furniture, and other items.",
      category: "web",
      status: "completed",
      teamSize: 3,
      maxTeamSize: 3,
      technologies: ["React", "Node.js", "MongoDB", "Cloudinary", "Razorpay"],
      difficulty: "intermediate",
      duration: "4 months",
      createdDate: "2024-08-05",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        year: "Student Project",
      },
      liveUrl: "https://campuskart.vercel.app",
      likes: 92,
      isLiked: true,
    },
    {
      id: "16",
      title: "Club Management (SEA)",
      description:
        "Student club and extracurricular activity management platform for events, memberships, and announcements.",
      category: "web",
      status: "completed",
      teamSize: 4,
      maxTeamSize: 4,
      technologies: ["Vue.js", "Express.js", "PostgreSQL", "Docker"],
      difficulty: "intermediate",
      duration: "4 months",
      createdDate: "2024-06-01",
      owner: {
        name: "SEA Team",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        year: "Student Project",
      },
      liveUrl: "https://sea.iitropar.ac.in",
      likes: 74,
      isLiked: true,
    },
    {
      id: "17",
      title: "MyGate",
      description:
        "Campus entry and exit management system with visitor tracking, vehicle registration, and security monitoring.",
      category: "web",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["Angular", "Spring Boot", "MySQL", "QR Code"],
      difficulty: "intermediate",
      duration: "3 months",
      createdDate: "2024-07-10",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        year: "Student Project",
      },
      likes: 48,
      isLiked: false,
    },
    {
      id: "18",
      title: "Wander (UniTrip)",
      description:
        "Travel planning and group trip management platform for college students to organize and join trips together.",
      category: "web",
      status: "development",
      teamSize: 3,
      maxTeamSize: 4,
      technologies: ["Next.js", "MongoDB", "Maps API", "Payment Integration"],
      difficulty: "intermediate",
      duration: "5 months",
      createdDate: "2024-09-15",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        year: "Student Project",
      },
      likes: 58,
      isLiked: true,
    },
    {
      id: "19",
      title: "UtilWise",
      description:
        "Utility bill management and tracking system for hostels including electricity, water, and maintenance charges.",
      category: "web",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["React", "Firebase", "Material-UI", "Chart.js"],
      difficulty: "beginner",
      duration: "2 months",
      createdDate: "2024-08-20",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
        year: "Student Project",
      },
      likes: 35,
      isLiked: false,
    },
    {
      id: "20",
      title: "DBT Website",
      description:
        "Official website for Department of Biotechnology showcasing research, faculty, publications, and departmental activities.",
      category: "web",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["Next.js", "Tailwind CSS", "CMS", "SEO"],
      difficulty: "beginner",
      duration: "2 months",
      createdDate: "2024-05-20",
      owner: {
        name: "DBT Team",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        year: "Department Project",
      },
      liveUrl: "https://dbt.iitropar.ac.in",
      likes: 42,
      isLiked: false,
    },
    {
      id: "21",
      title: "MediEase",
      description:
        "Campus healthcare management system for medical appointments, prescription tracking, and health records management.",
      category: "web",
      status: "development",
      teamSize: 3,
      maxTeamSize: 4,
      technologies: ["React", "Node.js", "PostgreSQL", "HIPAA Compliance"],
      difficulty: "advanced",
      duration: "6 months",
      createdDate: "2024-10-01",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        year: "Student Project",
      },
      likes: 61,
      isLiked: true,
    },
    {
      id: "22",
      title: "Sport Portal",
      description:
        "Comprehensive sports portal for booking facilities, viewing schedules, tournament brackets, and sports analytics.",
      category: "web",
      status: "completed",
      teamSize: 3,
      maxTeamSize: 3,
      technologies: ["Laravel", "Vue.js", "MySQL", "Bootstrap"],
      difficulty: "intermediate",
      duration: "4 months",
      createdDate: "2024-04-25",
      owner: {
        name: "Sports Committee",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        year: "Student Project",
      },
      liveUrl: "https://sports.iitropar.ac.in",
      likes: 69,
      isLiked: true,
    },
    {
      id: "23",
      title: "Institute Ranking",
      description:
        "Data analytics platform for tracking and visualizing institute rankings, performance metrics, and comparative analysis.",
      category: "web",
      status: "completed",
      teamSize: 2,
      maxTeamSize: 2,
      technologies: ["Python", "Django", "D3.js", "PostgreSQL"],
      difficulty: "intermediate",
      duration: "3 months",
      createdDate: "2024-07-25",
      owner: {
        name: "Development Team",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        year: "Institutional Project",
      },
      likes: 37,
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
        return "text-green-300";
      case "intermediate":
        return "text-yellow-300";
      case "advanced":
        return "text-red-300";
      default:
        return "text-white/60";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-xl border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center poppins-bold">
                <FolderOpen className="h-8 w-8 mr-3" />
                College Projects
              </h1>
              <p className="text-white/90 mt-1 poppins-regular">
                Explore amazing projects built by IIT Ropar students
              </p>
            </div>

            <Button className="shrink-0 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
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
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/60 focus:bg-white/30"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value as
                    | "all"
                    | "web"
                    | "mobile"
                    | "ai-ml"
                    | "iot"
                    | "research"
                    | "other"
                )
              }
              className="px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-md text-sm text-white"
            >
              <option value="all" className="text-gray-900">
                All Categories
              </option>
              <option value="web" className="text-gray-900">
                Web Development
              </option>
              <option value="mobile" className="text-gray-900">
                Mobile Apps
              </option>
              <option value="ai-ml" className="text-gray-900">
                AI/ML
              </option>
              <option value="iot" className="text-gray-900">
                IoT
              </option>
              <option value="research" className="text-gray-900">
                Research
              </option>
              <option value="other" className="text-gray-900">
                Other
              </option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as
                    | "all"
                    | "planning"
                    | "development"
                    | "completed"
                    | "seeking-members"
                )
              }
              className="px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-md text-sm text-white"
            >
              <option value="all" className="text-gray-900">
                All Status
              </option>
              <option value="planning" className="text-gray-900">
                Planning
              </option>
              <option value="development" className="text-gray-900">
                In Development
              </option>
              <option value="completed" className="text-gray-900">
                Completed
              </option>
              <option value="seeking-members" className="text-gray-900">
                Seeking Members
              </option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/30 rounded-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/80 poppins-regular">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-white poppins-bold">
                  {projects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/30 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/80 poppins-regular">
                  Active Teams
                </p>
                <p className="text-2xl font-bold text-white poppins-bold">
                  {projects.filter((p) => p.status === "development").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500/30 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/80 poppins-regular">
                  Seeking Members
                </p>
                <p className="text-2xl font-bold text-white poppins-bold">
                  {
                    projects.filter((p) => p.status === "seeking-members")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/80 poppins-regular">
                  Completed
                </p>
                <p className="text-2xl font-bold text-white poppins-bold">
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
              className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02]"
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
                  <h3 className="text-lg font-semibold text-white mb-2 poppins-semibold">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center text-sm text-white/90">
                  <Star
                    className={`h-4 w-4 mr-1 ${
                      project.isLiked
                        ? "text-yellow-400 fill-current"
                        : "text-white/60"
                    }`}
                  />
                  {project.likes}
                </div>
              </div>

              <p className="text-white/90 text-sm mb-4 line-clamp-3 poppins-regular">
                {project.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-white/80">
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

                <div className="flex items-center text-sm text-white/80">
                  <Calendar className="h-4 w-4 mr-2" />
                  Duration: {project.duration}
                </div>

                <div className="flex items-center">
                  <Image
                    src={project.owner.avatar}
                    alt={project.owner.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-white/80 poppins-regular">
                    {project.owner.name} • {project.owner.year}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-white/20 text-white text-xs rounded backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 bg-white/20 text-white text-xs rounded backdrop-blur-sm">
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Live
                    </Button>
                  )}
                  {project.whatsappGroup && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Group
                    </Button>
                  )}
                </div>

                <Button
                  size="sm"
                  disabled={project.teamSize >= project.maxTeamSize}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-white/10 disabled:text-white/50"
                >
                  {project.teamSize >= project.maxTeamSize
                    ? "Team Full"
                    : "View Details"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8">
              <FolderOpen className="h-12 w-12 mx-auto text-white/60 mb-4" />
              <p className="text-white text-lg font-semibold poppins-semibold">
                No projects found
              </p>
              <p className="text-white/80 text-sm mt-1 poppins-regular">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
