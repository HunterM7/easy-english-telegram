import { IsNotEmpty, IsString } from 'class-validator';

export class TelegramOidcDto {
  @IsString()
  @IsNotEmpty()
    idToken: string;
}
