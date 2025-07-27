"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusSquare,
  Image as ImageIcon,
  Video,
  FileText,
  MapPin,
  Users,
  Car,
  Gamepad2,
  Code,
  FolderOpen,
  Tag,
  X,
} from "lucide-react";

import React from "react";

interface PostCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

export default function CreatePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const categories: PostCategory[] = [
    {
      id: "cab",
      name: "Cab Sharing",
      icon: Car,
      description: "Share rides and split costs",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "cycle",
      name: "Cycle Sharing",
      icon: Users,
      description: "Borrow or lend bicycles",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "books",
      name: "Books",
      icon: FileText,
      description: "Buy, sell, or exchange books",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: PlusSquare,
      description: "Buy, sell electronics and gadgets",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "games",
      name: "Games",
      icon: Gamepad2,
      description: "Organize gaming sessions",
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: "projects",
      name: "Projects",
      icon: FolderOpen,
      description: "Collaborate on projects",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      id: "coding",
      name: "Coding",
      icon: Code,
      description: "Programming discussions and help",
      color: "bg-red-100 text-red-600",
    },
    {
      id: "general",
      name: "General",
      icon: Users,
      description: "General discussions and updates",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    if (!selectedCategory || !postContent.trim()) {
      alert("Please select a category and write some content");
      return;
    }

    // In a real app, this would send the post to the backend
    console.log("Creating post:", {
      category: selectedCategory,
      title: postTitle,
      content: postContent,
      tags,
      location,
      price,
    });

    // Reset form
    setSelectedCategory("");
    setPostContent("");
    setPostTitle("");
    setTags([]);
    setLocation("");
    setPrice("");

    alert("Post created successfully!");
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <PlusSquare className="h-8 w-8 mr-3 text-blue-600" />
            Create New Post
          </h1>
          <p className="text-gray-600 mt-1">
            Share something with the IIT Connect community
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Category Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Choose a Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategory === category.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg ${category.color} mr-3`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Content */}
          {selectedCategory && (
            <div className="space-y-6">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                {selectedCategoryData && (
                  <>
                    <div
                      className={`p-2 rounded-lg ${selectedCategoryData.color} mr-3`}
                    >
                      <selectedCategoryData.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-blue-900">
                      Creating a {selectedCategoryData.name} post
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <Input
                  placeholder="Give your post a catchy title..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  placeholder="What's on your mind? Share details, ask questions, or start a discussion..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category-specific fields */}
              {(selectedCategory === "cab" ||
                selectedCategory === "games" ||
                selectedCategory === "books" ||
                selectedCategory === "electronics") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <Input
                      placeholder="Where is this happening?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  {(selectedCategory === "books" ||
                    selectedCategory === "electronics") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <Input
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags (press Enter)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Media Upload Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media (Coming Soon)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex justify-center space-x-4 mb-2">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <Video className="h-8 w-8 text-gray-400" />
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    Image and video upload coming soon!
                  </p>
                </div>
              </div>

              {/* Post Preview */}
              {postContent && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Preview
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                        Y
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Your Name</p>
                        <p className="text-sm text-gray-500">Just now</p>
                      </div>
                      {selectedCategoryData && (
                        <span
                          className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${selectedCategoryData.color}`}
                        >
                          {selectedCategoryData.name}
                        </span>
                      )}
                    </div>

                    {postTitle && (
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {postTitle}
                      </h4>
                    )}

                    <p className="text-gray-800 mb-3">{postContent}</p>

                    {(location || price) && (
                      <div className="flex gap-4 text-sm text-gray-600 mb-3">
                        {location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {location}
                          </span>
                        )}
                        {price && <span className="font-medium">₹{price}</span>}
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("");
                    setPostContent("");
                    setPostTitle("");
                    setTags([]);
                    setLocation("");
                    setPrice("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedCategory || !postContent.trim()}
                >
                  <PlusSquare className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
