/**
 * VOKTAA Academic & Professional Program Syllabus Expert
 * Authoritative Source: VOKTAA Course Wise Subject Content (11 Official Course Categories)
 */

export const VOKTAA_COURSES = {
  "campus-recruitment-training": {
    id: "crt",
    title: "Campus Recruitment Training (CRT)",
    category: "Campus Recruitment Training (CRT)",
    aliases: ["crt", "campus recruitment training", "campus recruitment", "placement training", "campus placement"],
    relevance: "Prepares engineering and degree graduates to excel in aptitude tests, group discussions, technical & HR interviews, and mock placement drives.",
    whatYouWillLearn: "Master quantitative & logical aptitude, GD leadership, resume crafting, verbal communication, body language, and interview confidence.",
    subjects: [
      "Aptitude & Logical Reasoning",
      "Group Discussion Techniques",
      "Resume & Cover Letter Building",
      "Personal Interview Preparation",
      "Verbal & Written Communication",
      "Body Language & First Impressions",
      "Corporate Etiquette",
      "Email & Business Writing",
      "Mock Placement Drives",
      "Industry & Current Affairs Awareness",
      "Confidence Building"
    ]
  },
  "soft-skills-development": {
    id: "soft_skills",
    title: "Soft Skills Development",
    category: "Soft Skills Development",
    aliases: ["soft skills", "soft skills development", "soft skill", "interpersonal skills"],
    relevance: "Enhances workplace interpersonal communication, emotional intelligence, teamwork, time management, and professional adaptability.",
    whatYouWillLearn: "Develop active listening, conflict resolution, decision-making, emotional self-regulation, time management, and networking skills.",
    subjects: [
      "Communication Skills",
      "Teamwork & Collaboration",
      "Time Management",
      "Emotional Intelligence",
      "Problem-Solving & Decision Making",
      "Adaptability & Flexibility",
      "Interpersonal Skills",
      "Conflict Resolution",
      "Active Listening",
      "Self-Motivation",
      "Networking Skills"
    ]
  },
  "company-specific-training": {
    id: "company_specific",
    title: "Company Specific Training",
    category: "Company Specific Training",
    aliases: ["company specific", "company specific training", "company training", "sop training"],
    relevance: "Tailors candidate readiness for specific corporate cultures, process SOPs, domain client etiquette, and technical assessment patterns.",
    whatYouWillLearn: "Understand organizational culture, role-specific communication standards, company process SOPs, compliance, and simulation case studies.",
    subjects: [
      "Organizational Culture & Values Orientation",
      "Role-Specific Communication Standards",
      "Company Process & SOP Training",
      "Client Handling & Domain Etiquette",
      "Tools & Software Familiarization",
      "Compliance & Policy Awareness",
      "Team Integration Workshops",
      "Customized Case Studies & Simulations",
      "Performance Expectation Alignment"
    ]
  },
  "corporate-training": {
    id: "corporate_training",
    title: "Corporate Training",
    category: "Corporate Training",
    aliases: ["corporate training", "corporate modules", "workplace training", "corporate"],
    relevance: "Upskills working professionals and corporate teams in high-impact business communication, executive presentation, and priority management.",
    whatYouWillLearn: "Master workplace communication, professional report writing, presentation skills, stress management, and cross-functional coordination.",
    subjects: [
      "Workplace Communication",
      "Professional Email & Report Writing",
      "Corporate Etiquette & Grooming",
      "Presentation Skills",
      "Team Collaboration",
      "Time & Priority Management",
      "Conflict Management at Workplace",
      "Stress Management",
      "Cross-Functional Coordination",
      "Business Communication Tools"
    ]
  },
  "leadership-development": {
    id: "leadership",
    title: "Leadership Development",
    category: "Leadership Development",
    aliases: ["leadership", "leadership development", "leader training", "executive leadership"],
    relevance: "Empowers emerging managers, team leads, and executives with strategic decision-making, delegation, coaching, and team motivation capabilities.",
    whatYouWillLearn: "Assess leadership styles, master strategic thinking, delegate effectively, manage organizational change, and coach team members.",
    subjects: [
      "Leadership Styles & Self-Assessment",
      "Decision Making & Problem Solving",
      "Delegation & Empowerment",
      "Team Building & Motivation",
      "Emotional Intelligence for Leaders",
      "Strategic & Critical Thinking",
      "Conflict & Change Management",
      "Coaching & Mentoring",
      "Effective Leadership Communication",
      "Performance Management"
    ]
  },
  "personality-development": {
    id: "personality",
    title: "Personality Development",
    category: "Personality Development",
    aliases: ["personality development", "personality", "grooming", "self confidence"],
    relevance: "Builds holistic self-confidence, public speaking, professional grooming, non-verbal body language, and positive mindset.",
    whatYouWillLearn: "Cultivate self-awareness, stage presence, goal setting, anger/stress management, and social etiquette.",
    subjects: [
      "Self-Awareness & Confidence Building",
      "Body Language & Non-Verbal Communication",
      "Grooming & Professional Etiquette",
      "Public Speaking",
      "Emotional Intelligence",
      "Attitude & Mindset Building",
      "Goal Setting & Self-Discipline",
      "Stress & Anger Management",
      "Social Etiquette & Networking"
    ]
  },
  "career-guidance": {
    id: "career_guidance",
    title: "Career Guidance",
    category: "Career Guidance",
    aliases: ["career guidance", "career path", "career planning", "career guidance programme"],
    relevance: "Guides students and job aspirants through self-assessment, skill gap identification, portfolio building, and strategic career planning.",
    whatYouWillLearn: "Identify aptitude strengths, map industry trends, create strong portfolios, and select appropriate higher education/certifications.",
    subjects: [
      "Self-Assessment & Aptitude Analysis",
      "Career Path Mapping",
      "Skill Gap Identification",
      "Resume & Portfolio Building",
      "Industry & Job Market Awareness",
      "Goal Setting & Career Planning",
      "Networking & Personal Branding",
      "Higher Education & Certification Guidance"
    ]
  },
  "interview-skills": {
    id: "interview_skills",
    title: "Interview Skills",
    category: "Interview Skills",
    aliases: ["interview skills", "interview", "interview preparation", "mock interviews", "interview topics"],
    relevance: "Equips candidates to excel in HR, technical, and panel interviews with structured answers, confident body language, and negotiation skills.",
    whatYouWillLearn: "Master common HR/technical questions, CV building, group discussion performance, salary negotiation, and post-interview follow-up.",
    subjects: [
      "Resume & CV Building",
      "Types of Interviews (HR, Technical, Panel)",
      "Common Interview Questions & Answers",
      "Body Language in Interviews",
      "Group Discussion Skills",
      "Mock Interview Practice",
      "Salary Negotiation Techniques",
      "Post-Interview Follow-Up Etiquette"
    ]
  },
  "faculty-development": {
    id: "fdp",
    title: "Faculty Development Program (FDP)",
    category: "Faculty Development Program (FDP)",
    aliases: ["fdp", "faculty development program", "faculty development", "teacher training", "faculty training"],
    relevance: "Empowers educators, professors, and faculty members with modern interactive teaching pedagogies, lesson planning, and OBE evaluation.",
    whatYouWillLearn: "Integrate technology into classrooms, manage student dynamics, publish research, and implement Outcome-Based Education (OBE).",
    subjects: [
      "Modern Teaching Pedagogies",
      "Curriculum & Lesson Planning",
      "Classroom Management Techniques",
      "Student Engagement Strategies",
      "Assessment & Evaluation Methods",
      "Technology-Integrated Teaching",
      "Communication Skills for Educators",
      "Research & Publication Skills",
      "Outcome-Based Education (OBE)"
    ]
  },
  "train-the-trainer": {
    id: "ttt",
    title: "Train-the-Trainer",
    category: "Train-the-Trainer",
    aliases: ["ttt", "train the trainer", "train-the-trainer", "trainer training", "train the trainers"],
    relevance: "Prepares corporate trainers, facilitators, and educators to design, deliver, and evaluate high-impact training workshops.",
    whatYouWillLearn: "Master instructional design, dynamic session facilitation, participant management, training aids, and Training Needs Analysis (TNA).",
    subjects: [
      "Instructional Design Basics",
      "Facilitation Skills",
      "Presentation Skills for Trainers",
      "Content Development & Session Planning",
      "Handling Difficult Participants",
      "Training Delivery Techniques",
      "Use of Training Aids & Technology",
      "Feedback & Evaluation Methods",
      "Training Needs Analysis"
    ]
  },
  "technical-skills": {
    id: "technical_skills",
    title: "Technical Skills",
    category: "Technical Skills",
    aliases: ["technical skills", "tech skills", "technical", "coding", "software skills", "technical subjects"],
    relevance: "Delivers hands-on practical training in cutting-edge software engineering, AI tools, cloud, databases, DevOps, and digital productivity.",
    whatYouWillLearn: "Gain job-ready technical proficiency in Gen AI, Python, SQL, Cloud, Web Development, Power BI, DevOps, and Data Analytics.",
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
    ]
  }
};

