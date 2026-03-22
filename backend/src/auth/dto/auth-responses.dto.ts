import { ApiProperty } from '@nestjs/swagger';

/** Пользователь в ответах авторизации */
export class AuthUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  telegramId: string;

  @ApiProperty({ nullable: true })
  firstName: string | null;

  @ApiProperty({ nullable: true })
  lastName: string | null;

  @ApiProperty({ nullable: true })
  username: string | null;

  @ApiProperty({ nullable: true })
  photoUrl: string | null;
}

/** Пара токенов (ответ `login` / `refresh`) */
export class AuthTokensResponseDto {
  @ApiProperty({ description: 'JWT accessToken' })
  accessToken: string;

  @ApiProperty({ description: 'Opaque refreshToken (UUID)' })
  refreshToken: string;

  @ApiProperty({ description: 'TTL accessToken в секундах' })
  expiresIn: number;
}

/** Ответ POST /v1/auth/login */
export class LoginResponseDto extends AuthTokensResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  user: AuthUserResponseDto;
}
