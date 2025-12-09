// Skill roadmap data for each career path

export interface RoadmapMilestone {
  id: string;
  title: string;
  duration: string;
  skills: string[];
  resources: string[];
  description: string;
}

export interface CareerRoadmap {
  career: string;
  subTrack?: string;
  overview: string;
  totalDuration: string;
  milestones: RoadmapMilestone[];
  keySkills: string[];
  industryInsights: string[];
}

export const roadmaps: Record<string, CareerRoadmap> = {
  "Science": {
    career: "Science",
    overview: "Pursue research and discovery in natural sciences. Develop strong analytical skills, laboratory techniques, and scientific methodology to contribute to advancing human knowledge.",
    totalDuration: "4-6 years (Bachelor's + advanced studies)",
    milestones: [
      {
        id: "foundations",
        title: "Scientific Foundations",
        duration: "2 years",
        description: "Build core knowledge in fundamental sciences",
        skills: [
          "Master biology, chemistry, or physics fundamentals",
          "Learn laboratory safety and techniques",
          "Develop data analysis and statistics skills",
          "Practice scientific writing and documentation"
        ],
        resources: [
          "University science programs",
          "Khan Academy, MIT OpenCourseWare",
          "Laboratory internships"
        ]
      },
      {
        id: "specialization",
        title: "Specialized Research",
        duration: "2-3 years",
        description: "Deep dive into your field of interest",
        skills: [
          "Advanced techniques in chosen field",
          "Research methodology and design",
          "Scientific software (R, Python, MATLAB)",
          "Present at conferences and publish papers"
        ],
        resources: [
          "Master's programs",
          "Research assistant positions",
          "Scientific journals and conferences"
        ]
      },
      {
        id: "career",
        title: "Professional Development",
        duration: "2-4 years",
        description: "Establish yourself in the scientific community",
        skills: [
          "Grant writing and funding acquisition",
          "Mentoring and teaching",
          "Collaboration and networking",
          "Ethics and responsible research"
        ],
        resources: [
          "PhD programs or industry positions",
          "Professional societies",
          "Continuing education courses"
        ]
      }
    ],
    keySkills: [
      "Critical thinking", "Problem-solving", "Attention to detail", "Data analysis",
      "Technical writing", "Curiosity", "Patience"
    ],
    industryInsights: [
      "Growing demand in biotechnology, environmental science, and data science",
      "Competitive field requiring advanced degrees for research positions",
      "Opportunities in academia, government, and private sector R&D"
    ]
  },

  "Medical": {
    career: "Medical",
    overview: "Dedicate yourself to healthcare and helping others. Requires rigorous academic preparation, clinical training, and commitment to lifelong learning in medicine.",
    totalDuration: "8-12 years (depending on specialty)",
    milestones: [
      {
        id: "premed",
        title: "Pre-Medical Education",
        duration: "4 years",
        description: "Complete undergraduate requirements",
        skills: [
          "Excel in biology, chemistry, organic chemistry, physics",
          "Maintain high GPA (3.5+)",
          "Volunteer in healthcare settings",
          "Prepare for MCAT/entrance exams"
        ],
        resources: [
          "Pre-med advising programs",
          "Hospital volunteer opportunities",
          "MCAT prep courses"
        ]
      },
      {
        id: "medschool",
        title: "Medical School",
        duration: "4-6 years",
        description: "Intensive medical education and training",
        skills: [
          "Master human anatomy, physiology, pathology",
          "Clinical rotations in various specialties",
          "Patient interaction and bedside manner",
          "Medical ethics and professionalism"
        ],
        resources: [
          "Accredited medical schools",
          "Clinical clerkships",
          "USMLE/licensing exams"
        ]
      },
      {
        id: "residency",
        title: "Residency & Practice",
        duration: "3-7 years",
        description: "Specialized training and board certification",
        skills: [
          "Specialty-specific procedures and treatments",
          "Patient care management",
          "Emergency response",
          "Continuing medical education"
        ],
        resources: [
          "Residency programs",
          "Board certification exams",
          "Professional medical associations"
        ]
      }
    ],
    keySkills: [
      "Empathy", "Communication", "Critical thinking", "Stress management",
      "Attention to detail", "Teamwork", "Lifelong learning"
    ],
    industryInsights: [
      "High demand with excellent job security",
      "Extremely competitive admission process",
      "Significant educational debt but high earning potential",
      "Emotionally and physically demanding career"
    ]
  },

  "Engineering": {
    career: "Engineering",
    overview: "Design, build, and optimize systems, structures, and technologies. Apply mathematics, physics, and problem-solving to create innovative solutions for real-world challenges.",
    totalDuration: "4-6 years",
    milestones: [
      {
        id: "foundations",
        title: "Engineering Fundamentals",
        duration: "2 years",
        description: "Master core engineering principles",
        skills: [
          "Advanced mathematics (calculus, differential equations)",
          "Physics and mechanics",
          "Technical drawing and CAD software",
          "Programming basics (Python, MATLAB)"
        ],
        resources: [
          "ABET-accredited engineering programs",
          "AutoCAD, SolidWorks tutorials",
          "Engineering competitions"
        ]
      },
      {
        id: "specialization",
        title: "Specialized Engineering",
        duration: "2-3 years",
        description: "Focus on your engineering discipline",
        skills: [
          "Discipline-specific design and analysis",
          "Project management",
          "Team collaboration",
          "Internships and co-op experience"
        ],
        resources: [
          "Specialized courses",
          "Industry internships",
          "Professional engineering projects"
        ]
      },
      {
        id: "professional",
        title: "Professional Engineering",
        duration: "1-2 years",
        description: "Obtain licensure and advance your career",
        skills: [
          "FE and PE exam preparation",
          "Leadership and management",
          "Continuing technical education",
          "Safety and regulatory compliance"
        ],
        resources: [
          "NCEES exams",
          "Professional engineering societies (ASME, IEEE, ASCE)",
          "Industry certifications"
        ]
      }
    ],
    keySkills: [
      "Problem-solving", "Analytical thinking", "Creativity", "Attention to detail",
      "Teamwork", "Project management", "Technical communication"
    ],
    industryInsights: [
      "Diverse career paths across many industries",
      "Strong job growth in renewable energy and automation",
      "Professional licensure enhances career opportunities",
      "Continuous learning required to keep up with technology"
    ]
  },

  "Hospitality": {
    career: "Hospitality",
    overview: "Create exceptional experiences for guests in hotels, restaurants, events, and tourism. Combine customer service excellence with business management skills.",
    totalDuration: "2-4 years",
    milestones: [
      {
        id: "foundations",
        title: "Hospitality Basics",
        duration: "6-12 months",
        description: "Learn customer service and operations",
        skills: [
          "Customer service excellence",
          "Food safety and hygiene certifications",
          "Point-of-sale systems",
          "Basic accounting and budgeting"
        ],
        resources: [
          "Entry-level hospitality positions",
          "Community college hospitality programs",
          "ServSafe certification"
        ]
      },
      {
        id: "management",
        title: "Management Training",
        duration: "1-2 years",
        description: "Develop leadership and operational skills",
        skills: [
          "Staff management and training",
          "Revenue management",
          "Event planning and coordination",
          "Marketing and guest relations"
        ],
        resources: [
          "Bachelor's in hospitality management",
          "Management training programs",
          "Internships at major hotels/restaurants"
        ]
      },
      {
        id: "leadership",
        title: "Leadership & Specialization",
        duration: "2-4 years",
        description: "Advance to senior positions",
        skills: [
          "Strategic planning",
          "Multi-unit operations",
          "Brand development",
          "Crisis management"
        ],
        resources: [
          "Industry conferences",
          "Professional certifications (CHA, CHE)",
          "Executive MBA programs"
        ]
      }
    ],
    keySkills: [
      "Communication", "Leadership", "Problem-solving", "Cultural awareness",
      "Multitasking", "Attention to detail", "Flexibility"
    ],
    industryInsights: [
      "Fast-paced, people-oriented environment",
      "Opportunities for international careers",
      "Work-life balance can be challenging",
      "Growing demand in experience-focused tourism"
    ]
  },

  "Business & Finance": {
    career: "Business & Finance",
    overview: "Manage financial resources, analyze markets, and drive business strategy. Combine quantitative skills with business acumen to create value for organizations.",
    totalDuration: "4-6 years",
    milestones: [
      {
        id: "foundations",
        title: "Business Fundamentals",
        duration: "2 years",
        description: "Build core business knowledge",
        skills: [
          "Accounting principles (GAAP)",
          "Corporate finance and financial analysis",
          "Economics (micro and macro)",
          "Excel and financial modeling"
        ],
        resources: [
          "Business degree programs",
          "Corporate Finance Institute (CFI)",
          "Wall Street Prep"
        ]
      },
      {
        id: "specialization",
        title: "Professional Development",
        duration: "2-3 years",
        description: "Gain expertise and certifications",
        skills: [
          "CFA, CPA, or MBA preparation",
          "Advanced financial analysis",
          "Business strategy",
          "Internships at banks/consulting firms"
        ],
        resources: [
          "CFA Institute, AICPA",
          "Top MBA programs",
          "Investment banking internships"
        ]
      },
      {
        id: "career",
        title: "Career Advancement",
        duration: "2-5 years",
        description: "Build expertise and leadership",
        skills: [
          "Portfolio management",
          "M&A and deal structuring",
          "Client relationship management",
          "Leadership and team building"
        ],
        resources: [
          "Professional certifications",
          "Industry networking events",
          "Executive education"
        ]
      }
    ],
    keySkills: [
      "Analytical thinking", "Attention to detail", "Communication", "Ethics",
      "Decision-making", "Stress management", "Numerical ability"
    ],
    industryInsights: [
      "Highly competitive and fast-paced",
      "Strong earning potential with performance-based compensation",
      "Certifications significantly boost career prospects",
      "Long hours, especially in investment banking"
    ]
  },

  "Information Technology": {
    career: "Information Technology",
    overview: "Build and maintain the digital infrastructure that powers modern organizations. Develop software, secure systems, manage data, and solve technical challenges.",
    totalDuration: "1-4 years",
    milestones: [
      {
        id: "foundations",
        title: "Technical Foundations",
        duration: "3-6 months",
        description: "Master programming and computer science basics",
        skills: [
          "Programming (Python, JavaScript, Java)",
          "Data structures and algorithms",
          "Git version control",
          "Linux/command line basics"
        ],
        resources: [
          "CS50, The Odin Project",
          "LeetCode, HackerRank",
          "freeCodeCamp"
        ]
      },
      {
        id: "specialization",
        title: "Specialized Skills",
        duration: "6-12 months",
        description: "Develop expertise in your chosen area",
        skills: [
          "Web/mobile development or cybersecurity or data science",
          "Frameworks and tools (React, Docker, TensorFlow)",
          "Database management (SQL, NoSQL)",
          "Cloud platforms (AWS, Azure, GCP)"
        ],
        resources: [
          "Udemy, Coursera specializations",
          "Build 3-5 portfolio projects",
          "AWS/Azure certifications"
        ]
      },
      {
        id: "professional",
        title: "Professional Growth",
        duration: "1-3 years",
        description: "Advance skills and build career",
        skills: [
          "System design and architecture",
          "DevOps and CI/CD",
          "Leadership and mentoring",
          "Open-source contributions"
        ],
        resources: [
          "Industry certifications",
          "Tech conferences",
          "GitHub portfolio",
          "Networking and job search"
        ]
      }
    ],
    keySkills: [
      "Problem-solving", "Logical thinking", "Continuous learning", "Debugging",
      "Collaboration", "Attention to detail", "Creativity"
    ],
    industryInsights: [
      "Extremely high demand across all industries",
      "Remote work opportunities abundant",
      "Constant learning required to stay current",
      "Excellent salary growth potential"
    ]
  },

  "Agriculture": {
    career: "Agriculture",
    overview: "Feed the world sustainably through crop production, animal husbandry, and agricultural innovation. Combine traditional farming knowledge with modern technology.",
    totalDuration: "2-4 years",
    milestones: [
      {
        id: "foundations",
        title: "Agricultural Basics",
        duration: "1-2 years",
        description: "Learn fundamental farming practices",
        skills: [
          "Soil science and crop management",
          "Animal husbandry basics",
          "Agricultural equipment operation",
          "Pest and disease management"
        ],
        resources: [
          "Agricultural colleges",
          "Farm apprenticeships",
          "Extension services"
        ]
      },
      {
        id: "modern",
        title: "Modern Agriculture",
        duration: "1-2 years",
        description: "Adopt technology and sustainable practices",
        skills: [
          "Precision agriculture and GPS technology",
          "Sustainable and organic farming",
          "Agricultural business management",
          "Data analysis for yield optimization"
        ],
        resources: [
          "AgriTech courses",
          "Sustainable agriculture certifications",
          "Farm management software"
        ]
      },
      {
        id: "business",
        title: "Agricultural Business",
        duration: "2-4 years",
        description: "Build a sustainable agricultural enterprise",
        skills: [
          "Marketing and distribution",
          "Financial management",
          "Regulatory compliance",
          "Innovation and adaptation"
        ],
        resources: [
          "Small business development centers",
          "Agricultural cooperatives",
          "Industry trade shows"
        ]
      }
    ],
    keySkills: [
      "Problem-solving", "Physical stamina", "Patience", "Adaptability",
      "Business acumen", "Mechanical skills", "Environmental awareness"
    ],
    industryInsights: [
      "Critical industry for food security",
      "Growing interest in sustainable and organic farming",
      "Technology transforming traditional practices",
      "Challenging but rewarding work"
    ]
  },

  "Creative": {
    career: "Creative",
    overview: "Express ideas through art, design, media, and performance. Build a portfolio, develop your unique voice, and contribute to culture and communication.",
    totalDuration: "2-4 years",
    milestones: [
      {
        id: "fundamentals",
        title: "Creative Fundamentals",
        duration: "1-2 years",
        description: "Master basic techniques and theory",
        skills: [
          "Art/design principles (color, composition, typography)",
          "Industry-standard software (Adobe Creative Suite)",
          "Drawing, illustration, or performance basics",
          "Creative process and ideation"
        ],
        resources: [
          "Art schools, design bootcamps",
          "YouTube tutorials, Skillshare",
          "Practice daily, build sketchbook"
        ]
      },
      {
        id: "portfolio",
        title: "Portfolio Development",
        duration: "1-2 years",
        description: "Build professional-quality work",
        skills: [
          "Specialized skills (UI/UX, motion graphics, writing)",
          "Client communication and feedback",
          "Project management",
          "Build 10-15 diverse portfolio pieces"
        ],
        resources: [
          "Freelance platforms (Upwork, Fiverr)",
          "Behance, Dribbble for portfolio",
          "Creative communities and critiques"
        ]
      },
      {
        id: "career",
        title: "Professional Creative",
        duration: "1-3 years",
        description: "Establish your creative career",
        skills: [
          "Personal branding and marketing",
          "Business and contract negotiation",
          "Networking and collaboration",
          "Continuous skill development"
        ],
        resources: [
          "Creative agencies or freelancing",
          "Industry conferences and exhibitions",
          "Online courses and workshops"
        ]
      }
    ],
    keySkills: [
      "Creativity", "Attention to detail", "Communication", "Time management",
      "Adaptability", "Self-motivation", "Technical proficiency"
    ],
    industryInsights: [
      "Highly competitive field",
      "Portfolio quality matters more than credentials",
      "Diverse income streams recommended",
      "Growing demand in digital and UX design"
    ]
  },

  "Architecture": {
    career: "Architecture",
    overview: "Design buildings and spaces that shape how people live, work, and interact. Blend artistic vision with technical knowledge and sustainability principles.",
    totalDuration: "5-7 years",
    milestones: [
      {
        id: "education",
        title: "Architectural Education",
        duration: "5 years",
        description: "Complete professional architecture degree",
        skills: [
          "Design studio and architectural theory",
          "Building systems and structures",
          "CAD and 3D modeling (AutoCAD, Revit, SketchUp)",
          "Architectural history and criticism"
        ],
        resources: [
          "Accredited B.Arch or M.Arch programs",
          "Architecture competitions",
          "Design portfolio development"
        ]
      },
      {
        id: "internship",
        title: "Practical Experience",
        duration: "3+ years",
        description: "Gain real-world experience",
        skills: [
          "Working with clients and consultants",
          "Construction documentation",
          "Building codes and regulations",
          "Project coordination"
        ],
        resources: [
          "Architecture firms internships",
          "AXP (Architectural Experience Program)",
          "Mentorship programs"
        ]
      },
      {
        id: "licensure",
        title: "Licensure & Practice",
        duration: "1-2 years",
        description: "Become a licensed architect",
        skills: [
          "Pass ARE (Architect Registration Exam)",
          "Sustainable design (LEED)",
          "Practice management",
          "Advanced design specialization"
        ],
        resources: [
          "NCARB licensing",
          "Professional development courses",
          "AIA membership"
        ]
      }
    ],
    keySkills: [
      "Creativity", "Technical knowledge", "Attention to detail", "Communication",
      "Project management", "Problem-solving", "Visualization"
    ],
    industryInsights: [
      "Long educational path but rewarding career",
      "Growing focus on sustainable design",
      "Requires both artistic and technical aptitude",
      "Opportunities in residential, commercial, and urban planning"
    ]
  },

  "Community & Social Services": {
    career: "Community & Social Services",
    overview: "Help individuals, families, and communities overcome challenges and improve quality of life. Make a direct positive impact through counseling, advocacy, and support services.",
    totalDuration: "4-6 years",
    milestones: [
      {
        id: "education",
        title: "Foundation Education",
        duration: "4 years",
        description: "Build knowledge in social sciences",
        skills: [
          "Psychology, sociology, human development",
          "Social work theory and practice",
          "Cultural competency",
          "Research methods"
        ],
        resources: [
          "Social work or psychology degree programs",
          "Volunteer with nonprofits",
          "Mental health first aid training"
        ]
      },
      {
        id: "fieldwork",
        title: "Field Experience",
        duration: "1-2 years",
        description: "Gain supervised practical experience",
        skills: [
          "Case management",
          "Counseling and active listening",
          "Crisis intervention",
          "Documentation and reporting"
        ],
        resources: [
          "MSW internships",
          "Community service organizations",
          "Supervised clinical hours"
        ]
      },
      {
        id: "professional",
        title: "Professional Practice",
        duration: "2-4 years",
        description: "Build your career helping others",
        skills: [
          "Licensure (LCSW, LPC, etc.)",
          "Specialized therapy techniques",
          "Advocacy and policy work",
          "Self-care and burnout prevention"
        ],
        resources: [
          "State licensing boards",
          "Continuing education",
          "Professional supervision"
        ]
      }
    ],
    keySkills: [
      "Empathy", "Communication", "Active listening", "Patience",
      "Cultural sensitivity", "Emotional resilience", "Ethics"
    ],
    industryInsights: [
      "High emotional demands but deeply rewarding",
      "Growing need for mental health services",
      "Moderate salary but strong job security",
      "Opportunities in healthcare, schools, government, nonprofits"
    ]
  },

  "Education": {
    career: "Education",
    overview: "Shape future generations through teaching, mentoring, and educational leadership. Inspire students, facilitate learning, and contribute to educational innovation.",
    totalDuration: "4-6 years",
    milestones: [
      {
        id: "preparation",
        title: "Teacher Preparation",
        duration: "4 years",
        description: "Complete teaching degree and certification",
        skills: [
          "Pedagogy and learning theories",
          "Subject matter expertise",
          "Classroom management",
          "Lesson planning and curriculum design"
        ],
        resources: [
          "B.Ed or subject degree + teaching credential",
          "Student teaching experience",
          "State teacher exams"
        ]
      },
      {
        id: "early-career",
        title: "Early Career Teaching",
        duration: "2-3 years",
        description: "Develop teaching practice",
        skills: [
          "Differentiated instruction",
          "Assessment and evaluation",
          "Parent communication",
          "Educational technology integration"
        ],
        resources: [
          "Mentorship programs",
          "Professional learning communities",
          "Teaching conferences"
        ]
      },
      {
        id: "advancement",
        title: "Career Growth",
        duration: "2-4 years",
        description: "Advance as educator or leader",
        skills: [
          "Master's degree or specialization",
          "Leadership and administration",
          "Curriculum development",
          "Educational research"
        ],
        resources: [
          "M.Ed or M.A. programs",
          "National Board Certification",
          "Administrative credentials"
        ]
      }
    ],
    keySkills: [
      "Communication", "Patience", "Creativity", "Adaptability",
      "Organization", "Empathy", "Leadership"
    ],
    industryInsights: [
      "Stable career with pension benefits",
      "Increasing demand for STEM and special education teachers",
      "Work-life balance with school calendar",
      "Opportunities for growth into administration"
    ]
  }
};

// Helper function to get roadmap by career name
export function getRoadmap(careerName: string): CareerRoadmap | undefined {
  return roadmaps[careerName];
}

// Get all available career names
export function getAvailableCareers(): string[] {
  return Object.keys(roadmaps);
}
