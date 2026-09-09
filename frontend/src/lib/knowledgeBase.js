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
    content: "Campus Recruitment Training (CRT): Yes, VOKTAA offers Campus Recruitment Training (CRT) preparing engineering students for aptitude tests, group discussions, technical and HR mock interviews as part of campus placement drives.",
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
    content: "Enrollment & Contact Info: To enroll in a VOKTAA course or enquire about fees, call/WhatsApp +91 74161 13199 or +91 93902 46684, email voktaasolutions@gmail.com, or visit our website at voktaa.com / contact page.",
    isActive: true
  },
  {
    documentId: "seed_voktaa_qa_doc",
    chunkIndex: 9,
    content: "Who Trains at VOKTAA: VOKTAA's training is led by experienced faculty with nearly two decades of English language teaching and soft-skills training experience built specifically for engineering graduates and job aspirants.",
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
  "same", "so", "than", "too", "very", "tell", "give", "offer", "please"
]);

/**
 * Search active knowledge base chunks to answer user questions.
 * @param {string} question 
 * @returns {Promise<string|null>}
 */
export async function searchKnowledgeBase(question) {
  if (!question || typeof question !== "string" || question.trim().length < 2) {
    return null;
  }

  const rawClean = question.toLowerCase().replace(/[^\w\s]/g, " ").trim();
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

  // Score each chunk based on phrase match, term frequency, subject position, and density
  const scoredChunks = activeChunks
    .map((chunk) => {
      const contentLower = chunk.content.toLowerCase();
      let score = 0;
      let matchedTerms = 0;

      // 1. Exact multi-word phrase match (large bonus)
      if (fullPhrase.length > 3 && contentLower.includes(fullPhrase)) {
        score += 10;
        const phraseIdx = contentLower.indexOf(fullPhrase);
        if (phraseIdx <= 35) {
          score += 8; // Bonus when phrase is the subject header of the chunk
        }
      }

      // 2. Individual term scoring & position
      queryTerms.forEach((term) => {
        if (contentLower.includes(term)) {
          score += 3;
          matchedTerms++;

          // Bonus for exact word boundary match
          const regex = new RegExp(`\\b${term}\\b`, "i");
          if (regex.test(chunk.content)) {
            score += 2;
          }

          // Bonus if term appears near the start of the chunk
          const termIdx = contentLower.indexOf(term);
          if (termIdx >= 0 && termIdx <= 40) {
            score += 4;
          }
        }
      });

      // 3. Multi-term match bonus
      if (matchedTerms > 1) {
        score += matchedTerms * 3;
      }

      // 4. Match Ratio (100% query terms present)
      const matchRatio = matchedTerms / queryTerms.length;
      if (matchRatio === 1) {
        score += 5;
      }

      return { ...chunk, score, matchedTerms };
    })
    .filter((item) => item.score >= 5)
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
