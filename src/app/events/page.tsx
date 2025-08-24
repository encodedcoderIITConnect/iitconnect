"use client";

import { Calendar, Clock, Users, Star, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Calendar className="w-20 h-20 text-yellow-300 animate-pulse" />
              <Sparkles className="w-8 h-8 text-yellow-200 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
            Events & Celebrations
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Fests • Conferences • Symposiums
          </p>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
            <Clock className="w-5 h-5 text-yellow-300" />
            <span className="text-lg font-medium">Coming Soon</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8">
                <Star className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                🎉 Get Ready for Amazing Events!
              </h2>
              
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                We&apos;re working hard to bring you the most comprehensive events platform for IIT Ropar. 
                Soon you&apos;ll be able to discover, register, and participate in all the exciting fests, 
                conferences, and symposiums happening on campus.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Calendar className="w-6 h-6 text-pink-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fests</h3>
                  <p className="text-blue-200 text-sm">
                    Cultural festivals, tech fests, and campus celebrations
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-6 h-6 text-green-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Conferences</h3>
                  <p className="text-blue-200 text-sm">
                    Academic conferences, industry talks, and research symposiums
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Star className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Symposiums</h3>
                  <p className="text-blue-200 text-sm">
                    Technical symposiums, workshops, and knowledge sharing events
                  </p>
                </div>
              </div>

              <Button 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled
              >
                <Bell className="w-5 h-5 mr-2" />
                Notify Me When Ready
              </Button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-yellow-300" />
                What&apos;s Coming
              </h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Event discovery and browsing
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Easy registration process
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Event reminders and notifications
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Photo galleries and highlights
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Event feedback and reviews
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-green-300" />
                For Students
              </h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Never miss important events
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Connect with event organizers
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Share experiences with friends
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Track your event participation
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Discover new interests
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Stay Tuned!</h3>
            <p className="text-blue-100 mb-6">
              Follow our development progress and be the first to know when the Events section goes live. 
              We&apos;re building something amazing for the IIT Ropar community! 🚀
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm">🎊 Cultural Events</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm">🔬 Tech Symposiums</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm">🎤 Guest Lectures</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm">🏆 Competitions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