/**
 * Detect language of user query (Telugu, English, or Teluglish/Code-mixed).
 */
function detectLanguage(text) {
  const teluguRegex = /[\u0C00-\u0C7F]/;
  if (teluguRegex.test(text)) return "telugu";

  const lower = text.toLowerCase();
  const teluglishWords = ["gurinchi", "cheppandi", "enti", "ela", "evariki", "subjects", "silabus", "badi", "chudandi", "kavali", "telusukovalani", "unayi", "unnayi"];
  if (teluglishWords.some((w) => lower.includes(w))) return "teluglish";

  return "english";
}

/**
 * Main Entry Point for Syllabus Expert Queries.
 * Strict Authoritative Compliance with VOKTAA Course Wise Subject Content.
 */
export function getSyllabusExpertResponse(userText) {
  if (!userText || typeof userText !== "string") return null;

  const lower = userText.toLowerCase().replace(/[^\w\s-]/g, " ").trim();
  const lang = detectLanguage(userText);

  // 1. Check if user is asking for "all courses" or "what courses do you offer"
  if (lower.includes("all courses") || lower.includes("all programmes") || lower.includes("list of courses") || lower.includes("what courses do you offer") || lower.includes("which courses does voktaa offer") || lower === "courses" || lower === "all syllabus") {
    return formatAllCoursesResponse(lang);
  }

  // 2. Exact Match / Alias Match for 11 VOKTAA Course Categories
  for (const [key, course] of Object.entries(VOKTAA_COURSES)) {
    if (course.aliases.some((alias) => lower === alias || lower.includes(alias))) {
      return formatVoktaaCourseResponse(course, lang);
    }
  }

  // 3. Subject-Level Query Match (e.g. "Explain Group Discussion Techniques", "Python in Technical Skills")
  for (const [key, course] of Object.entries(VOKTAA_COURSES)) {
    for (const subject of course.subjects) {
      const subLower = subject.toLowerCase();
      if (lower.includes(subLower) || (subLower.length > 5 && lower.includes(subLower.slice(0, 8)))) {
        return formatSubjectExplanationResponse(subject, course, lang);
      }
    }
  }

  // 4. If query explicitly mentions "syllabus" / "subjects" for an unknown course not in VOKTAA source
  if (lower.includes("syllabus") || lower.includes("curriculum") || lower.includes("subjects") || lower.includes("course content")) {
    return formatUnknownCourseResponse(userText, lang);
  }

  return null;
}

