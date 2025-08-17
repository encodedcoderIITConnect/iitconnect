export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 text-white px-4 py-16">
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
