"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Code,
  Trophy,
  Calendar,
  Users,
  ExternalLink,
  Search,
  Plus,
  Star,
  Clock,
  Award,
  Target,
  Zap,
} from "lucide-react";

interface Contest {
  id: string;
  title: string;
  platform: string;
  date: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  participants: number;
  prizes: string[];
  isRegistered: boolean;
  status: "upcoming" | "live" | "completed";
  url: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  platform: string;
  tags: string[];
  solved: boolean;
  likes: number;
  url: string;
  category: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  level: "beginner" | "intermediate" | "advanced";
  focus: string[];
  meetingTime: string;
  whatsappUrl?: string;
}

export default function CodingPage() {
  const [activeTab, setActiveTab] = useState<
    "contests" | "practice" | "groups"
  >("contests");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample contests data
  const [contests] = useState<Contest[]>([
    {
      id: "1",
      title: "IIT Connect Coding Challenge",
      platform: "Internal",
      date: "2025-07-28",
      duration: "3 hours",
      difficulty: "medium",
      participants: 45,
      prizes: ["₹5000", "₹3000", "₹2000"],
      isRegistered: true,
      status: "upcoming",
      url: "#",
    },
    {
      id: "2",
      title: "Codeforces Round #945",
      platform: "Codeforces",
      date: "2025-07-27",
      duration: "2 hours",
      difficulty: "medium",
      participants: 12000,
      prizes: ["Rating"],
      isRegistered: false,
      status: "upcoming",
      url: "https://codeforces.com",
    },
    {
      id: "3",
      title: "LeetCode Weekly Contest 412",
      platform: "LeetCode",
      date: "2025-07-27",
      duration: "1.5 hours",
      difficulty: "medium",
      participants: 8500,
      prizes: ["LeetCoins"],
      isRegistered: true,
      status: "upcoming",
      url: "https://leetcode.com",
    },
    {
      id: "4",
      title: "CodeChef August Challenge",
      platform: "CodeChef",
      date: "2025-08-01",
      duration: "10 days",
      difficulty: "hard",
      participants: 15000,
      prizes: ["₹25000", "₹15000", "₹10000"],
      isRegistered: false,
      status: "upcoming",
      url: "https://codechef.com",
    },
  ]);

  // Sample practice problems
  const [problems] = useState<Problem[]>([
    {
      id: "1",
      title: "Two Sum",
      difficulty: "easy",
      platform: "LeetCode",
      tags: ["Array", "Hash Table"],
      solved: true,
      likes: 1200,
      url: "https://leetcode.com/problems/two-sum",
      category: "Array",
    },
    {
      id: "2",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      platform: "LeetCode",
      tags: ["String", "Sliding Window"],
      solved: false,
      likes: 890,
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
      category: "String",
    },
    {
      id: "3",
      title: "Binary Tree Inorder Traversal",
      difficulty: "easy",
      platform: "LeetCode",
      tags: ["Tree", "DFS", "Stack"],
      solved: true,
      likes: 756,
      url: "https://leetcode.com/problems/binary-tree-inorder-traversal",
      category: "Tree",
    },
    {
      id: "4",
      title: "Merge k Sorted Lists",
      difficulty: "hard",
      platform: "LeetCode",
      tags: ["Linked List", "Divide and Conquer", "Heap"],
      solved: false,
      likes: 980,
      url: "https://leetcode.com/problems/merge-k-sorted-lists",
      category: "Linked List",
    },
  ]);

  // Sample study groups
  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: "1",
      name: "DSA Beginners",
      description:
        "Perfect group for students starting with Data Structures and Algorithms",
      members: 12,
      maxMembers: 20,
      level: "beginner",
      focus: ["Arrays", "Strings", "Basic Math"],
      meetingTime: "Daily 8:00 PM",
      whatsappUrl: "https://chat.whatsapp.com/example1",
    },
    {
      id: "2",
      name: "Competitive Programming Masters",
      description:
        "Advanced group for students preparing for ICPC and other programming contests",
      members: 8,
      maxMembers: 15,
      level: "advanced",
      focus: [
        "Dynamic Programming",
        "Graph Theory",
        "Advanced Data Structures",
      ],
      meetingTime: "Alternate days 9:00 PM",
      whatsappUrl: "https://chat.whatsapp.com/example2",
    },
    {
      id: "3",
      name: "Interview Prep Squad",
      description:
        "Focused on solving interview questions from top tech companies",
      members: 15,
      maxMembers: 25,
      level: "intermediate",
      focus: ["System Design", "Coding Interviews", "Mock Interviews"],
      meetingTime: "Weekends 7:00 PM",
      whatsappUrl: "https://chat.whatsapp.com/example3",
    },
    {
      id: "4",
      name: "Python Problem Solvers",
      description:
        "Language-specific group focusing on Python programming and algorithms",
      members: 18,
      maxMembers: 30,
      level: "beginner",
      focus: ["Python", "Basic Algorithms", "Code Implementation"],
      meetingTime: "Daily 6:00 PM",
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-blue-600 bg-blue-100";
      case "advanced":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "text-blue-600 bg-blue-100";
      case "live":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
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
                <Code className="h-8 w-8 mr-3 text-purple-600" />
                Coding & Programming
              </h1>
              <p className="text-gray-600 mt-1">
                Practice problems, join contests, and collaborate with fellow
                programmers
              </p>
            </div>

            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Create Study Group
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Contests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contests.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Problems Solved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {problems.filter((p) => p.solved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Study Groups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studyGroups.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studyGroups.reduce((sum, group) => sum + group.members, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab("contests")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "contests"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Trophy className="h-4 w-4 mr-2 inline" />
            Contests
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "practice"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Target className="h-4 w-4 mr-2 inline" />
            Practice
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "groups"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="h-4 w-4 mr-2 inline" />
            Study Groups
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "contests" && (
          <div className="space-y-6">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contest.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          contest.status
                        )}`}
                      >
                        {contest.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          contest.difficulty
                        )}`}
                      >
                        {contest.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(contest.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {contest.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {contest.participants} participants
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        {contest.prizes.join(", ")}
                      </div>
                    </div>

                    <p className="text-sm text-blue-600 mt-2">
                      Platform: {contest.platform}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={contest.isRegistered ? "outline" : "default"}
                      size="sm"
                    >
                      {contest.isRegistered ? "Registered" : "Register"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "practice" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                      {problem.solved && (
                        <span className="text-green-600 text-sm">✓ Solved</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {problem.title}
                    </h3>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 mr-1" />
                    {problem.likes}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-blue-600 mb-2">
                    Platform: {problem.platform}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Category: {problem.category}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    {problem.solved ? "View Solution" : "Solve"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {group.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                          group.level
                        )}`}
                      >
                        {group.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {group.members}/{group.maxMembers} members
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {group.meetingTime}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Focus Areas:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.focus.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={group.members >= group.maxMembers}
                  >
                    {group.members >= group.maxMembers
                      ? "Group Full"
                      : "Join Group"}
                  </Button>
                  {group.whatsappUrl && (
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