/**
 * Format Course Category Overview (Single Course Input)
 */
function formatVoktaaCourseResponse(course, lang) {
  if (lang === "telugu" || lang === "teluglish") {
    return `# 🎓 ${course.title}

**సిలబస్ వర్గీకరణ (Syllabus Classification):** Official VOKTAA Course Content

---

### 📚 నేర్చుకునే ప్రధాన సబ్జెక్ట్‌లు (Subjects Covered)
${course.subjects.map((sub, i) => `${i + 1}. **${sub}**`).join("\n")}

---

### 🎯 మీరు ఏమి నేర్చుకుంటారు (What You Will Learn)
${course.whatYouWillLearn}

### 💼 కెరీర్ మరియు ప్లాస్‌మెంట్ ప్రాముఖ్యత (Career / Placement Relevance)
${course.relevance}

---

🚀 **మరింత సహాయం కోసం నెక్స్ట్ స్టెప్స్ (Explore Further):**
- 📖 **"Subject-wise explanation"** (ప్రత్యేక సబ్జెక్ట్ వివరణ)
- 🗓️ **"Detailed syllabus"** (లోతైన సిలబస్)
- 🎯 **"Study plan"** (స్టడీ ప్లాన్)
- 💡 **"Practice questions & Interview prep"** (ఇంటర్వ్యూ ప్రశ్నలు)`;
  }

  return `# 🎓 ${course.title}

**Syllabus Classification:** Official VOKTAA Course Content

---

### 📚 Subjects Covered

${course.subjects.map((sub, i) => `${i + 1}. **${sub}**`).join("\n")}

---

### 🎯 What You Will Learn
${course.whatYouWillLearn}

### 💼 Career / Placement Relevance
${course.relevance}

---

### 🚀 Explore Further
Reply with any of these options for deeper guidance:
1. **Subject-wise explanation** — Detailed breakdown of any subject.
2. **Detailed syllabus** — Module-by-module learning objectives.
3. **Learning roadmap** — Step-by-step skill progression.
4. **Practice questions** — Practical drills and case studies.
5. **Interview preparation** — Key HR & technical interview questions.
6. **Study plan** — Structured learning schedule.`;
}

