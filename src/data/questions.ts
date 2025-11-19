import { Question } from '../types/question';

export const questionsData: Question[] = [
  {
    id: 1,
    text: "Your name?",
    type: "text"
  },
  {
    id: 2,
    text: "Your email?",
    type: "text"
  },
  {
    id: 3,
    text: "Your gender?",
    type: "radio",
    options: [
      "Male",
      "Female",
      "Other",
      "Prefer not to say"
    ]
  },
  {
    id: 4,
    text: "When faced with a complex problem, you prefer to:",
    type: "radio",
    options: [
      "Break it down into logical steps and analyze systematically",
      "Research similar cases and apply proven solutions",
      "Brainstorm creative alternatives and experiment",
      "Discuss with others to understand different perspectives"
    ]
  },
  {
    id: 5,
    text: "Your ideal work setting would be:",
    type: "radio",
    options: [
      "Laboratory or research facility with controlled environment",
      "Hospital or clinic helping people directly",
      "Workshop or site building tangible solutions",
      "Office managing operations and people"
    ]
  },
  {
    id: 6,
    text: "When you see someone struggling, your first instinct is to:",
    type: "radio",
    options: [
      "Analyze the root cause and suggest practical solutions",
      "Offer emotional support and listen to their concerns",
      "Share your experience and teach them skills",
      "Connect them with resources or people who can help"
    ]
  },
  {
    id: 7,
    text: "How do you approach learning something completely new?",
    type: "radio",
    options: [
      "Study theory first, then practice systematically",
      "Jump in and learn by doing",
      "Watch demonstrations and replicate step-by-step",
      "Combine multiple resources and experiment"
    ]
  },
  {
    id: 8,
    text: "In a group emergency situation, you would most likely:",
    type: "radio",
    options: [
      "Take charge and coordinate the response",
      "Stay calm and provide immediate practical help",
      "Follow protocols and ensure safety procedures",
      "Support others emotionally and maintain morale"
    ]
  },
  {
    id: 9,
    text: "Your relationship with technology is:",
    type: "radio",
    options: [
      "I love coding, building systems, and troubleshooting technical issues",
      "I use it as a tool to enhance my work efficiency",
      "I'm comfortable with standard applications but not programming",
      "I prefer hands-on physical work over digital tools"
    ]
  },
  {
    id: 10,
    text: "What type of project excites you most?",
    type: "radio",
    options: [
      "Discovering something new through research and experimentation",
      "Designing and building a physical structure or product",
      "Creating art, media, or visual experiences",
      "Improving how organizations or communities function"
    ]
  },
  {
    id: 11,
    text: "When making important decisions, you rely most on:",
    type: "radio",
    options: [
      "Data, statistics, and measurable evidence",
      "Expert consultation and established best practices",
      "Intuition and past experience",
      "Consensus and input from affected people"
    ]
  },
  {
    id: 12,
    text: "Your tolerance for routine and repetition is:",
    type: "radio",
    options: [
      "High - I find structure and routine comforting",
      "Moderate - I can handle routine but need some variety",
      "Low - I need constant change and new challenges",
      "I can optimize routine tasks to make them efficient"
    ]
  },
  {
    id: 13,
    text: "In conversations, you naturally:",
    type: "radio",
    options: [
      "Focus on facts, logic, and accurate information",
      "Listen actively and show empathy for feelings",
      "Share stories and use vivid descriptions",
      "Guide discussion toward practical outcomes"
    ]
  },
  {
    id: 14,
    text: "Your approach to physical versus mental work is:",
    type: "radio",
    options: [
      "I prefer mental challenges and intellectual work",
      "I enjoy balanced combination of both",
      "I thrive on physical activity and hands-on tasks",
      "I prefer physical work but with planning elements"
    ]
  },
  {
    id: 15,
    text: "When evaluating success, you measure by:",
    type: "radio",
    options: [
      "Scientific accuracy and quality of results",
      "Positive impact on people's lives",
      "Innovation and originality of solution",
      "Efficiency and profitability achieved"
    ]
  },
  {
    id: 16,
    text: "Your comfort level with uncertainty and ambiguity is:",
    type: "radio",
    options: [
      "Low - I need clear guidelines and procedures",
      "Moderate - I can adapt but prefer some structure",
      "High - I thrive in ambiguous and changing situations",
      "I can handle uncertainty when there's a clear goal"
    ]
  },
  {
    id: 17,
    text: "What motivates you most in your work?",
    type: "radio",
    options: [
      "Intellectual curiosity and advancing knowledge",
      "Saving lives and improving health",
      "Financial success and business growth",
      "Self-expression and creative freedom"
    ]
  },
  {
    id: 18,
    text: "How do you respond to criticism of your work?",
    type: "radio",
    options: [
      "Analyze it objectively to improve quality",
      "Feel concerned about others' wellbeing and perceptions",
      "Defend my methods if I believe they're correct",
      "Use it as learning opportunity for growth"
    ]
  },
  {
    id: 19,
    text: "Your preferred leadership style is:",
    type: "radio",
    options: [
      "Lead by expertise and technical knowledge",
      "Lead through vision and inspiration",
      "Lead by organizing and delegating efficiently",
      "Lead through collaboration and team empowerment"
    ]
  },
  {
    id: 20,
    text: "When you complete a task, your priority is:",
    type: "radio",
    options: [
      "Precision and accuracy of every detail",
      "Positive outcome for people involved",
      "Innovative or aesthetic quality of result",
      "Meeting deadlines and budget constraints"
    ]
  },
  {
    id: 21,
    text: "In your free time, you prefer:",
    type: "radio",
    options: [
      "Reading, research, or intellectual hobbies",
      "Volunteering or helping in your community",
      "Creating art, music, or other creative projects",
      "Outdoor activities, sports, or practical hobbies"
    ]
  },
  {
    id: 22,
    text: "Your ethical decision-making is guided by:",
    type: "radio",
    options: [
      "Logical analysis of outcomes and consequences",
      "Compassion and minimizing harm to others",
      "Following established rules and regulations",
      "Balancing multiple stakeholder interests"
    ]
  },
  {
    id: 23,
    text: "How do you handle high-pressure deadlines?",
    type: "radio",
    options: [
      "Thrive under pressure and deliver best work",
      "Stay focused but feel stressed internally",
      "Need careful planning to avoid last-minute pressure",
      "Perform well but prefer more time for quality"
    ]
  },
  {
    id: 24,
    text: "Your mathematics/quantitative skills score (0-100):",
    type: "radio",
    options: [
      "0 – 35",
      "35 – 55",
      "55 – 75",
      "75 – 100"
    ]
  },
  {
    id: 25,
    text: "Your science (Physics/Chemistry) score (0-100):",
    type: "radio",
    options: [
      "0 – 35",
      "35 – 55",
      "55 – 75",
      "75 – 100"
    ]
  },
  {
    id: 26,
    text: "Your biology/life sciences score (0-100):",
    type: "radio",
    options: [
      "0 – 35",
      "35 – 55",
      "55 – 75",
      "75 – 100"
    ]
  },
  {
    id: 27,
    text: "Your business/economics score (0-100):",
    type: "radio",
    options: [
      "0 – 35",
      "35 – 55",
      "55 – 75",
      "75 – 100"
    ]
  },
  {
    id: 28,
    text: "Your computer science/IT skills (0-100):",
    type: "radio",
    options: [
      "0 – 35",
      "35 – 55",
      "55 – 75",
      "75 – 100"
    ]
  },
  {
    id: 29,
    text: "Your arts/creative subjects score (0-100):",
    type: "radio",
    options: [
      "0 – 35",
      "35 – 55",
      "55 – 75",
      "75 – 100"
    ]
  },
  {
    id: 30,
    text: "Your social sciences/humanities score (0-100):",
    type: "radio",
    options: [
      "0 – 35",
      "35 – 55",
      "55 – 75",
      "75 – 100"
    ]
  }
];
