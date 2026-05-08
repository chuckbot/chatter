import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'message cannot be empty' })
  message!: string;
}
