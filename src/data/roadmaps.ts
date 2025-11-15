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
  "Software Engineering": {
    career: "Software Engineering",
    overview: "Build expertise in designing, developing, and maintaining software systems. Master programming fundamentals, system design, and modern development practices.",
    totalDuration: "12-18 months intensive learning",
    milestones: [
      {
        id: "foundations",
        title: "Programming Foundations",
        duration: "3-4 months",
        description: "Master core programming concepts and data structures",
        skills: [
          "Learn Python/JavaScript fundamentals",
          "Understand data structures (arrays, linked lists, trees, graphs)",
          "Practice algorithms (sorting, searching, recursion)",
          "Git version control basics"
        ],
        resources: [
          "FreeCodeCamp, Codecademy",
          "LeetCode Easy problems",
          "CS50 Introduction to Computer Science"
        ]
      },
      {
        id: "web-dev",
        title: "Web Development",
        duration: "4-5 months",
        description: "Build full-stack web applications",
        skills: [
          "Frontend: HTML, CSS, React/Vue",
          "Backend: Node.js/Python Flask/Django",
          "Database: SQL (PostgreSQL/MySQL), MongoDB",
          "RESTful APIs and HTTP protocols"
        ],
        resources: [
          "The Odin Project",
          "Full Stack Open (University of Helsinki)",
          "Build 3-5 portfolio projects"
        ]
      },
      {
        id: "advanced",
        title: "System Design & Best Practices",
        duration: "3-4 months",
        description: "Learn to build scalable, maintainable systems",
        skills: [
          "Design patterns and SOLID principles",
          "System architecture and scalability",
          "Testing (unit, integration, E2E)",
          "CI/CD pipelines and DevOps basics"
        ],
        resources: [
          "Designing Data-Intensive Applications",
          "System Design Primer (GitHub)",
          "Contribute to open-source projects"
        ]
      },
      {
        id: "specialization",
        title: "Specialization & Job Prep",
        duration: "2-3 months",
        description: "Focus on your chosen track and interview preparation",
        skills: [
          "Deep dive into Frontend/Backend/Mobile/DevOps",
          "LeetCode Medium/Hard problems",
          "Build capstone project",
          "Mock interviews and resume building"
        ],
        resources: [
          "Cracking the Coding Interview",
          "Pramp/InterviewBit for mock interviews",
          "GitHub portfolio with 5+ projects"
        ]
      }
    ],
    keySkills: [
      "Problem-solving", "Logical thinking", "Debugging", "Collaboration",
      "Continuous learning", "Code review", "Documentation"
    ],
    industryInsights: [
      "Software engineers typically earn $80k-$150k+ annually",
      "Remote work is common in tech industry",
      "Continuous learning is essential - new frameworks emerge constantly",
      "Networking and contributing to open-source boosts career growth"
    ]
  },
  "Data & AI": {
    career: "Data & AI",
    overview: "Master data analysis, machine learning, and AI systems. Learn to extract insights from data and build intelligent applications.",
    totalDuration: "14-20 months intensive learning",
    milestones: [
      {
        id: "foundations",
        title: "Math & Programming Foundations",
        duration: "4-5 months",
        description: "Build strong mathematical and coding foundation",
        skills: [
          "Python programming (NumPy, Pandas)",
          "Statistics and probability",
          "Linear algebra and calculus basics",
          "Data visualization (Matplotlib, Seaborn)"
        ],
        resources: [
          "Khan Academy (Statistics, Linear Algebra)",
          "Python for Data Analysis (book)",
          "Kaggle Learn courses"
        ]
      },
      {
        id: "ml-basics",
        title: "Machine Learning Fundamentals",
        duration: "5-6 months",
        description: "Learn core ML algorithms and techniques",
        skills: [
          "Supervised learning (regression, classification)",
          "Unsupervised learning (clustering, PCA)",
          "Model evaluation and validation",
          "Scikit-learn and feature engineering"
        ],
        resources: [
          "Andrew Ng's Machine Learning (Coursera)",
          "Hands-On Machine Learning (book)",
          "Kaggle competitions (beginner tier)"
        ]
      },
      {
        id: "deep-learning",
        title: "Deep Learning & AI",
        duration: "4-5 months",
        description: "Master neural networks and modern AI techniques",
        skills: [
          "Neural networks and backpropagation",
          "CNNs for computer vision",
          "RNNs/Transformers for NLP",
          "TensorFlow/PyTorch frameworks"
        ],
        resources: [
          "Deep Learning Specialization (Coursera)",
          "Fast.ai courses",
          "Build 2-3 deep learning projects"
        ]
      },
      {
        id: "production",
        title: "ML Engineering & Deployment",
        duration: "3-4 months",
        description: "Learn to deploy and maintain ML systems in production",
        skills: [
          "MLOps and model deployment",
          "Cloud platforms (AWS/GCP/Azure)",
          "Docker and containerization",
          "API development for ML models"
        ],
        resources: [
          "Full Stack Deep Learning",
          "Made With ML",
          "Build end-to-end ML pipeline project"
        ]
      }
    ],
    keySkills: [
      "Critical thinking", "Statistical reasoning", "Experimentation",
      "Data storytelling", "Programming", "Domain expertise"
    ],
    industryInsights: [
      "Data Scientists earn $90k-$180k+ annually",
      "High demand for ML engineers across industries",
      "PhD not required - many successful practitioners have bootcamp/self-taught backgrounds",
      "Portfolio of projects is crucial for landing first role"
    ]
  },
  "Design & Media": {
    career: "Design & Media",
    overview: "Develop visual design skills, creative thinking, and technical proficiency in design tools. Create compelling user experiences and visual content.",
    totalDuration: "10-16 months intensive learning",
    milestones: [
      {
        id: "foundations",
        title: "Design Fundamentals",
        duration: "3-4 months",
        description: "Master core design principles and tools",
        skills: [
          "Color theory and typography",
          "Composition and visual hierarchy",
          "Adobe Creative Suite (Photoshop, Illustrator)",
          "Figma/Sketch for UI design"
        ],
        resources: [
          "Design for Hackers (book)",
          "Refactoring UI",
          "Daily UI challenges"
        ]
      },
      {
        id: "ui-ux",
        title: "UI/UX Design",
        duration: "4-5 months",
        description: "Learn user-centered design and research",
        skills: [
          "User research and personas",
          "Wireframing and prototyping",
          "Interaction design patterns",
          "Usability testing and iteration"
        ],
        resources: [
          "Interaction Design Foundation",
          "Don't Make Me Think (book)",
          "Redesign 5 existing apps/websites"
        ]
      },
      {
        id: "specialization",
        title: "Creative Specialization",
        duration: "3-4 months",
        description: "Focus on your chosen design track",
        skills: [
          "Product/UI: Design systems and component libraries",
          "Graphic: Branding and print design",
          "3D/CGI: Blender/Cinema 4D mastery",
          "Motion: After Effects and animation"
        ],
        resources: [
          "Advanced tool-specific tutorials",
          "Dribbble/Behance for inspiration",
          "Build comprehensive portfolio"
        ]
      },
      {
        id: "professional",
        title: "Portfolio & Professional Skills",
        duration: "2-3 months",
        description: "Build portfolio and learn business skills",
        skills: [
          "Case studies and storytelling",
          "Client communication",
          "Freelancing basics or job search",
          "HTML/CSS for designers"
        ],
        resources: [
          "Create 8-10 portfolio pieces",
          "Design portfolio website",
          "Network on design communities"
        ]
      }
    ],
    keySkills: [
      "Creativity", "Visual communication", "Attention to detail",
      "User empathy", "Feedback iteration", "Trend awareness"
    ],
    industryInsights: [
      "UI/UX Designers earn $60k-$130k+ annually",
      "Strong portfolio matters more than degree",
      "Freelancing is common - build client base early",
      "Stay updated with design trends and tools"
    ]
  },
  "Medicine & Health": {
    career: "Medicine & Health",
    overview: "Pursue a career in healthcare through rigorous academic and clinical training. Develop medical knowledge, patient care skills, and clinical judgment.",
    totalDuration: "8-12 years formal education + training",
    milestones: [
      {
        id: "pre-med",
        title: "Pre-Medical Education",
        duration: "4 years (Bachelor's)",
        description: "Complete undergraduate degree with medical prerequisites",
        skills: [
          "Biology, Chemistry, Physics, Organic Chemistry",
          "Strong GPA (3.5+) maintenance",
          "Clinical volunteering (200+ hours)",
          "MCAT preparation (aim for 510+)"
        ],
        resources: [
          "University pre-med programs",
          "MCAT prep courses (Kaplan, Princeton Review)",
          "Shadow physicians in various specialties"
        ]
      },
      {
        id: "med-school",
        title: "Medical School",
        duration: "4 years",
        description: "MD or DO degree with clinical rotations",
        skills: [
          "Years 1-2: Basic sciences (anatomy, physiology, pathology)",
          "Years 3-4: Clinical rotations (internal medicine, surgery, pediatrics)",
          "USMLE Step 1 & 2 preparation",
          "Develop bedside manner and patient communication"
        ],
        resources: [
          "Accredited medical schools",
          "First Aid for USMLE",
          "Clinical skills workshops"
        ]
      },
      {
        id: "residency",
        title: "Residency Training",
        duration: "3-7 years (specialty-dependent)",
        description: "Specialized training in chosen medical field",
        skills: [
          "Specialty-specific medical procedures",
          "Patient management and decision-making",
          "Research and evidence-based medicine",
          "Teaching and mentoring junior residents"
        ],
        resources: [
          "Hospital residency programs",
          "Board exam preparation",
          "Medical conferences and journals"
        ]
      },
      {
        id: "practice",
        title: "Board Certification & Practice",
        duration: "Ongoing",
        description: "Obtain board certification and begin independent practice",
        skills: [
          "Pass specialty board exams",
          "Maintain medical license (CME credits)",
          "Practice management (if private practice)",
          "Continuous medical education"
        ],
        resources: [
          "Board certification exams",
          "Medical associations",
          "Continuing education courses"
        ]
      }
    ],
    keySkills: [
      "Scientific knowledge", "Clinical reasoning", "Empathy and compassion",
      "Communication", "Resilience", "Ethical judgment", "Lifelong learning"
    ],
    industryInsights: [
      "Physicians earn $200k-$400k+ annually (varies by specialty)",
      "Very demanding career - long hours and high stress",
      "Massive student debt is common ($200k-$500k)",
      "Extremely rewarding - directly saving and improving lives",
      "Consider PA or NP paths for shorter training (2-3 years post-bachelor's)"
    ]
  },
  "Business & Finance": {
    career: "Business & Finance",
    overview: "Build expertise in financial analysis, business strategy, and operations. Learn to drive business value and make data-driven decisions.",
    totalDuration: "12-18 months intensive learning + experience",
    milestones: [
      {
        id: "foundations",
        title: "Business & Finance Fundamentals",
        duration: "3-4 months",
        description: "Master core business and financial concepts",
        skills: [
          "Accounting basics (financial statements, GAAP)",
          "Corporate finance (time value of money, valuation)",
          "Excel proficiency (formulas, pivot tables, macros)",
          "Business strategy frameworks"
        ],
        resources: [
          "Khan Academy Finance",
          "Corporate Finance Institute (CFI)",
          "Wall Street Prep Excel courses"
        ]
      },
      {
        id: "analysis",
        title: "Financial Analysis & Modeling",
        duration: "4-5 months",
        description: "Learn to analyze companies and build financial models",
        skills: [
          "Financial statement analysis",
          "3-statement modeling (DCF, LBO, M&A)",
          "Investment analysis and portfolio theory",
          "Data analysis (SQL, Python/R basics)"
        ],
        resources: [
          "Financial Modeling courses (Wall Street Prep, Breaking Into Wall Street)",
          "CFA Level 1 materials",
          "Build 5+ financial models"
        ]
      },
      {
        id: "specialization",
        title: "Track Specialization",
        duration: "3-4 months",
        description: "Deep dive into your chosen finance track",
        skills: [
          "Investment Banking: M&A analysis, pitch books",
          "Trading: Technical analysis, market microstructure",
          "Corporate Finance: Budgeting, FP&A",
          "Accounting: CPA exam preparation"
        ],
        resources: [
          "Track-specific certifications (CPA, CFA, FRM)",
          "Industry publications (WSJ, Bloomberg)",
          "Networking events and informational interviews"
        ]
      },
      {
        id: "professional",
        title: "Certifications & Career Launch",
        duration: "3-5 months",
        description: "Earn credentials and land your first role",
        skills: [
          "CFA/CPA/FRM exam preparation",
          "Excel/PowerPoint mastery",
          "Business case interview prep",
          "Professional networking (LinkedIn, alumni)"
        ],
        resources: [
          "CFA Institute, AICPA resources",
          "Case in Point (consulting)",
          "Finance internships or entry-level roles"
        ]
      }
    ],
    keySkills: [
      "Analytical thinking", "Quantitative skills", "Attention to detail",
      "Communication", "Ethical judgment", "Time management", "Stress tolerance"
    ],
    industryInsights: [
      "Entry-level analysts earn $60k-$100k; senior roles $150k-$300k+",
      "Investment banking: long hours (80-100/week) but high pay",
      "CPA/CFA significantly boost earning potential",
      "Networking is crucial - finance is a relationship-driven industry",
      "MBA can accelerate career but not always necessary"
    ]
  },
  "Core Engineering": {
    career: "Core Engineering",
    overview: "Develop expertise in mechanical, electrical, civil, or other core engineering disciplines. Master engineering fundamentals, design, and problem-solving.",
    totalDuration: "4 years degree + 2-3 years specialization",
    milestones: [
      {
        id: "foundations",
        title: "Engineering Fundamentals",
        duration: "Years 1-2 (Bachelor's)",
        description: "Build strong foundation in math, physics, and core engineering",
        skills: [
          "Calculus, differential equations, linear algebra",
          "Physics (mechanics, thermodynamics, E&M)",
          "Engineering drawing and CAD basics",
          "Programming (MATLAB, Python)"
        ],
        resources: [
          "University engineering programs",
          "MIT OpenCourseWare",
          "Khan Academy Engineering"
        ]
      },
      {
        id: "specialization",
        title: "Discipline Specialization",
        duration: "Years 3-4 (Bachelor's)",
        description: "Deep dive into your chosen engineering field",
        skills: [
          "Mechanical: Machine design, fluid mechanics, heat transfer",
          "Electrical: Circuit theory, signals, power systems",
          "Civil: Structural analysis, geotechnical, construction",
          "Senior design project"
        ],
        resources: [
          "Discipline-specific textbooks",
          "Engineering internships",
          "Student engineering societies (ASME, IEEE)"
        ]
      },
      {
        id: "professional",
        title: "Professional Development",
        duration: "Post-graduation",
        description: "Gain licensure and industry experience",
        skills: [
          "FE (Fundamentals of Engineering) exam",
          "Entry-level engineering role",
          "PE (Professional Engineer) exam prep (after 4 years)",
          "Industry-specific tools and software"
        ],
        resources: [
          "NCEES FE/PE exam resources",
          "Engineering job boards",
          "Professional engineering societies"
        ]
      },
      {
        id: "advanced",
        title: "Mastery & Leadership",
        duration: "5+ years experience",
        description: "Become a technical expert or move into leadership",
        skills: [
          "Advanced analysis and simulation tools",
          "Project management and team leadership",
          "Innovation and R&D",
          "Consider Master's/PhD for research roles"
        ],
        resources: [
          "Graduate programs",
          "PMP certification",
          "Industry conferences"
        ]
      }
    ],
    keySkills: [
      "Analytical thinking", "Mathematical proficiency", "Problem-solving",
      "Attention to detail", "Technical communication", "Teamwork"
    ],
    industryInsights: [
      "Entry-level engineers earn $60k-$80k; senior $100k-$150k+",
      "PE license significantly boosts career options",
      "Strong job security and global opportunities",
      "Manufacturing, construction, energy, and tech are major employers"
    ]
  },
  "Marketing & Communications": {
    career: "Marketing & Communications",
    overview: "Master the art of storytelling, brand building, and audience engagement. Learn digital marketing, content creation, and strategic communication.",
    totalDuration: "10-14 months intensive learning",
    milestones: [
      {
        id: "foundations",
        title: "Marketing Fundamentals",
        duration: "3-4 months",
        description: "Understand marketing principles and consumer psychology",
        skills: [
          "Marketing strategy and 4Ps framework",
          "Consumer behavior and market research",
          "Copywriting basics",
          "Google Analytics fundamentals"
        ],
        resources: [
          "Google Digital Marketing Certification",
          "HubSpot Academy (free courses)",
          "Made to Stick (book)"
        ]
      },
      {
        id: "digital",
        title: "Digital Marketing Mastery",
        duration: "4-5 months",
        description: "Master digital channels and tools",
        skills: [
          "SEO and SEM (Google Ads)",
          "Social media marketing (Meta, LinkedIn, TikTok)",
          "Email marketing and automation",
          "Content marketing and blogging"
        ],
        resources: [
          "Moz SEO Learning Center",
          "Meta Blueprint courses",
          "Build and grow your own blog/social"
        ]
      },
      {
        id: "creative",
        title: "Creative & Analytics",
        duration: "3-4 months",
        description: "Combine creativity with data-driven insights",
        skills: [
          "Graphic design basics (Canva, Adobe)",
          "Video editing and content creation",
          "A/B testing and conversion optimization",
          "Marketing analytics and reporting"
        ],
        resources: [
          "Canva Design School",
          "YouTube Creator Academy",
          "Google Analytics certification"
        ]
      },
      {
        id: "professional",
        title: "Portfolio & Specialization",
        duration: "2-3 months",
        description: "Build portfolio and choose your marketing track",
        skills: [
          "Create 5-10 marketing campaigns (personal or freelance)",
          "Specialize: Brand, Growth, Content, or PR",
          "Networking and personal branding",
          "Interview preparation"
        ],
        resources: [
          "Build portfolio website",
          "LinkedIn optimization",
          "Marketing internships or freelance gigs"
        ]
      }
    ],
    keySkills: [
      "Creativity", "Communication", "Data analysis", "Storytelling",
      "Adaptability", "Trend awareness", "Customer empathy"
    ],
    industryInsights: [
      "Entry-level marketers earn $40k-$60k; senior roles $80k-$150k+",
      "Portfolio and results matter more than degree",
      "Fast-paced field with constantly evolving tools",
      "Freelancing and agency work are common paths"
    ]
  },
  "Entrepreneurship & Management": {
    career: "Entrepreneurship & Management",
    overview: "Learn to build businesses, lead teams, and drive organizational success. Develop strategic thinking, leadership, and execution skills.",
    totalDuration: "12-24 months + ongoing",
    milestones: [
      {
        id: "foundations",
        title: "Business Fundamentals",
        duration: "3-4 months",
        description: "Understand how businesses work",
        skills: [
          "Business model canvas and lean startup",
          "Basic accounting and finance",
          "Market research and validation",
          "Product-market fit"
        ],
        resources: [
          "The Lean Startup (book)",
          "Y Combinator Startup School",
          "Coursera: Wharton Business Foundations"
        ]
      },
      {
        id: "leadership",
        title: "Leadership & Operations",
        duration: "4-5 months",
        description: "Learn to lead teams and manage operations",
        skills: [
          "Team building and hiring",
          "Project management (Agile, Scrum)",
          "Operations and process optimization",
          "Communication and negotiation"
        ],
        resources: [
          "Leaders Eat Last (book)",
          "PMP or Scrum certification",
          "Join or start a side project"
        ]
      },
      {
        id: "growth",
        title: "Growth & Strategy",
        duration: "4-5 months",
        description: "Master scaling and strategic planning",
        skills: [
          "Growth hacking and user acquisition",
          "Strategic planning frameworks",
          "Fundraising and investor pitching",
          "Financial modeling and metrics"
        ],
        resources: [
          "Traction (book)",
          "YC's How to Start a Startup",
          "Build and launch your own product"
        ]
      },
      {
        id: "execution",
        title: "Launch & Iterate",
        duration: "Ongoing",
        description: "Execute, measure, learn, and improve",
        skills: [
          "MVP development and testing",
          "Customer development interviews",
          "Metrics tracking (CAC, LTV, churn)",
          "Pivoting and adaptation"
        ],
        resources: [
          "Launch actual product/service",
          "Join startup accelerators",
          "Network with entrepreneurs"
        ]
      }
    ],
    keySkills: [
      "Visionary thinking", "Resilience", "Decision-making",
      "Resourcefulness", "Communication", "Risk tolerance", "Adaptability"
    ],
    industryInsights: [
      "Income highly variable - $0 to millions",
      "High failure rate (90% of startups fail)",
      "Requires comfort with uncertainty and risk",
      "Networking and mentorship are critical",
      "Consider gaining industry experience before founding"
    ]
  },
  "Education & Training": {
    career: "Education & Training",
    overview: "Inspire and educate the next generation. Develop teaching skills, curriculum design expertise, and educational leadership.",
    totalDuration: "4 years degree + 1-2 years certification",
    milestones: [
      {
        id: "foundations",
        title: "Teaching Fundamentals",
        duration: "Years 1-2",
        description: "Learn educational theory and child development",
        skills: [
          "Educational psychology",
          "Child/adolescent development",
          "Curriculum design basics",
          "Classroom observation hours"
        ],
        resources: [
          "University education programs",
          "Teach for America",
          "edX education courses"
        ]
      },
      {
        id: "practice",
        title: "Student Teaching",
        duration: "Years 3-4",
        description: "Gain hands-on teaching experience",
        skills: [
          "Lesson planning and delivery",
          "Classroom management",
          "Assessment and grading",
          "Student teacher placement (full semester)"
        ],
        resources: [
          "Mentor teacher guidance",
          "State teaching standards",
          "Education conferences"
        ]
      },
      {
        id: "certification",
        title: "Licensure & Specialization",
        duration: "Post-graduation",
        description: "Obtain teaching license and specialize",
        skills: [
          "Pass state teaching exams (Praxis, etc.)",
          "Obtain teaching license",
          "Choose specialization (subject, grade level)",
          "First-year teacher support"
        ],
        resources: [
          "State education department",
          "New teacher mentorship programs",
          "Professional development workshops"
        ]
      },
      {
        id: "mastery",
        title: "Master Educator",
        duration: "5+ years",
        description: "Become expert teacher or move to leadership",
        skills: [
          "Advanced pedagogy and differentiation",
          "EdTech integration",
          "Curriculum leadership",
          "Consider Master's in Education or admin"
        ],
        resources: [
          "National Board Certification",
          "Graduate education programs",
          "Educational leadership roles"
        ]
      }
    ],
    keySkills: [
      "Patience", "Communication", "Empathy", "Creativity",
      "Organization", "Adaptability", "Passion for learning"
    ],
    industryInsights: [
      "Teachers earn $40k-$65k; senior/admin roles $70k-$100k+",
      "Highly rewarding but demanding career",
      "Strong job security and benefits (summers off)",
      "Opportunity for lifelong impact on students",
      "EdTech and corporate training offer alternative paths"
    ]
  },
  "Science & Research": {
    career: "Science & Research",
    overview: "Pursue discovery and advance human knowledge. Conduct experiments, analyze data, and contribute to scientific understanding.",
    totalDuration: "4 years Bachelor's + 5-7 years PhD (if research track)",
    milestones: [
      {
        id: "undergraduate",
        title: "Scientific Foundation",
        duration: "Years 1-4 (Bachelor's)",
        description: "Build strong foundation in chosen science",
        skills: [
          "Core science courses (Physics/Chem/Bio/Psych)",
          "Research methods and statistics",
          "Lab techniques and safety",
          "Undergraduate research experience"
        ],
        resources: [
          "University science programs",
          "REU (Research Experience for Undergrads)",
          "Scientific journals"
        ]
      },
      {
        id: "graduate",
        title: "PhD Research (if applicable)",
        duration: "5-7 years",
        description: "Conduct original research and earn doctorate",
        skills: [
          "Advanced coursework and qualifying exams",
          "Dissertation research and experiments",
          "Scientific writing and publication",
          "Conference presentations"
        ],
        resources: [
          "Graduate programs with funding",
          "Research advisor mentorship",
          "Scientific societies"
        ]
      },
      {
        id: "postdoc",
        title: "Postdoctoral Training",
        duration: "2-4 years",
        description: "Specialized research before faculty/industry role",
        skills: [
          "Independent research projects",
          "Grant writing and funding",
          "Mentoring students",
          "Building publication record"
        ],
        resources: [
          "Postdoc positions at universities/labs",
          "NIH, NSF funding opportunities",
          "Research collaborations"
        ]
      },
      {
        id: "career",
        title: "Research Career",
        duration: "Ongoing",
        description: "Establish yourself as research scientist",
        skills: [
          "Lead research lab or join industry R&D",
          "Secure research funding",
          "Publish high-impact papers",
          "Teach and mentor (if academic)"
        ],
        resources: [
          "University faculty positions",
          "Industry R&D roles",
          "Government labs (NIH, NASA, DOE)"
        ]
      }
    ],
    keySkills: [
      "Curiosity", "Critical thinking", "Perseverance", "Attention to detail",
      "Data analysis", "Written communication", "Collaboration"
    ],
    industryInsights: [
      "PhD scientists earn $60k-$100k; senior roles $120k-$200k+",
      "Academic jobs are very competitive",
      "Industry R&D often pays significantly more",
      "Long training period but intellectually rewarding",
      "Master's degree can lead to research tech/analyst roles"
    ]
  }
};

