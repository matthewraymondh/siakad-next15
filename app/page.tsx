"use client";

import { useRouter } from "next/navigation"; // For Next.js 15's router

export default function LandingPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login"); // Redirect to /login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-congress-blue-50">
      <div className="text-center px-8 py-10 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Title */}
        <h1 className="text-5xl font-bold text-congress-blue-700 mb-6">
          SiAkad V2
        </h1>
        <p className="text-xl text-congress-blue-600 mb-6">
          Developed by <span className="font-semibold">Matthew Raymond</span>
        </p>

        {/* Feature Explanation */}
        <div className="text-left space-y-4 mb-8">
          <h2 className="text-2xl font-semibold text-congress-blue-700">
            Welcome to SiAkad V2
          </h2>
          <p className="text-lg text-congress-blue-600">
            SiAkad V2 is an advanced academic management platform designed to
            enhance your academic experience. With SiAkad V2, students can
            easily manage their KRS (Kartu Rencana Studi), view their course
            schedules, and stay organized throughout the semester.
          </p>

          <div className="p-6 bg-congress-blue-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-congress-blue-700">
              KRS Input Feature
            </h3>
            <p className="text-lg text-congress-blue-600">
              The KRS input feature allows students to plan their courses for
              the upcoming semester. Simply log in, select your desired courses,
              and submit your KRS with ease. No more hassle of paperwork –
              everything is managed digitally for your convenience.
            </p>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLoginClick}
          className="px-6 py-3 text-white bg-congress-blue-500 hover:bg-congress-blue-600 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mt-8"
        >
          Login to Start
        </button>
      </div>
    </div>
  );
}
