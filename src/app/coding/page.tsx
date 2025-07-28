"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Code,
  Trophy,
  Calendar,
  Users,
  ExternalLink,
  Star,
  Clock,
  Award,
  Target,
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
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<
    "contests" | "practice" | "groups"
  >("contests");

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <Code className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">Coding & Programming</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to access coding contests,
            practice problems, and study groups
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Sign In to Continue
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
              <Code className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Coding & Programming
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Practice problems, join contests, and collaborate with fellow
            programmers
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-1 bg-white/20 backdrop-blur-xl border border-white/30 p-1 rounded-2xl mb-8 w-fit mx-auto">
          <button
            onClick={() => setActiveTab("contests")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "contests"
                ? "bg-white/60 text-gray-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Trophy className="h-4 w-4 mr-2 inline" />
            Contests
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "practice"
                ? "bg-white/60 text-gray-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Target className="h-4 w-4 mr-2 inline" />
            Practice
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "groups"
                ? "bg-white/60 text-gray-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4 mr-2 inline" />
            Study Groups
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "contests" && (
            <>
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="space-y-6">
                    {/* Contest Header */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              contest.status
                            )}`}
                          >
                            {contest.status}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              contest.difficulty
                            )}`}
                          >
                            {contest.difficulty}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {contest.title}
                      </h3>

                      <p className="text-sm font-medium text-blue-600">
                        Platform: {contest.platform}
                      </p>
                    </div>

                    {/* Contest Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>
                            {new Date(contest.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span>{contest.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span>{contest.participants}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-orange-500" />
                          <span className="truncate">{contest.prizes[0]}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-2">
                        {contest.isRegistered ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 border-green-200 text-green-700 font-medium"
                            disabled
                          >
                            ✓ Registered
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
                          >
                            Register Now
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(contest.url, "_blank")}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "practice" && (
            <>
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="space-y-6">
                    {/* Problem Header */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Target className="h-8 w-8 text-blue-600" />
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                          {problem.solved && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              ✓ Solved
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {problem.title}
                      </h3>

                      <p className="text-sm font-medium text-blue-600">
                        Platform: {problem.platform}
                      </p>
                    </div>

                    {/* Problem Tags */}
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          +{problem.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Problem Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          {problem.likes} likes
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">
                        {problem.category}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(problem.url, "_blank")}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {problem.solved ? "Review Solution" : "Solve Problem"}
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "groups" && (
            <>
              {studyGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="space-y-6">
                    {/* Group Header */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Users className="h-8 w-8 text-purple-600" />
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                            group.level
                          )}`}
                        >
                          {group.level}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {group.name}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    {/* Focus Areas */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        Focus Areas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.focus.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                        {group.focus.length > 3 && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            +{group.focus.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Group Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">
                          {group.members}/{group.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-xs">
                          {group.meetingTime}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
                        disabled={group.members >= group.maxMembers}
                      >
                        {group.members >= group.maxMembers
                          ? "Group Full"
                          : "Join Group"}
                      </Button>
                      {group.whatsappUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(group.whatsappUrl, "_blank")
                          }
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          WhatsApp Group
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
