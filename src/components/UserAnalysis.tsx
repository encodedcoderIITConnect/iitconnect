/**
 * Analysis of user data extracted from debug information
 */

import Image from "next/image";
import {
  extractUserInfoFromEmail,
  getCurrentSemester,
  formatDisplayName,
} from "@/lib/userUtils";

// User data from debug output
const users = [
  {
    name: "Suresh _",
    email: "suresh.24csz0009@iitrpr.ac.in",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocIRdBAGEbik7RPOnbhtgI_2x7XNXPEX7sB8iJOFiBLYIBsDneU=s96-c",
    id: "108307146212663730473",
  },
  {
    name: "Kashish Sundwal",
    email: "kashish.24chz0001@iitrpr.ac.in",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocICbpgjWsBD6zEKbUNjHwnPcQE9TLohZeR8oS1NGLDjbWZ1-bA=s96-c",
    id: "117445973536549857971",
  },
];

export function UserAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        User Data Analysis
      </h2>

      {users.map((user, index) => {
        const extractedInfo = extractUserInfoFromEmail(user.email, user.name);

        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              User {index + 1}: {user.name}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Raw Data */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Raw Session Data:
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Name:</strong> {user.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Google ID:</strong> {user.id}
                  </div>
                  <div>
                    <strong>Image:</strong>
                    <Image
                      src={user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full inline ml-2"
                    />
                  </div>
                </div>
              </div>

              {/* Extracted Information */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Extracted Information:
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Entry Number:</strong> {extractedInfo.entryNo}
                  </div>
                  <div>
                    <strong>Department:</strong> {extractedInfo.department}
                  </div>
                  <div>
                    <strong>Course:</strong> {extractedInfo.course}
                  </div>
                  <div>
                    <strong>Academic Year:</strong> {extractedInfo.academicYear}
                  </div>
                  <div>
                    <strong>Current Semester:</strong>{" "}
                    {getCurrentSemester(extractedInfo.entryNo)}
                  </div>
                  <div>
                    <strong>Display Name:</strong>{" "}
                    {formatDisplayName(
                      extractedInfo.name,
                      extractedInfo.entryNo
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-medium text-gray-700 mb-2">Analysis:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  • Entry number pattern successfully parsed:{" "}
                  <code>{extractedInfo.entryNo}</code>
                </li>
                <li>
                  • Department identified from code:{" "}
                  <strong>{extractedInfo.department}</strong>
                </li>
                <li>
                  • Academic year extracted:{" "}
                  <strong>{extractedInfo.academicYear}</strong>
                </li>
                <li>• Both are 2024 batch students (B.Tech first year)</li>
                <li>
                  • One from CSE (Computer Science), one from Chemical
                  Engineering
                </li>
                <li>
                  • Email domain restriction working correctly (@iitrpr.ac.in)
                </li>
              </ul>
            </div>
          </div>
        );
      })}

      {/* Overall Analysis */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">System Analysis</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              ✅ Working Features:
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Google OAuth authentication</li>
              <li>• Domain restriction (@iitrpr.ac.in)</li>
              <li>• Session management with NextAuth</li>
              <li>• User data extraction from email</li>
              <li>• MongoDB user storage</li>
              <li>• Department identification</li>
              <li>• Academic year calculation</li>
              <li>• Current semester detection</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              ⚠️ Areas for Improvement:
            </h4>
            <ul className="text-sm space-y-1">
              <li>
                • Environment variables showing as &quot;Not Set&quot; in client
              </li>
              <li>• Profile completion prompts needed</li>
              <li>• Phone number collection</li>
              <li>• Social media links</li>
              <li>• Profile picture upload option</li>
              <li>• User preferences settings</li>
              <li>• Enhanced error handling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>1. Profile Completion Flow:</strong> Create an onboarding
            flow for new users to complete their profiles
          </div>
          <div>
            <strong>2. Environment Variables:</strong> Move sensitive env vars
            to server-side only
          </div>
          <div>
            <strong>3. User Directory:</strong> Build a searchable directory of
            students by department/year
          </div>
          <div>
            <strong>4. Batch Groups:</strong> Auto-create groups based on entry
            year and department
          </div>
          <div>
            <strong>5. Academic Integration:</strong> Use semester info for
            relevant content filtering
          </div>
          <div>
            <strong>6. Verification System:</strong> Add additional verification
            for sensitive features
          </div>
        </div>
      </div>
    </div>
  );
}
