import { account, storage, databases, ID, Query, withCollectionFallback } from "./appwrite";
import { extractTextFromFile, chunkText } from "./textExtractor";

const KNOWLEDGE_BUCKET = process.env.REACT_APP_APPWRITE_KNOWLEDGE_BUCKET || "knowledge_base";
const DOCS_COLLECTION = process.env.REACT_APP_APPWRITE_DOCS_COLLECTION || "knowledge_documents";
const CHUNKS_COLLECTION = process.env.REACT_APP_APPWRITE_CHUNKS_COLLECTION || "knowledge_chunks";
const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID || "6a9e62d20038b6046ebf";

// Pre-seeded VOKTAA Official Knowledge Chunks (from VOKTAA Instant Q&A Document)
const SEEDED_CHUNKS = [
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 0,
    content: "VOKTAA Solutions is a corporate learning and employability training company based in Guntur, Andhra Pradesh, India. Founded by P. Raja Sekhar, our philosophy is 'Communication changes destinies.' We help students and professionals build communication skills, soft skills, public speaking, and placement interview readiness.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 1,
    content: "VOKTAA stands for: Voice, Knowledge, Training, Always Ahead. Our tagline used site-wide is 'Speak. Shine. Succeed.'",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 2,
    content: "VOKTAA offer courses built around four core pillars: Communication Skills, Business Skills, Corporate Training for Engineering Graduates, and Interview Skills — delivered through flagship programs like Launchpad 360 and Speak Bold.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 3,
    content: "Launchpad 360 is VOKTAA's flagship campus placement-readiness program covering communication, soft skills, mock interviews, GD practice, and interview preparation to get engineering and degree students career-ready.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 4,
    content: "Speak Bold is VOKTAA's specialized program focused on spoken English, voice modulation, and public-speaking confidence, helping learners communicate clearly and assertively.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 5,
    content: "Campus Recruitment Training (CRT): Yes, VOKTAA offers Campus Recruitment Training (CRT) preparing engineering and degree college students for aptitude tests, group discussions, technical and HR mock interviews as part of campus placement drives.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 6,
    content: "Train the Trainers (TTT): VOKTAA runs Train-the-Trainer programmes to help faculty members, educators, and internal corporate trainers strengthen their own classroom delivery, modern pedagogy, and communication skills.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 7,
    content: "Course Duration & Modes: Course duration depends on the program chosen — options are available at 30 days, 40 days, or 60 days (or custom 6-8 week CRT modules). Classes are available in both Online and Offline modes. Successful students receive an official VOKTAA completion certificate.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 8,
    content: "Course Fees, Enrollment & Contact Info: To enroll in a VOKTAA course or enquire about course fees, pricing, or custom batch structures, call/WhatsApp +91 74161 13199, email voktaasolutions@gmail.com, or visit our website at voktaa.com / contact page.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 9,
    content: "Who Trains at VOKTAA: VOKTAA's training is led by experienced faculty with nearly two decades of English language teaching and soft-skills training experience built specifically for engineering graduates and job aspirants.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 10,
    content: "School Students Training: VOKTAA Solutions primarily focuses on college students (engineering & degree graduates) and job aspirants. However, school students interested in building public speaking, spoken English, and foundational confidence can participate in our Speak Bold program. Contact +91 74161 13199 for custom school sessions.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 11,
    content: "Institutional Partnerships & MOU: VOKTAA partners with engineering colleges, degree universities, and institutions for tailored campus recruitment training, MOU signing, NAAC/NIRF placement metric support, and faculty development. Visit voktaa.com/institutions or call +91 74161 13199.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 12,
    content: "Student Reviews & Testimonials: Read authentic reviews, ratings, and success stories from engineering graduates, placement officers, and partner institutions on our Reviews page at voktaa.com/reviews.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 13,
    content: "Location & Office Contact: VOKTAA Solutions is headquartered in Guntur, Andhra Pradesh, India. Reach us by phone/WhatsApp at +91 74161 13199, email at voktaasolutions@gmail.com, or submit a message on our Contact page at voktaa.com/contact.",
    isActive: true
  }
];

