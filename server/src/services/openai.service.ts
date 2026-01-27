import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAI | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private initialize() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    } else {
        console.warn('OPENAI_API_KEY is not set in environment variables');
    }
  }

  public async getEmbeddings(text: string): Promise<number[] | null> {
    if (!this.openai) {
        // Try to re-initialize in case env var was set late
        this.initialize();
        if (!this.openai) {
             console.error('OpenAI client not initialized');
             return null;
        }
    }

    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error fetching embeddings from OpenAI:', error);
      return null;
    }
  }
}

export default OpenAIService.getInstance();
