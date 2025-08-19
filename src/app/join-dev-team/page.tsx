"use client";

import { Button } from "@/components/ui/button";
import {
  Code,
  Users,
  Star,
  Mail,
  Laptop,
  Lightbulb,
  Heart,
  CheckCircle,
  Copy,
  AlertTriangle,
} from "lucide-react";

export default function JoinDevTeamPage() {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("iitconnect22@gmail.com");
    alert("Email copied to clipboard!");
  };

  const skills = [
    { name: "VS Code", icon: Code },
    { name: "Next.js", icon: Laptop },
    { name: "JavaScript", icon: Code },
    { name: "Git & GitHub", icon: Code },
    { name: "ChatGPT/AI Tools", icon: Lightbulb },
    { name: "VS Code Copilot", icon: Code },
  ];

  const perks = [
    "Featured with us in the platform's dev team",
    "Be part of a student-led innovation",
    "Contribute to your college's digital future",
    "Network with talented student developers",
    "Build your portfolio with real-world projects",
    "Help create a forever homecoming platform for alumni",
  ];

  return (
    <>
      <style jsx>{`
        @keyframes gradient-slide {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .gradient-text {
          background: linear-gradient(
            90deg,
            #fef3c7,
            #fed7aa,
            #fca5a5,
            #f9a8d4,
            #c4b5fd,
            #93c5fd,
            #67e8f9,
            #fef3c7
          );
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradient-slide 3s ease-in-out infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Join the IIT Connect Dev Team
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Be part of something amazing! Help us build the ultimate platform
              for IIT Ropar students. This platform is completely developed by
              students and still being developed by students for better
              connectivity and networking.
            </p>
          </div>

          {/* Disclaimer Section */}
          <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-2xl p-6 sm:p-8 mb-12 max-w-4xl mx-auto backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4 mb-6">
              <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">UNDER DEVELOPMENT</span>
              </h2>
              <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
            </div>
            <div className="text-center space-y-4">
              <p className="text-lg sm:text-xl font-semibold text-yellow-100">
                🚧 This platform is currently under active development 🚧
              </p>
              <div className="text-sm sm:text-lg text-yellow-50 space-y-2">
                <p>
                  • <strong>Bugs are super obvious</strong> - We&apos;re working
                  on fixing them!
                </p>
                <p>
                  • <strong>Chat is slow and buggy</strong> - Performance
                  improvements coming soon
                </p>
                <p>
                  • <strong>Features may break or change</strong> - Please be
                  patient with us
                </p>
                <p>
                  • <strong>Stay tuned</strong> - Major updates are on the way!
                </p>
              </div>
              <p className="text-yellow-200 font-medium mt-6">
                Thank you for your patience as we build something amazing for
                the IIT Ropar community! 🚀
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* What We're Looking For */}
            <div className="space-y-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Code className="h-6 w-6 mr-3 text-blue-600" />
                  What We Need
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      🚀 Urgent Need: Developers
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      We&apos;re looking for developers with knowledge or
                      interest in:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg"
                        >
                          <skill.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      🎯 We Also Need
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Front-end experts
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Back-end experts
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        People with information & connections
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Anyone eager to learn and grow
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Don&apos;t Know Anything?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>You&apos;re still welcome!</strong> All we need is
                      eagerness and enthusiasm to learn and grow. We&apos;ll
                      help you get started!
                    </p>
                  </div>
                </div>
              </div>

              {/* Perks */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-3 text-yellow-600" />
                  What You Get
                </h2>

                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    <em>
                      Platform is under development yet - join us and become
                      part of us!
                    </em>
                  </p>
                  {perks.map((perk, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded-full flex-shrink-0 mt-1">
                        <Star className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Ready to Join Us?
              </h2>

              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Send us an Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Simply drop us an email with your interest to join the team!
                  </p>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-mono text-lg text-gray-900 dark:text-white">
                        iitconnect22@gmail.com
                      </span>
                      <Button
                        onClick={handleCopyEmail}
                        variant="outline"
                        size="sm"
                        className="ml-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Include in your email:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Your name and entry number</li>
                      <li>• Your technical skills and experience level</li>
                      <li>• Why you want to join our team</li>
                      <li>• Your GitHub profile (if you have one)</li>
                      <li>• Any projects or portfolio links</li>
                    </ul>

                    <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-700 mt-4">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>📧 Subject Line:</strong> &quot;Join IIT Connect
                        Dev Team - [Your Name]&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() =>
                      window.open(
                        "mailto:iitconnect22@gmail.com?subject=Join IIT Connect Dev Team - [Your Name]&body=Hi there!%0A%0AI am interested in joining the IIT Connect development team.%0A%0AName: [Your Name]%0AEntry Number: [Your Entry Number]%0A%0ASkills: [List your skills]%0AExperience: [Your experience level]%0A%0AWhy I want to join: [Your motivation]%0A%0AGitHub: [Your GitHub profile]%0APortfolio: [Your portfolio/projects]%0A%0AThank you!"
                      )
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>

                  <Button
                    onClick={handleCopyEmail}
                    variant="outline"
                    className="border-blue-200 dark:border-blue-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Email
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We&apos;ll get back to you within 24-48 hours!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
