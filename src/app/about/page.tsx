import { AlertTriangle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 text-white px-4 py-16">
      {/* Big Disclaimer */}
      <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-2xl p-8 mb-12 max-w-4xl w-full backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 mb-6">
          <AlertTriangle className="w-12 h-12 text-yellow-400" />
          <h2 className="text-3xl font-bold text-yellow-100">
            UNDER DEVELOPMENT
          </h2>
          <AlertTriangle className="w-12 h-12 text-yellow-400" />
        </div>
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-yellow-100">
            🚧 This platform is currently under active development 🚧
          </p>
          <div className="text-lg text-yellow-50 space-y-2">
            <p>
              • <strong>Bugs are super obvious</strong> - We&apos;re working on
              fixing them!
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
            Thank you for your patience as we build something amazing for the
            IIT Ropar community! 🚀
          </p>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">About IIT Connect</h1>
      <p className="max-w-xl text-lg text-center mb-8">
        A campus network platform for students by students.
      </p>
      <div className="bg-white/10 rounded-xl p-6 shadow-lg max-w-lg text-base text-center">
        IIT Connect is designed to bring together the IIT Ropar community,
        making it easy to connect, collaborate, and share resources. Whether you
        want to join clubs, chat, share rides, or stay updated on campus events,
        this platform is built for you.
      </div>
    </div>
  );
}
