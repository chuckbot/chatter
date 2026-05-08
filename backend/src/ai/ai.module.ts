import { Module } from '@nestjs/common';
import { AI_PROVIDER } from './ai-client.interface';
import { GroqProvider } from './providers/groq.provider';

@Module({
  providers: [
    {
      provide: AI_PROVIDER,
      useClass: GroqProvider,
    },
  ],
  exports: [AI_PROVIDER],
})
export class AiModule {}