// Local Storage Keys for Fallback Mode
const LOCAL_DOCS_KEY = "voktaa_knowledge_docs_v2";
const LOCAL_CHUNKS_KEY = "voktaa_knowledge_chunks_v2";

function getLocalDocs() {
  try {
    const raw = localStorage.getItem(LOCAL_DOCS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: "seed_voktaa_qa_doc",
      fileId: "seed_file_qa",
      fileName: "VOKTAA_Official_Instant_QA.pdf",
      fileType: "application/pdf",
      uploadedAt: new Date().toISOString(),
      isActive: true,
      extractedTextStatus: "ready",
      chunksCount: SEEDED_CHUNKS.length,
      createdBy: "Admin"
    }
  ];
}

function saveLocalDocs(docs) {
  try {
    localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docs));
  } catch {}
}

function getLocalChunks() {
  try {
    const raw = localStorage.getItem(LOCAL_CHUNKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEEDED_CHUNKS;
}

function saveLocalChunks(chunks) {
  try {
    localStorage.setItem(LOCAL_CHUNKS_KEY, JSON.stringify(chunks));
  } catch {}
}

/**
 * Upload a document to Appwrite Storage & extract searchable chunks into Appwrite Database.
 */
export async function uploadKnowledgeDocument(file) {
  if (!file) throw new Error("No file selected.");
  
  const allowedExtensions = [".pdf", ".docx", ".txt"];
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`Invalid file type '${ext}'. Only PDF, DOCX, and TXT files are allowed.`);
  }

  const docId = "doc_" + ID.unique();
  const fileId = "file_" + ID.unique();

  // 1. Extract text & create chunks
  let text = "";
  try {
    text = await extractTextFromFile(file);
  } catch (err) {
    throw new Error(`Failed to extract text from document: ${err.message}`);
  }

  if (!text || text.trim().length < 10) {
    throw new Error("The document contains no readable text content.");
  }

  const chunksContent = chunkText(text, 450, 90);
  const chunkObjects = chunksContent.map((content, idx) => ({
    documentId: docId,
    chunkIndex: idx,
    content,
    isActive: true
  }));

  // 2. Upload file to Appwrite Storage (or fallback)
  let appwriteStorageSuccess = false;
  try {
    await storage.createFile(KNOWLEDGE_BUCKET, fileId, file);
    appwriteStorageSuccess = true;
  } catch (err) {
    console.warn("Appwrite Storage upload fallback:", err.message);
  }

  // 3. Save metadata & chunks to Appwrite Database (or fallback)
  const docMeta = {
    id: docId,
    fileId: appwriteStorageSuccess ? fileId : docId,
    fileName: file.name,
    fileType: file.type || ext.replace(".", ""),
    uploadedAt: new Date().toISOString(),
    isActive: true,
    extractedTextStatus: "ready",
    chunksCount: chunkObjects.length,
    createdBy: "Admin"
  };

  try {
    await withCollectionFallback(DOCS_COLLECTION, "knowledge_documents", (colId) =>
      databases.createDocument(DATABASE_ID, colId, docId, docMeta)
    );

    for (const chunkObj of chunkObjects) {
      await withCollectionFallback(CHUNKS_COLLECTION, "knowledge_chunks", (colId) =>
        databases.createDocument(DATABASE_ID, colId, ID.unique(), chunkObj)
      );
    }
  } catch (err) {
    console.warn("Appwrite Database fallback:", err.message);
  }

  // Always update local cache so admin UI and chatbot have instant access
  const docs = getLocalDocs();
  docs.unshift(docMeta);
  saveLocalDocs(docs);

  const currentChunks = getLocalChunks();
  saveLocalChunks([...chunkObjects, ...currentChunks]);

  return docMeta;
}

/**
 * List all knowledge documents.
 */
