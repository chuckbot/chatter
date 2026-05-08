import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Endpoint POST normal
  @Post()
  @UseGuards(RateLimitGuard)
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const reply = await this.chatService.getReply(sendMessageDto.message);
    return { reply };
  }

  @Get('stream')
  @UseGuards(RateLimitGuard)
  @Sse()
  streamMessage(@Query('message') message: string): Observable<MessageEvent> {
    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty');
    }

    return this.chatService
      .streamReply(message)
      .pipe(map((chunk: string) => ({ data: chunk }) as MessageEvent));
  }
}
