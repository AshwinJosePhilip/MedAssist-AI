/**
 * Summarizes a chat title from user input
 * Creates a concise, meaningful title for chat history
 */
export function summarizeChatTitle(input: string): string {
  // Generate a concise chat title (max 25 chars)
  const maxLength = 25;

  // Extract key topics or questions
  const topics = extractTopics(input);
  if (topics && topics.length <= maxLength) {
    return capitalizeFirstLetter(topics);
  }

  // Extract main subject
  const subject = extractSubject(input);
  if (subject && subject.length <= maxLength) {
    return capitalizeFirstLetter(subject);
  }

  // Fallback to smart truncation
  return smartTruncate(input, maxLength);
}

// Extract key topics from input
function extractTopics(input: string): string {
  // Look for question patterns
  const questionMatch = input.match(
    /(?:how|what|when|where|why|can|should|is|are)\s+(?:to|do|does|can|should|would|is|are)?\s*([^.?!]{3,25})[.?!]?/i,
  );
  if (questionMatch && questionMatch[1]) {
    return questionMatch[1].trim();
  }

  // Look for health topics
  const healthTopics = [
    "headache",
    "pain",
    "fever",
    "cough",
    "cold",
    "flu",
    "allergy",
    "diet",
    "workout",
    "exercise",
    "nutrition",
    "injury",
    "bleeding",
    "burn",
    "fracture",
    "diabetes",
    "heart",
    "blood pressure",
  ];

  for (const topic of healthTopics) {
    if (input.toLowerCase().includes(topic)) {
      const index = input.toLowerCase().indexOf(topic);
      const start = Math.max(0, index - 10);
      const end = Math.min(input.length, index + topic.length + 15);
      const context = input.substring(start, end);

      // Extract a clean phrase containing the topic
      const phrase = context
        .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
        .trim();
      if (phrase.length <= 25) {
        return phrase;
      }
    }
  }

  return "";
}

// Extract the main subject from input
function extractSubject(input: string): string {
  // Split into words and find meaningful phrases
  const words = input.split(/\s+/);
  if (words.length <= 5) {
    return words.join(" ");
  }

  // Try to extract a noun phrase
  const nounPhraseMatch = input.match(
    /(?:my|the|a|an)\s+([a-zA-Z\s]{3,25})(?:\s+is|\s+has|\s+feels|\.|,|;)/i,
  );
  if (nounPhraseMatch && nounPhraseMatch[1]) {
    return nounPhraseMatch[1].trim();
  }

  return "";
}

// Smart truncation that preserves whole words
function smartTruncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }

  // Find the last space within the maxLength
  const truncated = input.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength / 2) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