// Fallback roadmap for careers not yet defined
export const getDefaultRoadmap = (careerName: string): CareerRoadmap => ({
  career: careerName,
  overview: `Develop expertise in ${careerName} through structured learning and hands-on experience. Build both foundational knowledge and specialized skills.`,
  totalDuration: "12-18 months intensive learning",
  milestones: [
    {
      id: "foundations",
      title: "Foundational Knowledge",
      duration: "3-4 months",
      description: "Build a strong foundation in core concepts",
      skills: [
        "Learn industry fundamentals and terminology",
        "Study key theories and frameworks",
        "Develop basic technical skills",
        "Connect with professionals in the field"
      ],
      resources: [
        "Online courses (Coursera, edX, Udemy)",
        "Industry-standard books and publications",
        "Professional association resources"
      ]
    },
    {
      id: "intermediate",
      title: "Skill Development",
      duration: "5-6 months",
      description: "Develop practical skills through projects and practice",
      skills: [
        "Work on hands-on projects",
        "Learn industry-standard tools and software",
        "Build a portfolio of work",
        "Seek mentorship from experienced professionals"
      ],
      resources: [
        "Practical workshops and bootcamps",
        "Portfolio building projects",
        "Internships or volunteer work"
      ]
    },
    {
      id: "advanced",
      title: "Specialization",
      duration: "3-4 months",
      description: "Focus on a specific area within your field",
      skills: [
        "Deep dive into chosen specialization",
        "Master advanced tools and techniques",
        "Contribute to community or open projects",
        "Develop unique expertise"
      ],
      resources: [
        "Advanced courses and certifications",
        "Industry conferences and workshops",
        "Specialized communities and forums"
      ]
    },
    {
      id: "professional",
      title: "Career Launch",
      duration: "2-3 months",
      description: "Prepare for and secure your first professional role",
      skills: [
        "Polish your portfolio and resume",
        "Practice interviewing skills",
        "Network actively in the industry",
        "Apply for positions strategically"
      ],
      resources: [
        "Job boards and company websites",
        "LinkedIn and professional networks",
        "Career counseling services"
      ]
    }
  ],
  keySkills: [
    "Communication", "Problem-solving", "Adaptability",
    "Time management", "Continuous learning", "Collaboration"
  ],
  industryInsights: [
    "Research typical salary ranges in your region",
    "Network with professionals already in the field",
    "Consider certifications relevant to your career",
    "Stay updated with industry trends and changes"
  ]
});
