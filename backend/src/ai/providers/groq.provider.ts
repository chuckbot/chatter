import { Observable, Observer } from 'rxjs';
import { AiProvider } from '../ai-client.interface';
import Groq from 'groq-sdk';
import { env } from '../../../config/env.config';
import { DOMAIN_SYSTEM_PROMPT } from '../../chat/llm/prompts/domain.prompt';

export class GroqProvider implements AiProvider {
  private client: Groq;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor() {
    if (!env.GROQ.API_KEY) throw new Error('GROQ_API_KEY is not set');
    this.client = new Groq({ apiKey: env.GROQ.API_KEY });
    this.model = env.GROQ.MODEL_NAME;
    this.temperature = env.GROQ.TEMPERATURE;
    this.maxTokens = env.GROQ.MAX_TOKENS;
  }

  async generateResponse(prompt: string): Promise<string> {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: DOMAIN_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      model: this.model,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });
    // eslint-disable-next-line prettier/prettier
    return chatCompletion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
  }

  generateStream(prompt: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      (async () => {
        try {
          const stream = await this.client.chat.completions.create({
            messages: [
              { role: 'system', content: DOMAIN_SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            model: this.model,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            stream: true,
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              observer.next(content);
            }
          }
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }
}
