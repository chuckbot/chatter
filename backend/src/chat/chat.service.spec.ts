import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { LlmService } from './llm/llm.service';

describe('ChatService', () => {
  let service: ChatService;
  let llmService: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: LlmService,
          useValue: {
            askGemini: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    llmService = module.get<LlmService>(LlmService);
  });

  it('debe devolver la respuesta del LLM', async () => {
    const mockReply = 'La arepa es un plato tradicional venezolano.';
    jest.spyOn(llmService, 'askGemini').mockResolvedValue(mockReply);
    const askGeminiSpy = jest
      .spyOn(llmService, 'askGemini')
      .mockResolvedValue(mockReply);
    await service.getReply('¿Qué es una arepa?');
    expect(askGeminiSpy).toHaveBeenCalledWith('¿Qué es una arepa?');
  });
});
