import { Injectable, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as aiClientInterface from '../ai/ai-client.interface';

@Injectable()
export class ChatService {
  constructor(
    @Inject(aiClientInterface.AI_PROVIDER)
    private aiProvider: aiClientInterface.AiProvider,
  ) {}

  // Respuesta normal (sin streaming)
  async getReply(message: string): Promise<string> {
    return this.aiProvider.generateResponse(message);
  }

  // Respuesta con streaming (solo si el provider lo soporta)
  streamReply(message: string): Observable<string> {
    if (!this.aiProvider.generateStream) {
      throw new Error('Streaming not supported by current AI provider');
    }
    return this.aiProvider.generateStream(message);
  }
}
