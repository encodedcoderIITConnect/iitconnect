"use client";

import React, { useState } from "react";
import {
  Download,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Building,
  GraduationCap,
} from "lucide-react";

export default function DownloadFormsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const formCategories = [
    {
      title: "Academic Forms",
      key: "ACADEMIC",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "from-blue-600 to-blue-800",
      forms: [
        {
          name: "Course Registration Form",
          description: "Register for courses each semester",
          url: "https://www.iitrpr.ac.in/academics/course-registration-form.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Grade Appeal Form",
          description: "Submit appeals for grade discrepancies",
          url: "https://www.iitrpr.ac.in/academics/grade-appeal-form.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Transcript Request Form",
          description: "Request official academic transcripts",
          url: "https://www.iitrpr.ac.in/academics/transcript-request-form.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Leave of Absence Form",
          description: "Apply for academic leave of absence",
          url: "https://www.iitrpr.ac.in/academics/leave-absence-form.pdf",
          lastUpdated: "May 2025",
        },
      ],
    },
    {
      title: "Leave Application Forms",
      key: "LEAVE",
      icon: <Calendar className="h-6 w-6" />,
      color: "from-red-600 to-red-800",
      forms: [
        {
          name: "Leave Application Form",
          description: "General leave application form for staff and students",
          url: "https://www.iitrpr.ac.in/forms/leave-application.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Casual Leave Form",
          description: "Apply for casual leave",
          url: "https://www.iitrpr.ac.in/forms/casual-leave.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Medical Leave Form",
          description: "Apply for medical leave with certificate",
          url: "https://www.iitrpr.ac.in/forms/medical-leave.pdf",
          lastUpdated: "Jul 2025",
        },
      ],
    },
    {
      title: "Leave Travel Concession Forms",
      key: "LTC",
      icon: <Calendar className="h-6 w-6" />,
      color: "from-blue-600 to-blue-800",
      forms: [
        {
          name: "LTC Application Form",
          description: "Leave Travel Concession application",
          url: "https://www.iitrpr.ac.in/forms/ltc-application.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "LTC Travel Claim Form",
          description: "Claim reimbursement for LTC travel",
          url: "https://www.iitrpr.ac.in/forms/ltc-claim.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "LTC Encashment Form",
          description: "Encash LTC in lieu of travel",
          url: "https://www.iitrpr.ac.in/forms/ltc-encashment.pdf",
          lastUpdated: "Jun 2025",
        },
      ],
    },
    {
      title: "Reimbursement Forms",
      key: "REIMBURSEMENT",
      icon: <FileText className="h-6 w-6" />,
      color: "from-green-600 to-green-800",
      forms: [
        {
          name: "Medical Reimbursement Form",
          description: "Reimbursement for medical expenses",
          url: "https://drive.google.com/file/d/15whws5u0VB4agVhvzrLtgTr-n8Q3o1tP/view?usp=sharing",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Children Education Reimbursement Form",
          description: "Reimbursement for children's education expenses",
          url: "https://docs.google.com/document/d/12iZGpYVD8d3vp_eFSrITwF7MxH1H8wrQ/edit?usp=sharing&ouid=118327377716687132730&rtpof=true&sd=true",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Telephone Bills Reimbursement",
          description: "Reimbursement of telephone bills",
          url: "https://docs.google.com/document/d/0B_75OlJRHPZXMVEzTWJlMGJNbnc/edit?resourcekey=0-6YKfAWpngvMSgYN6kGsZIQ",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Professional Tour Reimbursement Form",
          description: "Reimbursement for professional tour expenses",
          url: "https://drive.google.com/file/d/0B_75OlJRHPZXZzdRaWpTX3NvYzA/view?usp=sharing&resourcekey=0-N47w8MBDaR1DFGK6TNFH6Q",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Travelling Allowance Reimbursement",
          description: "Travelling allowance reimbursement/settlement",
          url: "https://drive.google.com/file/d/19Yiafy39z0DZhs1RsIz7Cxw1uJcloR5i/view?usp=sharing",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Contingent/Reimbursement/Advance Adjustment Form",
          description: "Contingent, reimbursement and advance adjustment",
          url: "https://drive.google.com/file/d/0B_75OlJRHPZXSWFacVdsUlFucEU/view?usp=sharing&resourcekey=0-0cTmXNAHRyMEJOdzvD1xZA",
          lastUpdated: "Jul 2025",
        },
        {
          name: "CPDA Reimbursement Form",
          description: "Reimbursement for CPDA expenses",
          url: "https://drive.google.com/file/d/1kZ5VFDD6a-C_dx6ov9_TVfJc7kt8lwmV/view?usp=sharing",
          lastUpdated: "Jun 2025",
        },
      ],
    },
    {
      title: "Administrative Forms",
      key: "ADMIN",
      icon: <Building className="h-6 w-6" />,
      color: "from-purple-600 to-purple-800",
      forms: [
        {
          name: "ID Card Replacement Form",
          description: "Apply for new/replacement student ID card",
          url: "https://www.iitrpr.ac.in/admin/id-card-replacement-form.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Address Change Form",
          description: "Update your contact information",
          url: "https://www.iitrpr.ac.in/admin/address-change-form.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Fee Payment Receipt Form",
          description: "Request duplicate fee payment receipts",
          url: "https://www.iitrpr.ac.in/admin/fee-receipt-form.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Bonafide Certificate Request",
          description: "Apply for student bonafide certificate",
          url: "https://www.iitrpr.ac.in/admin/bonafide-certificate-form.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "No Dues Certificate",
          description: "Apply for no dues certificate",
          url: "https://www.iitrpr.ac.in/admin/no-dues-certificate.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Character Certificate Request",
          description: "Apply for character certificate",
          url: "https://www.iitrpr.ac.in/admin/character-certificate.pdf",
          lastUpdated: "Jun 2025",
        },
      ],
    },
    {
      title: "Hostel & Accommodation",
      key: "HOSTEL",
      icon: <Building className="h-6 w-6" />,
      color: "from-orange-600 to-orange-800",
      forms: [
        {
          name: "Hostel Admission Form",
          description: "Apply for hostel accommodation",
          url: "https://www.iitrpr.ac.in/hostel/admission-form.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Room Change Request Form",
          description: "Request change in hostel room allocation",
          url: "https://www.iitrpr.ac.in/hostel/room-change-form.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Accommodation Form for Project Staff/JRF/SRF/RA/IPDF",
          description:
            "Accommodation form for research scholars and project staff",
          url: "https://www.iitrpr.ac.in/hostel/project-accommodation.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Guest Room Booking Form",
          description: "Book guest room at hostel",
          url: "https://www.iitrpr.ac.in/hostel/guest-room-booking.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Hostel Security Refund Form",
          description: "Apply for hostel security deposit refund",
          url: "https://www.iitrpr.ac.in/hostel/security-refund.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Mess Security Refund Form",
          description: "Apply for mess security deposit refund",
          url: "https://www.iitrpr.ac.in/hostel/mess-security-refund.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Day Scholar Form",
          description: "Apply for day scholar status",
          url: "https://www.iitrpr.ac.in/hostel/day-scholar-form.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Declaration Form for Leaving Campus",
          description:
            "Declaration for leaving outstation/overnight from campus",
          url: "https://drive.google.com/file/d/1SVeYIyXEHAZsmYoaNUSaeKFAZe9RqSv7/view?usp=sharing",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Undertaking Form",
          description: "General undertaking form for hostel matters",
          url: "https://drive.google.com/file/d/1nMZNq5aAI7XmpiLpj0gg3vfsVkgAZsYw/view?usp=sharing",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Married Accommodation Application",
          description: "Application for married accommodation",
          url: "https://drive.google.com/file/d/13JkOiYxOnZyPL5peTSbh4Xs10QL3d2OQ/view?usp=sharing",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Hostel Complaint Form",
          description: "Submit hostel-related complaints",
          url: "https://www.iitrpr.ac.in/hostel/complaint-form.pdf",
          lastUpdated: "Jul 2025",
        },
      ],
    },
    {
      title: "Research & Projects",
      key: "RESEARCH",
      icon: <FileText className="h-6 w-6" />,
      color: "from-teal-600 to-teal-800",
      forms: [
        {
          name: "Research Proposal Submission",
          description: "Submit research project proposals",
          url: "https://www.iitrpr.ac.in/research/proposal-form.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Ethics Approval Form",
          description: "Apply for research ethics committee approval",
          url: "https://www.iitrpr.ac.in/research/ethics-approval-form.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Conference Travel Grant Form",
          description: "Apply for conference travel funding",
          url: "https://www.iitrpr.ac.in/research/travel-grant-form.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Publication Incentive Form",
          description: "Claim incentives for research publications",
          url: "https://www.iitrpr.ac.in/research/publication-incentive-form.pdf",
          lastUpdated: "Aug 2025",
        },
      ],
    },
    {
      title: "Student Forms (UG/PG/PhD)",
      key: "STUDENT",
      icon: <User className="h-6 w-6" />,
      color: "from-indigo-600 to-indigo-800",
      forms: [
        {
          name: "Student Registration Form",
          description: "Registration form for new students",
          url: "https://www.iitrpr.ac.in/student/registration-form.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Thesis Submission Form",
          description: "Form for thesis submission (PG/PhD)",
          url: "https://www.iitrpr.ac.in/student/thesis-submission.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Dissertation Defense Form",
          description: "Schedule dissertation defense",
          url: "https://www.iitrpr.ac.in/student/defense-form.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Course Withdrawal Form",
          description: "Withdraw from registered courses",
          url: "https://www.iitrpr.ac.in/student/course-withdrawal.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Degree Certificate Application",
          description: "Apply for degree certificate",
          url: "https://www.iitrpr.ac.in/student/degree-certificate.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Migration Certificate Request",
          description: "Apply for migration certificate",
          url: "https://www.iitrpr.ac.in/student/migration-certificate.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Provisional Certificate Request",
          description: "Apply for provisional certificate",
          url: "https://www.iitrpr.ac.in/student/provisional-certificate.pdf",
          lastUpdated: "Jul 2025",
        },
      ],
    },
    {
      title: "Booking Forms",
      key: "BOOKING",
      icon: <Calendar className="h-6 w-6" />,
      color: "from-pink-600 to-pink-800",
      forms: [
        {
          name: "Guest House Booking Form",
          description: "Book guest house for visitors",
          url: "https://www.iitrpr.ac.in/guesthouse/booking-form.pdf",
          lastUpdated: "Jun 2025",
        },
        {
          name: "Guest House Catering Services",
          description: "Requisition form for guest house catering services",
          url: "https://docs.google.com/document/d/1mkSlHfC9PVCfwVFgm-E4fwlQ1Acnt4AM/edit?usp=share_link&ouid=118327377716687132730&rtpof=true&sd=true",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Hall/Auditorium Booking",
          description: "Book halls and auditoriums for events",
          url: "https://www.iitrpr.ac.in/booking/hall-booking.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "Vehicle Booking Form",
          description: "Book institute vehicles for official use",
          url: "https://www.iitrpr.ac.in/booking/vehicle-booking.pdf",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Equipment Booking Form",
          description: "Book institute equipment and facilities",
          url: "https://www.iitrpr.ac.in/booking/equipment-booking.pdf",
          lastUpdated: "Jun 2025",
        },
      ],
    },
    {
      title: "Internship Forms",
      key: "INTERNSHIP",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "from-cyan-600 to-cyan-800",
      forms: [
        {
          name: "Internship Application Form",
          description: "Apply for internship programs",
          url: "https://www.iitrpr.ac.in/internship/application-form.pdf",
          lastUpdated: "Aug 2025",
        },
        {
          name: "No Dues Certificate for Internship",
          description: "No dues certificate for internship students",
          url: "https://docs.google.com/document/d/0B_75OlJRHPZXUW9kRGJRMlFMd0E/edit?usp=sharing&ouid=118327377716687132730&resourcekey=0-WQizDRMhkUFuyX7yg0l3XQ&rtpof=true&sd=true",
          lastUpdated: "Jul 2025",
        },
        {
          name: "Internship Completion Certificate",
          description: "Apply for internship completion certificate",
          url: "https://www.iitrpr.ac.in/internship/completion-certificate.pdf",
          lastUpdated: "Jun 2025",
        },
      ],
    },
    {
      title: "Hindi Forms / हिंदी फॉर्म",
      key: "HINDI",
      icon: <FileText className="h-6 w-6" />,
      color: "from-amber-600 to-amber-800",
      forms: [
        {
          name: "चिकित्सा प्रतिपूर्ति फॉर्म (Medical Reimbursement Form)",
          description: "चिकित्सा खर्च की प्रतिपूर्ति के लिए फॉर्म",
          url: "https://drive.google.com/file/d/15whws5u0VB4agVhvzrLtgTr-n8Q3o1tP/view?usp=sharing",
          lastUpdated: "Aug 2025",
        },
        {
          name: "बच्चों की शिक्षा प्रतिपूर्ति फॉर्म (Children Education Reimbursement)",
          description: "बच्चों की शिक्षा खर्च की प्रतिपूर्ति के लिए",
          url: "https://docs.google.com/document/d/12iZGpYVD8d3vp_eFSrITwF7MxH1H8wrQ/edit?usp=sharing&ouid=118327377716687132730&rtpof=true&sd=true",
          lastUpdated: "Jul 2025",
        },
        {
          name: "टेलीफोन बिल प्रतिपूर्ति (Telephone Bills Reimbursement)",
          description: "टेलीफोन बिल की प्रतिपूर्ति के लिए फॉर्म",
          url: "https://docs.google.com/document/d/0B_75OlJRHPZXMVEzTWJlMGJNbnc/edit?resourcekey=0-6YKfAWpngvMSgYN6kGsZIQ",
          lastUpdated: "Jul 2025",
        },
        {
          name: "व्यावसायिक यात्रा प्रतिपूर्ति (Professional Tour Reimbursement)",
          description: "व्यावसायिक यात्रा खर्च की प्रतिपूर्ति के लिए",
          url: "https://drive.google.com/file/d/0B_75OlJRHPZXZzdRaWpTX3NvYzA/view?usp=sharing&resourcekey=0-N47w8MBDaR1DFGK6TNFH6Q",
          lastUpdated: "Jun 2025",
        },
        {
          name: "यात्रा भत्ता प्रतिपूर्ति (Travelling Allowance Reimbursement)",
          description: "यात्रा भत्ता प्रतिपूर्ति/निपटान",
          url: "https://drive.google.com/file/d/19Yiafy39z0DZhs1RsIz7Cxw1uJcloR5i/view?usp=sharing",
          lastUpdated: "Aug 2025",
        },
        {
          name: "आकस्मिक/प्रतिपूर्ति/अग्रिम समायोजन फॉर्म",
          description: "आकस्मिक, प्रतिपूर्ति और अग्रिम समायोजन फॉर्म",
          url: "https://drive.google.com/file/d/0B_75OlJRHPZXSWFacVdsUlFucEU/view?usp=sharing&resourcekey=0-0cTmXNAHRyMEJOdzvD1xZA",
          lastUpdated: "Jul 2025",
        },
        {
          name: "CPDA प्रतिपूर्ति फॉर्म",
          description: "CPDA खर्च की प्रतिपूर्ति के लिए",
          url: "https://drive.google.com/file/d/1kZ5VFDD6a-C_dx6ov9_TVfJc7kt8lwmV/view?usp=sharing",
          lastUpdated: "Jun 2025",
        },
      ],
    },
  ];

  // Category names for filter buttons
  const categoryNames = {
    ACADEMIC: "Academic Forms",
    LEAVE: "Leave Applications",
    LTC: "Leave Travel Concession",
    REIMBURSEMENT: "Reimbursement Forms",
    ADMIN: "Administrative Forms",
    HOSTEL: "Hostel & Accommodation",
    RESEARCH: "Research & Projects",
    STUDENT: "Student Forms (UG/PG/PhD)",
    BOOKING: "Booking Forms",
    INTERNSHIP: "Internship Forms",
    HINDI: "Hindi Forms / हिंदी फॉर्म",
  };

  // Filter categories based on selected category
  const filteredCategories =
    selectedCategory === "ALL"
      ? formCategories
      : formCategories.filter((category) => category.key === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 py-10 px-4 pb-20 lg:pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Download Forms
          </h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
            Access and download all official forms and documents required for
            various academic and administrative processes at IIT Ropar.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === "ALL"
                  ? "bg-white text-blue-600 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              All Categories
            </button>
            {Object.entries(categoryNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === key
                    ? "bg-white text-blue-600 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-6">
                <div
                  className={`bg-gradient-to-r ${category.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mr-4`}
                >
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {category.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.forms.map((form, formIndex) => (
                  <div
                    key={formIndex}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-gray-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {form.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {form.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Updated: {form.lastUpdated}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={form.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 bg-gradient-to-r ${category.color} text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2 text-sm`}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                      <a
                        href={form.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Important Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Form Submission Guidelines
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Fill all forms completely and legibly</li>
                <li>• Attach required documents and certificates</li>
                <li>• Submit within specified deadlines</li>
                <li>• Keep copies of submitted forms for records</li>
                <li>• Use blue or black ink for handwritten forms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Need Help?
              </h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>• Contact Academic Office: academics@iitrpr.ac.in</p>
                <p>• Administrative Support: admin@iitrpr.ac.in</p>
                <p>• Hostel Office: hostel@iitrpr.ac.in</p>
                <p>• Research Office: research@iitrpr.ac.in</p>
                <p>• Phone: +91-1881-242000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
