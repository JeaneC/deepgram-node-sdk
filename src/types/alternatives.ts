import { ParagraphGroup } from "./paragraphGroup";
import { WordBase } from "./wordBase";

export type Alternative = {
  /**
   * Text of speech identified by API
   */
  transcript: string;
  /**
   * Confidence in transcript generated
   */
  confidence: number;
  /**
   * Array of words included in the transcript
   */
  words: Array<WordBase>;
  /**
   * Array of paragraph objects.
   */
  paragraphs?: Array<ParagraphGroup>;
  /**
   * String indicating the detected language. eg: 'en'
   */
  detected_language?: string;
};