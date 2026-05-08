import { Observable } from 'rxjs';

export const AI_PROVIDER = 'AI_PROVIDER';

export interface AiProvider {
  generateResponse(prompt: string): Promise<string>;
  generateStream?(prompt: string): Observable<string>;
}