/**
 * Format Subject-Level Explanation Response
 */
function formatSubjectExplanationResponse(subject, course, lang) {
  if (lang === "telugu" || lang === "teluglish") {
    return `### 📖 సబ్జెక్ట్ వివరణ: ${subject}

**కోర్సు (Course):** ${course.title}  
**సిలబస్ వర్గీకరణ:** Official VOKTAA Course Content

---

📌 **ఈ సబ్జెక్ట్ వివరణ (What It Means):**
**${subject}** అనేది VOKTAA సొల్యూషన్స్ **${course.title}** కోర్సులో భాగమైన ఒక ముఖ్యమైన సబ్జెక్ట్. ఇది విద్యార్థులు మరియు ప్రొఫెషనల్స్ వర్క్‌ప్లేస్ నైపుణ్యాలను మరియు ప్రాక్టికల్ నాలెడ్జ్‌ను పెంపొందించుకోవడానికి సహాయపడుతుంది.

💡 **ముఖ్యమైన భావనలు (Key Concepts):**
- **విషయ పరిజ్ఞానం & భావప్రకటన**: సరియైన పదజాలం మరియు ఆత్మవిశ్వాసం.
- **ప్రాక్టికల్ అప్లికేషన్**: రోజువారీ వర్క్‌ప్లేస్ సవాళ్లను ఎదుర్కొనే పద్ధతులు.
- **బాడీ లాంగ్వేజ్ & ఎチケット**: ప్రొఫెషనల్ అప్రోచ్.

🎯 **ప్రాక్టీస్ విధానం (Practice Approach):**
1. కాన్సెప్ట్ అర్థం చేసుకోవడం మరియు అబ్జర్వేషన్.
2. మాక్ సెషన్స్ మరియు రోల్-ప్లే విశ్లేషణ.
3. ఫీడ్‌బ్యాక్ ఆధారంగా నైపుణ్యాలను మెరుగుపరుచుకోవడం.

---

🚀 **నెక్స్ట్ స్టెప్స్ (Explore Further):**
- 💡 **"${subject} interview questions"**
- 🗓️ **"${course.title} study plan"**`;
  }

  return `### 📖 Subject Breakdown: ${subject}

**Course:** ${course.title}  
**Syllabus Classification:** Official VOKTAA Course Content

---

### 📌 What It Means
**${subject}** is an essential subject under VOKTAA's **${course.title}** module. It focuses on equipping learners with practical application, strategic understanding, and real-world performance capability.

### 💡 Why It Is Important
In today's competitive corporate landscape, mastering **${subject}** directly impacts your interview success, workplace performance, and career advancement.

### 🔑 Key Concepts Covered
1. **Core Principles & Frameworks**: Foundational concepts and methodologies.
2. **Practical Real-World Application**: Hands-on drills, simulations, and case studies.
3. **Professional Standards**: Corporate best practices and performance etiquette.

### ⚠️ Common Mistakes to Avoid
- Focusing only on theoretical knowledge without practical application.
- Neglecting feedback and self-assessment during practice drills.

### 🎯 Practice Approach
- **Step 1**: Review the core subject guidelines and structural frameworks.
- **Step 2**: Participate in VOKTAA's practical mock sessions and role-play exercises.
- **Step 3**: Incorporate trainer feedback to refine your execution.

---

### 🚀 Explore Further
Reply with any of these to continue:
- **"Explain another subject in ${course.title}"**
- **"Show all subjects in ${course.title}"**
- **"${subject} interview questions"**`;
}