export async function getKnowledgeDocuments() {
  try {
    const res = await withCollectionFallback(DOCS_COLLECTION, "knowledge_documents", (colId) =>
      databases.listDocuments(DATABASE_ID, colId, [Query.orderDesc("uploadedAt")])
    );
    if (res && res.documents && res.documents.length > 0) {
      return res.documents;
    }
  } catch (err) {
    console.warn("Appwrite getDocuments fallback:", err.message);
  }
  return getLocalDocs();
}

/**
 * Toggle document active status (enable/disable for chatbot).
 */
export async function toggleKnowledgeDocument(docId, isActive) {
  // Update Appwrite Database
  try {
    await withCollectionFallback(DOCS_COLLECTION, "knowledge_documents", (colId) =>
      databases.updateDocument(DATABASE_ID, colId, docId, { isActive })
    );

    // Update chunks
    const chunkRes = await withCollectionFallback(CHUNKS_COLLECTION, "knowledge_chunks", (colId) =>
      databases.listDocuments(DATABASE_ID, colId, [Query.equal("documentId", docId)])
    );

    if (chunkRes && chunkRes.documents) {
      for (const chunk of chunkRes.documents) {
        await withCollectionFallback(CHUNKS_COLLECTION, "knowledge_chunks", (colId) =>
          databases.updateDocument(DATABASE_ID, colId, chunk.$id, { isActive })
        );
      }
    }
  } catch (err) {
    console.warn("Appwrite toggleDocument fallback:", err.message);
  }

  // Update local storage
  const docs = getLocalDocs().map((d) => (d.id === docId || d.$id === docId ? { ...d, isActive } : d));
  saveLocalDocs(docs);

  const chunks = getLocalChunks().map((c) => (c.documentId === docId ? { ...c, isActive } : c));
  saveLocalChunks(chunks);

  return true;
}

/**
 * Delete a knowledge document & its chunks.
 */
export async function deleteKnowledgeDocument(docId, fileId) {
  try {
    if (fileId) {
      try {
        await storage.deleteFile(KNOWLEDGE_BUCKET, fileId);
      } catch {}
    }

    await withCollectionFallback(DOCS_COLLECTION, "knowledge_documents", (colId) =>
      databases.deleteDocument(DATABASE_ID, colId, docId)
    );

    const chunkRes = await withCollectionFallback(CHUNKS_COLLECTION, "knowledge_chunks", (colId) =>
      databases.listDocuments(DATABASE_ID, colId, [Query.equal("documentId", docId)])
    );

    if (chunkRes && chunkRes.documents) {
      for (const chunk of chunkRes.documents) {
        await withCollectionFallback(CHUNKS_COLLECTION, "knowledge_chunks", (colId) =>
          databases.deleteDocument(DATABASE_ID, colId, chunk.$id)
        );
      }
    }
  } catch (err) {
    console.warn("Appwrite deleteDocument fallback:", err.message);
  }

  // Update local storage
  const docs = getLocalDocs().filter((d) => d.id !== docId && d.$id !== docId);
  saveLocalDocs(docs);

  const chunks = getLocalChunks().filter((c) => c.documentId !== docId);
  saveLocalChunks(chunks);

  return true;
}

const COMMON_STOP_WORDS = new Set([
  "what", "where", "when", "which", "who", "whom", "whose", "why", "how",
  "does", "do", "did", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having", "can", "could", "would", "should", "will",
  "shall", "may", "might", "must", "you", "your", "yours", "me", "my", "we",
  "our", "us", "they", "them", "their", "this", "that", "these", "those",
  "the", "a", "an", "and", "or", "but", "if", "because", "as", "until",
  "while", "of", "at", "by", "for", "with", "about", "against", "between",
  "into", "through", "during", "before", "after", "above", "below", "to",
  "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
  "further", "then", "once", "here", "there", "any", "both", "each", "few",
  "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own",
  "same", "so", "than", "too", "very", "tell", "give", "offer", "please", "there", "specifically"
]);

