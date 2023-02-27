const GOOGLE_TRANSLATOR_KEY = process.env.REACT_APP_GOOGLE_TRANSLATOR_API_KEY as string;
const GOOGLE_TRANSLATOR_API_ENDPOINT = `https://translation.googleapis.com/language/translate/v2`;
const LANGUAGE_DETECT_ENDPOINT = `${GOOGLE_TRANSLATOR_API_ENDPOINT}/detect`;

interface DetectResponse {
  data: ResponseData;
}

interface ResponseData {
  detections: Detection[][];
}

interface Detection {
  confidence: number;
  language: string;
  isReliable?: boolean;
}

const defaultLanguageCode = '';
const confidenceThreshold = 0.8;
const minContentLength = 5;
const cacheKeyLength = 20;
const lastDetectCache = new Map<string, Detection>();

/**
 * @param text - Text content
 * @returns Fetch post request body
 */
const generatePostRequest = (text: string) => {
  const form = new FormData();
  form.append('q', text);
  form.append('key', GOOGLE_TRANSLATOR_KEY);

  return {
    body: form,
    method: 'POST',
  };
};

/**
 * It can use md5 hash for accuracy over performance if need
 *
 * @param text - Text content
 * @returns A string key
 */
const generateCacheKey = (text: string) => text.substring(0, cacheKeyLength);

/**
 * Detect language from giving text content
 *
 * @param text - Text content
 * @returns A language iso 639 code
 */
async function detectLanguage(text: string): Promise<string> {
  if (text.length < minContentLength) return defaultLanguageCode;

  const cacheKey = generateCacheKey(text);
  const lastDetection = lastDetectCache.get(cacheKey);

  if (lastDetection) return lastDetection.language;

  const response = await fetch(LANGUAGE_DETECT_ENDPOINT, generatePostRequest(text));

  if (!response.ok) throw new Error('Detect language request failed');

  const { data }: DetectResponse = await response.json();

  // Find highest confident detection
  const detection = data?.detections
    ?.shift()
    ?.sort((d1, d2) => d1.confidence - d2.confidence)
    .pop();

  // Return detect language if confidence is high
  if (detection?.language && detection.confidence >= confidenceThreshold) {
    lastDetectCache.set(cacheKey, detection);

    return detection.language;
  }

  return defaultLanguageCode;
}

export { detectLanguage };
