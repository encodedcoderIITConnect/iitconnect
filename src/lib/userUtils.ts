/**
 * Utility functions for user information extraction and management
 */

export interface UserInfo {
  name: string;
  email: string;
  entryNo: string | null;
  department: string;
  course: string;
  academicYear: string;
  image?: string;
  id?: string;
}

/**
 * Extract user information from IIT Ropar email
 * @param email - User's email address
 * @param name - User's name from Google account
 * @returns Extracted user information
 */
export function extractUserInfoFromEmail(
  email: string,
  name: string
): UserInfo {
  const emailParts = email.split("@")[0]; // e.g., "suresh.24csz0009" or "kashish.24chz0001"
  const entryNoMatch = emailParts.match(/\.(\d{2}[a-z]{3}\d{4})$/i); // Match pattern like .24csz0009
  const extractedEntryNo = entryNoMatch ? entryNoMatch[1].toUpperCase() : null;

  let department = "";
  let course = "";
  let academicYear = "";

  if (extractedEntryNo) {
    // Extract year (first 2 digits)
    const year = extractedEntryNo.substring(0, 2);
    academicYear = `20${year}`;

    // Extract department from entry number (e.g., CSZ -> CSE, CHZ -> CHE)
    const deptCode = extractedEntryNo.substring(2, 5); // Extract middle 3 letters
    switch (deptCode.toUpperCase()) {
      case "CSZ":
        department = "Computer Science and Engineering";
        course = "B.Tech";
        break;
      case "CHZ":
        department = "Chemical Engineering";
        course = "B.Tech";
        break;
      case "CEZ":
        department = "Civil Engineering";
        course = "B.Tech";
        break;
      case "EEZ":
        department = "Electrical Engineering";
        course = "B.Tech";
        break;
      case "MEZ":
        department = "Mechanical Engineering";
        course = "B.Tech";
        break;
      case "HSZ":
        department = "Humanities and Social Sciences";
        course = "B.Tech";
        break;
      case "PHZ":
        department = "Physics";
        course = year.startsWith("2") ? "M.Sc/Ph.D" : "B.Sc";
        break;
      case "CHY":
        department = "Chemistry";
        course = year.startsWith("2") ? "M.Sc/Ph.D" : "B.Sc";
        break;
      case "MTZ":
        department = "Mathematics";
        course = year.startsWith("2") ? "M.Sc/Ph.D" : "B.Sc";
        break;
      case "MSZ":
        department = "Materials Science and Engineering";
        course = "B.Tech";
        break;
      default:
        department = "Unknown Department";
        course = "Unknown Course";
    }
  }

  return {
    name,
    email,
    entryNo: extractedEntryNo,
    department,
    course,
    academicYear,
  };
}

/**
 * Get current semester based on entry number and current date
 * @param entryNo - Student's entry number
 * @returns Current semester
 */
export function getCurrentSemester(entryNo: string | null): string {
  if (!entryNo) return "Unknown";

  const year = parseInt(entryNo.substring(0, 2));
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Calculate years passed
  const yearsPassed = currentYear - year;

  // Determine if we're in odd (July-Dec) or even (Jan-June) semester
  const isOddSemester = currentMonth >= 7;

  let semester = yearsPassed * 2;
  if (isOddSemester) {
    semester += 1;
  } else {
    semester += 2;
  }

  // Cap at 8 semesters for B.Tech
  semester = Math.min(semester, 8);

  return `${semester}${getOrdinalSuffix(semester)} Semester`;
}

/**
 * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

/**
 * Format user display name with entry number
 * @param name - User's name
 * @param entryNo - User's entry number
 * @returns Formatted display name
 */
export function formatDisplayName(
  name: string,
  entryNo: string | null
): string {
  if (!entryNo) return name;
  return `${name} (${entryNo})`;
}

/**
 * Get department abbreviation from full department name
 * @param department - Full department name
 * @returns Department abbreviation
 */
export function getDepartmentAbbreviation(department: string): string {
  const deptMap: Record<string, string> = {
    "Computer Science and Engineering": "CSE",
    "Chemical Engineering": "CHE",
    "Civil Engineering": "CE",
    "Electrical Engineering": "EE",
    "Mechanical Engineering": "ME",
    "Humanities and Social Sciences": "HSS",
    Physics: "PHY",
    Chemistry: "CHE",
    Mathematics: "MATH",
    "Materials Science and Engineering": "MSE",
  };

  return deptMap[department] || "UNK";
}