// Official VOKTAA Instant Q&A Dictionary Map (Direct Document Match)
export const OFFICIAL_QA_DATA = [
  {
    id: "qa_1_what_is_voktaa",
    question: "What is VOKTAA Solutions?",
    answer: "VOKTAA Solutions is a corporate learning and employability training company based in Andhra Pradesh, India. We help students and professionals build the communication, soft skills, and interview readiness needed to succeed — our philosophy is 'Communication changes destinies.'",
    patterns: [
      "what is voktaa", "tell me about voktaa", "about voktaa", "what is voktaa solutions", "who is voktaa", "what company is voktaa", "philosophy of voktaa"
    ]
  },
  {
    id: "qa_2_stand_for",
    question: "What does VOKTAA stand for?",
    answer: "Voice. Knowledge. Training. Always Ahead.",
    patterns: [
      "stand for", "full form of voktaa", "meaning of voktaa", "acronym", "tagline", "speak shine succeed"
    ]
  },
  {
    id: "qa_3_who_is_for",
    question: "Who is VOKTAA for?",
    answer: "Engineering college students, school students, job aspirants, and corporate teams looking to build communication, soft skills, and placement readiness.",
    patterns: [
      "who is voktaa for", "target audience", "who can join voktaa", "who can enroll", "is voktaa for me"
    ]
  },
  {
    id: "qa_4_location",
    question: "Where is VOKTAA located?",
    answer: "We're based in Guntur, Andhra Pradesh, India.",
    patterns: [
      "where is voktaa located", "where is voktaa", "location", "address", "guntur", "city", "where are you based"
    ]
  },
  {
    id: "qa_5_contact",
    question: "How do I contact VOKTAA?",
    answer: "You can call us at +91 74161 13199, email voktaasolutions@gmail.com, or visit voktaa.com.",
    patterns: [
      "how do i contact voktaa", "contact details", "phone number", "call number", "whatsapp number", "email address", "reach voktaa"
    ]
  },
  {
    id: "qa_6_courses_offered",
    question: "What courses does VOKTAA offer?",
    answer: "Our training is built around four core pillars — Communication Skills, Business Skills, Corporate Training for Engineering Graduates, and Interview Skills — delivered through flagship programs like Launchpad 360 and Speak Bold.",
    patterns: [
      "what courses does voktaa offer", "what courses do you offer", "list of courses", "programmes offered", "four pillars", "core pillars", "all courses"
    ]
  },
  {
    id: "qa_7_launchpad_360",
    question: "What is Launchpad 360?",
    answer: "Launchpad 360 is VOKTAA's flagship placement-readiness program covering communication, soft skills, and interview preparation to get students career-ready.",
    patterns: [
      "what is launchpad 360", "launchpad 360", "launchpad", "launch pad", "campus to cubicle"
    ]
  },
  {
    id: "qa_8_speak_bold",
    question: "What is Speak Bold?",
    answer: "Speak Bold is VOKTAA's program focused on spoken English and public-speaking confidence, helping learners communicate clearly and assertively.",
    patterns: [
      "what is speak bold", "speak bold", "speakbold", "stage presence", "voice modulation"
    ]
  },
  {
    id: "qa_9_crt",
    question: "Does VOKTAA offer Campus Recruitment Training (CRT)?",
    answer: "Yes — our Campus Recruitment Training (CRT) programs prepare engineering students for aptitude tests, group discussions, and interviews as part of campus placement drives.",
    patterns: [
      "does voktaa offer campus recruitment training", "campus recruitment training", "crt", "aptitude tests", "group discussions", "placement drives"
    ]
  },
  {
    id: "qa_10_teachers_trainers",
    question: "Does VOKTAA train teachers/trainers too?",
    answer: "Yes, we run Train the Trainers programs to help educators and trainers strengthen their own delivery and communication skills.",
    patterns: [
      "train teachers", "train trainers", "teachers", "trainers", "train the trainers", "ttt", "educators", "faculty development", "fdp"
    ]
  },
  {
    id: "qa_11_spoken_english",
    question: "Do you offer spoken English classes?",
    answer: "Yes, spoken English and public speaking are core parts of our Communication Skills training and the Speak Bold program.",
    patterns: [
      "spoken english", "spoken english classes", "learn english", "english speaking"
    ]
  },
  {
    id: "qa_12_interview_prep",
    question: "Do you offer interview preparation?",
    answer: "Yes — Interview Skills is one of our four core training pillars, covering mock interviews, resume/CV guidance, and confidence-building.",
    patterns: [
      "do you offer interview preparation", "interview preparation", "interview prep", "mock interviews", "resume guidance", "cv preparation"
    ]
  },
  {
    id: "qa_13_school_students",
    question: "Is there training for school students?",
    answer: "Yes, VOKTAA has developed age-appropriate communication and soft-skills content for school students.",
    patterns: [
      "is there training for school students", "school students", "school kids", "school children", "schools"
    ]
  },
  {
    id: "qa_14_engineering_students",
    question: "Is there training for engineering college students specifically?",
    answer: "Yes — Corporate Training for Engineering Graduates is one of our four core pillars, designed to make engineering students industry- and interview-ready.",
    patterns: [
      "is there training for engineering college students specifically", "engineering college students", "engineering students", "engineering graduates", "btech students"
    ]
  },
  {
    id: "qa_15_course_duration",
    question: "How long are the courses?",
    answer: "Course duration depends on the program you choose — options are available at 30 days, 40 days, or 60 days.",
    patterns: [
      "how long are the courses", "course duration", "duration of courses", "30 days", "40 days", "60 days", "how many days"
    ]
  },
  {
    id: "qa_16_course_fee",
    question: "What is the fee for VOKTAA courses?",
    answer: "Please contact us at +91 74161 13199 or voktaasolutions@gmail.com for current fee details.",
    patterns: [
      "what is the fee for voktaa courses", "course fee", "fees", "fee", "cost", "price", "pricing", "how much"
    ]
  },
  {
    id: "qa_17_online_offline",
    question: "Are classes online or offline?",
    answer: "Both — VOKTAA offers courses in Online and Offline modes.",
    patterns: [
      "are classes online or offline", "online or offline", "online classes", "offline classes", "mode of training"
    ]
  },
  {
    id: "qa_18_certificate",
    question: "Do I get a certificate after completing a course?",
    answer: "Yes, a certificate is provided on successful completion of the course.",
    patterns: [
      "do i get a certificate after completing a course", "certificate", "certification", "completion certificate", "do you provide certificate"
    ]
  },
  {
    id: "qa_19_enroll",
    question: "How do I enroll in a VOKTAA course?",
    answer: "You can enroll by calling us at +91 74161 13199, emailing voktaasolutions@gmail.com, or visiting voktaa.com.",
    patterns: [
      "how do i enroll in a voktaa course", "how to enroll", "how to join", "enrollment process", "registration"
    ]
  },
  {
    id: "qa_20_corporate_teams",
    question: "Does VOKTAA train corporate teams or only students?",
    answer: "We work with both — engineering colleges and school students, as well as corporate teams and job aspirants.",
    patterns: [
      "does voktaa train corporate teams or only students", "corporate teams", "train corporate teams", "corporate training", "only students", "companies"
    ]
  },
  {
    id: "qa_21_campus_visit",
    question: "Does VOKTAA visit college campuses for training?",
    answer: "Yes, VOKTAA provides on-campus institutional training programs for engineering and degree colleges across Andhra Pradesh.",
    patterns: [
      "does voktaa visit college campuses for training", "visit college campuses", "on campus training", "campus training", "college campus"
    ]
  },
  {
    id: "qa_22_who_trains",
    question: "Who trains at VOKTAA?",
    answer: "VOKTAA's training is led by experienced faculty with a background in English language teaching and soft-skills training for engineering and job-aspirant audiences.",
    patterns: [
      "who trains at voktaa", "who trains", "trainers profile", "faculty background", "trainer qualification"
    ]
  },
  {
    id: "qa_23_why_voktaa",
    question: "Why should I choose VOKTAA over other training institutes?",
    answer: "VOKTAA combines nearly two decades of English-language and soft-skills teaching experience with training built specifically for engineering graduates and job aspirants.",
    patterns: [
      "why should i choose voktaa over other training institutes", "why choose voktaa", "why voktaa", "why join voktaa", "best training institute"
    ]
  }
];

