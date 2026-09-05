// Frontend fallback for deployments where the backend URL is not configured.
// The backend remains the primary source when it is available.
const syllabiData = {
  "campus-recruitment-training": {
    title: "Campus Recruitment Training",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Aptitude & Logical Reasoning", "Group Discussion Techniques", "Resume & Cover Letter Building", "Personal Interview Preparation", "Verbal & Written Communication", "Body Language & First Impressions", "Corporate Etiquette", "Email & Business Writing", "Mock Placement Drives", "Industry & Current Affairs Awareness", "Confidence Building"],
  },
  "soft-skills-development": {
    title: "Soft Skills Development",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Communication Skills", "Teamwork & Collaboration", "Time Management", "Emotional Intelligence", "Problem-Solving & Decision Making", "Adaptability & Flexibility", "Interpersonal Skills", "Conflict Resolution", "Active Listening", "Self-Motivation", "Networking Skills"],
  },
  "communication-business-skills": {
    title: "Communication & Business Skills",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Business Communication Foundations", "Professional Email & Report Writing", "Effective Workplace Conversation", "Presentation & Deck Delivery", "Cross-Cultural Communication", "Client Pitching & Negotiation", "Active Listening & Feedback", "Meeting Facilitation & Minutes", "Corporate Vocabulary & Etiquette"],
  },
  "company-specific-training": {
    title: "Company Specific Training",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Organizational Culture & Values Orientation", "Role-Specific Communication Standards", "Company Process & SOP Training", "Client Handling & Domain Etiquette", "Tools & Software Familiarization", "Compliance & Policy Awareness", "Team Integration Workshops", "Customized Case Studies & Simulations", "Performance Expectation Alignment"],
  },
  "technical-skills": {
    title: "Technical Skills",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: [
      "Generative AI Tools & Prompt Engineering",
      "Python Programming",
      "Data Analysis & Visualization (Excel, Power BI)",
      "Cloud Computing Fundamentals (AWS / Azure / GCP)",
      "Cybersecurity Fundamentals",
      "DevOps & CI/CD Automation",
      "Web Development (HTML, CSS, JavaScript Frameworks)",
      "SQL & Database Management",
      "Machine Learning Fundamentals",
      "Git & Version Control",
      "MS Office & AI Copilot Tools",
      "UI/UX Design Basics",
      "Low-Code / No-Code App Development",
      "Digital Marketing & Social Media Tools",
      "Tally & Accounting Software"
    ],
  },
  "personality-development": {
    title: "Personality Development",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Self-Awareness & Confidence Building", "Body Language & Non-Verbal Communication", "Grooming & Professional Etiquette", "Public Speaking", "Emotional Intelligence", "Attitude & Mindset Building", "Goal Setting & Self-Discipline", "Stress & Anger Management", "Social Etiquette & Networking"],
  },
  "public-speaking-debate": {
    title: "Public Speaking & Debate",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Stage Presence & Overcoming Fear", "Speech Structuring & Storytelling", "Voice Modulation & Articulation", "Debate Formats & Rebuttal Strategies", "Body Language & Micro-Gestures", "Impromptu Speaking (Extempore)", "Persuasive Argumentation", "Audience Engagement Techniques", "Mic & Podium Management"],
  },
  "interview-skills-mock-gds": {
    title: "Interview Skills & Mock GDs",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Resume & CV Building", "Types of Interviews (HR, Technical, Panel)", "Common Interview Questions & Answers", "Body Language in Interviews", "Group Discussion Skills", "Mock Interview Practice", "Salary Negotiation Techniques", "Post-Interview Follow-Up Etiquette"],
  },
  "career-guidance-programme": {
    title: "Career Guidance Programme",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Self-Assessment & Aptitude Analysis", "Career Path Mapping", "Skill Gap Identification", "Resume & Portfolio Building", "Industry & Job Market Awareness", "Goal Setting & Career Planning", "Networking & Personal Branding", "Higher Education & Certification Guidance"],
  },
  "leadership-development": {
    title: "Leadership Development",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Leadership Styles & Self-Assessment", "Decision Making & Problem Solving", "Delegation & Empowerment", "Team Building & Motivation", "Emotional Intelligence for Leaders", "Strategic & Critical Thinking", "Conflict & Change Management", "Coaching & Mentoring", "Effective Leadership Communication", "Performance Management"],
  },
  "corporate-training-modules": {
    title: "Corporate Training Modules",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Workplace Communication", "Professional Email & Report Writing", "Corporate Etiquette & Grooming", "Presentation Skills", "Team Collaboration", "Time & Priority Management", "Conflict Management at Workplace", "Stress Management", "Cross-Functional Coordination", "Business Communication Tools"],
  },
  "faculty-development-programmes": {
    title: "Faculty Development Programmes",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Modern Teaching Pedagogies", "Curriculum & Lesson Planning", "Classroom Management Techniques", "Student Engagement Strategies", "Assessment & Evaluation Methods", "Technology-Integrated Teaching", "Communication Skills for Educators", "Research & Publication Skills", "Outcome-Based Education (OBE)"],
  },
  "train-the-trainer-programme": {
    title: "Train-the-Trainer Programme",
    source_document: "Voktaa_Course_Wise_Subjects_Content.docx",
    subjects: ["Instructional Design Basics", "Facilitation Skills", "Presentation Skills for Trainers", "Content Development & Session Planning", "Handling Difficult Participants", "Training Delivery Techniques", "Use of Training Aids & Technology", "Feedback & Evaluation Methods", "Training Needs Analysis"],
  },
};

// Aliases for user-friendly and legacy URLs
syllabiData["tech-skills"] = syllabiData["technical-skills"];
syllabiData["corporate-training"] = syllabiData["corporate-training-modules"];
syllabiData["career-guidance"] = syllabiData["career-guidance-programme"];
syllabiData["interview-skills"] = syllabiData["interview-skills-mock-gds"];
syllabiData["faculty-development"] = syllabiData["faculty-development-programmes"];
syllabiData["faculty-development-fdp"] = syllabiData["faculty-development-programmes"];
syllabiData["train-the-trainer"] = syllabiData["train-the-trainer-programme"];
syllabiData["public-speaking"] = syllabiData["public-speaking-debate"];

export const programSyllabi = syllabiData;
