/**
 * Common Conversation Handler for VOKTAA Chatbot
 * Handles greetings, casual conversation, identity, help, thank you, and goodbye messages naturally.
 */

const GREETING_RESPONSES = [
  "Hi! 👋 Welcome to VOKTAA Solutions. How can I help you today?",
  "Hello! 😊 How can I assist you today?",
  "Hey there! 👋 What would you like to learn about VOKTAA today?"
];

const THANK_YOU_RESPONSES = [
  "You're most welcome! 😊 Feel free to ask me anything else.",
  "Glad I could help! 😊 Let me know if you need anything else about VOKTAA.",
  "Happy to help! 👍 Have a wonderful day!"
];

const GOODBYE_RESPONSES = [
  "Goodbye! 👋 Have a great day. Feel free to come back anytime if you have questions about VOKTAA.",
  "Bye! 👋 Have a wonderful day! Let us know whenever you need assistance."
];

/**
 * Get natural conversational response if user input matches common conversation intent.
 * @param {string} userText 
 * @returns {string|null}
 */
export function getCommonConversationResponse(userText) {
  if (!userText || typeof userText !== "string") return null;

  // Normalize input: lowercase, strip punctuation, remove excess spaces
  const clean = userText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return null;

  // 1. Greetings
  const exactGreetings = ["hi", "hello", "hey", "hi there", "hello there", "greetings", "hey there", "good morning", "good afternoon", "good evening"];
  if (exactGreetings.includes(clean)) {
    const idx = clean.length % GREETING_RESPONSES.length;
    return GREETING_RESPONSES[idx];
  }

  // 2. Casual / How are you / What's up
  if (clean.includes("how are you") || clean.includes("how r u") || clean.includes("how are u") || clean.includes("how are you doing") || clean.includes("what are you doing")) {
    return "I'm doing great, thank you for asking! 😊 How can I help you learn more about VOKTAA or our training programmes?";
  }

  if (clean.includes("whats up") || clean.includes("what up") || clean.includes("wbu") || clean.includes("hows it going")) {
    return "Not much—I'm here and ready to help! 😊 You can ask me about VOKTAA, our training programmes, courses, institutions, or anything else related to our services.";
  }

  // 3. Identity / Who are you
  if (clean.includes("who are you") || clean.includes("who r u") || clean.includes("what is your name") || clean.includes("who is this") || clean === "who") {
    return "I'm VOKTAA's virtual assistant. 😊 I can help you learn about our training programmes, courses, soft skills, placement preparation, and other VOKTAA services.";
  }

  // 4. Capabilities / What can you do
  if (clean.includes("what can you do") || clean.includes("what do you do") || clean.includes("can you help me") || clean.includes("help me") || clean.includes("how can you help")) {
    return "I can help answer questions about VOKTAA Solutions, our programmes, training courses, institutions, reviews, and other information available in our knowledge base.";
  }

  // 5. Thank you
  if (clean.includes("thank") || clean.includes("thanks") || clean === "ty" || clean === "thx") {
    const idx = clean.length % THANK_YOU_RESPONSES.length;
    return THANK_YOU_RESPONSES[idx];
  }

  // 6. Goodbye
  if (clean === "bye" || clean === "goodbye" || clean === "see you" || clean === "cya" || clean === "bye bye" || clean.includes("see u")) {
    const idx = clean.length % GOODBYE_RESPONSES.length;
    return GOODBYE_RESPONSES[idx];
  }

  return null;
}