/**
 * Search active knowledge base chunks to answer user questions.
 * @param {string} question 
 * @returns {Promise<string|null>}
 */
export async function searchKnowledgeBase(question) {
  if (!question || typeof question !== "string" || question.trim().length < 2) {
    return null;
  }

  const rawClean = question
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 1. Direct Official Q&A Map Match (Instant 100% Accuracy for document questions)
  for (const qa of OFFICIAL_QA_DATA) {
    if (qa.patterns.some((pattern) => rawClean.includes(pattern) || pattern.includes(rawClean))) {
      return qa.answer;
    }
  }

  const allTerms = rawClean.split(/\s+/).filter((t) => t.length > 1);
  const meaningfulTerms = allTerms.filter((t) => !COMMON_STOP_WORDS.has(t) && t.length > 1);
  const queryTerms = meaningfulTerms.length > 0 ? meaningfulTerms : allTerms;

  if (queryTerms.length === 0) return null;

  // Fetch active chunks from Appwrite DB + local fallback
  let activeChunks = [];
  try {
    const res = await withCollectionFallback(CHUNKS_COLLECTION, "knowledge_chunks", (colId) =>
      databases.listDocuments(DATABASE_ID, colId, [Query.equal("isActive", true), Query.limit(100)])
    );
    if (res && res.documents && res.documents.length > 0) {
      activeChunks = res.documents;
    }
  } catch {}

  if (!activeChunks || activeChunks.length === 0) {
    activeChunks = getLocalChunks().filter((c) => c.isActive !== false);
  }

  if (!activeChunks || activeChunks.length === 0) return null;

  const fullPhrase = queryTerms.join(" ");

  // Intent Flags
  const isFeeIntent = queryTerms.some((t) => ["fee", "fees", "cost", "price", "pricing", "charge", "charges", "tuition"].includes(t)) || rawClean.includes("how much");
  const isAcronymIntent = rawClean.includes("stand for") || rawClean.includes("full form") || rawClean.includes("acronym") || rawClean.includes("tagline");
  const isLaunchpadIntent = rawClean.includes("launchpad") || rawClean.includes("launch pad") || rawClean.includes("campus to cubicle");
  const isSpeakBoldIntent = rawClean.includes("speak bold") || rawClean.includes("spoken english") || rawClean.includes("voice modulation") || rawClean.includes("stage presence");
  const isCrtIntent = queryTerms.includes("crt") || rawClean.includes("campus recruitment") || rawClean.includes("mock interview") || rawClean.includes("aptitude test");
  const isTttIntent = rawClean.includes("train the trainer") || rawClean.includes("ttt") || queryTerms.includes("faculty") || queryTerms.includes("educator");
  const isDurationIntent = rawClean.includes("duration") || rawClean.includes("how long") || rawClean.includes("mode") || rawClean.includes("certificate");
  const isSchoolIntent = queryTerms.includes("school") || rawClean.includes("school kids");
  const isPartnerIntent = rawClean.includes("mou") || rawClean.includes("naac") || rawClean.includes("nirf") || rawClean.includes("accreditation") || rawClean.includes("partner");
  const isReviewIntent = rawClean.includes("review") || rawClean.includes("testimonial") || rawClean.includes("rating");
  const isLocationIntent = rawClean.includes("location") || rawClean.includes("address") || rawClean.includes("guntur") || rawClean.includes("contact number") || rawClean.includes("phone number");

  // Score each chunk based on phrase match, term frequency, subject position, and audience alignment
  const scoredChunks = activeChunks
    .map((chunk) => {
      const contentLower = chunk.content.toLowerCase();
      const headerArea = contentLower.slice(0, 45);
      let score = 0;
      let matchedTerms = 0;

      // Direct Topic Intent Triggers (+30 pts)
      if (isFeeIntent && (headerArea.includes("fee") || headerArea.includes("enrollment") || contentLower.includes("fees") || contentLower.includes("pricing"))) {
        score += 30;
      }
      if (isAcronymIntent && (headerArea.includes("voktaa stands for") || contentLower.includes("voice, knowledge"))) {
        score += 30;
      }
      if (isLaunchpadIntent && headerArea.includes("launchpad 360")) {
        score += 30;
      }
      if (isSpeakBoldIntent && headerArea.includes("speak bold")) {
        score += 30;
      }
      if (isCrtIntent && (headerArea.includes("campus recruitment training") || headerArea.includes("crt"))) {
        score += 30;
      }
      if (isTttIntent && (headerArea.includes("train the trainers") || headerArea.includes("ttt"))) {
        score += 30;
      }
      if (isDurationIntent && headerArea.includes("course duration")) {
        score += 30;
      }
      if (isSchoolIntent && headerArea.includes("school students")) {
        score += 30;
      }
      if (isPartnerIntent && headerArea.includes("institutional partnerships")) {
        score += 30;
      }
      if (isReviewIntent && headerArea.includes("student reviews")) {
        score += 30;
      }
      if (isLocationIntent && headerArea.includes("location & office")) {
        score += 30;
      }

      // Check Target Audience Mismatch Penalty:
      if (headerArea.includes("school") && !isSchoolIntent) {
        score -= 25;
      }
      if ((headerArea.includes("train the trainers") || headerArea.includes("ttt")) && !isTttIntent) {
        score -= 20;
      }

      // Check Target Audience Alignment Bonus:
      if ((queryTerms.includes("engineering") || queryTerms.includes("college")) && (headerArea.includes("campus recruitment") || headerArea.includes("crt") || contentLower.includes("engineering graduates"))) {
        score += 15;
      }

      // 1. Exact multi-word phrase match (large bonus)
      if (fullPhrase.length > 3 && contentLower.includes(fullPhrase)) {
        score += 10;
        const phraseIdx = contentLower.indexOf(fullPhrase);
        if (phraseIdx <= 35) {
          score += 8; // Bonus when phrase is the subject header of the chunk
        }
      }

      // 2. Individual term scoring & position (with plural/stemming support)
      queryTerms.forEach((term) => {
        const stem = term.endsWith("s") ? term.slice(0, -1) : term;
        if (contentLower.includes(term) || contentLower.includes(stem)) {
          score += 3;
          matchedTerms++;

          // Bonus for exact word boundary match
          const regex = new RegExp(`\\b${stem}\\w*\\b`, "i");
          if (regex.test(chunk.content)) {
            score += 2;
          }

          // Bonus if term appears near the start of the chunk
          const termIdx = contentLower.indexOf(stem);
          if (termIdx >= 0 && termIdx <= 40) {
            score += 4;
          }
        }
      });

      // 3. Multi-term match bonus
      if (matchedTerms > 1) {
        score += matchedTerms * 3;
      }

      // 4. Match Ratio (Percentage of query terms present)
      const matchRatio = matchedTerms / queryTerms.length;
      if (matchRatio === 1) {
        score += 5;
      }

      return { ...chunk, score, matchedTerms, matchRatio };
    })
    .filter((item) => {
      if (queryTerms.length >= 3) {
        return item.score >= 8 && item.matchRatio >= 0.5;
      }
      return item.score >= 5;
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Secondary tie-breaker: shorter content (higher density)
      return a.content.length - b.content.length;
    });

  if (scoredChunks.length === 0) {
    return null;
  }

  return scoredChunks[0].content;
}