/**
 * Format All 11 VOKTAA Courses Response
 */
function formatAllCoursesResponse(lang) {
  if (lang === "telugu" || lang === "teluglish") {
    return `# 📚 VOKTAA సొల్యూషన్స్ - అధికారిక కోర్సులు మరియు సిలబస్ (All Courses & Syllabus)

**సమగ్ర వర్గీకరణ:** Official VOKTAA Course Wise Subject Content

VOKTAA Solutions అందించే 11 ప్రధాన కోర్సుల మరియు వాటి సబ్జెక్టుల వివరాలు ఇక్కడ ఉన్నాయి:

${Object.values(VOKTAA_COURSES).map((c, i) => `### ${i + 1}. 🎓 ${c.title}
${c.subjects.map((sub) => `- ${sub}`).join("\n")}`).join("\n\n")}

---

> 💡 మీరు ఏదైనా కోర్సు పేరు (ఉదాహరణకు: **CRT**, **FDP**, **Soft Skills**, **Technical Skills**) టైప్ చేసి దాని లోతైన సిలబస్ చూడవచ్చు.`;
  }

  return `# 📚 VOKTAA Solutions — All Course Categories & Subjects

**Authoritative Source:** VOKTAA Course Wise Subject Content

Below are all 11 official VOKTAA course categories and their subjects:

${Object.values(VOKTAA_COURSES).map((c, i) => `### ${i + 1}. 🎓 ${c.title}

${c.subjects.map((sub) => `- **${sub}**`).join("\n")}`).join("\n\n")}

---

### 🚀 Explore Further
Type any course name (e.g. **"CRT"**, **"Soft Skills"**, **"FDP"**, **"Technical Skills"**, **"Leadership"**) to see its full syllabus, career relevance, and learning objectives!`;
}

/**
 * Handle Unknown Course Response (Course not in VOKTAA source)
 */
function formatUnknownCourseResponse(userText, lang) {
  if (lang === "telugu" || lang === "teluglish") {
    return `I don't currently have that course in the VOKTAA Course Wise Subject Content. If you provide the course syllabus, I can explain and structure it for you. 😊

ఉదాహరణకు, మీరు VOKTAA అందించే **CRT**, **Soft Skills**, **FDP**, **Technical Skills**, **Interview Skills** వంటి కోర్సుల సిలబస్ తెలుసుకోవచ్చు!`;
  }

  return `I don't currently have that course in the VOKTAA Course Wise Subject Content. If you provide the course syllabus, I can explain and structure it for you. 😊

You can ask me about any official VOKTAA course categories such as:
- **Campus Recruitment Training (CRT)**
- **Soft Skills Development**
- **Company Specific Training**
- **Corporate Training**
- **Leadership Development**
- **Personality Development**
- **Career Guidance**
- **Interview Skills**
- **Faculty Development Program (FDP)**
- **Train-the-Trainer (TTT)**
- **Technical Skills**`;
}
