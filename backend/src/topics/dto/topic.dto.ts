import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Учебный раздел (grammar topic). В API: `Topic`, путь `GET /v1/topics`. */
export class TopicDto {
  @ApiProperty({ example: 'topic-present-simple' })
  id: string;

  @ApiProperty({ example: 'Простое время' })
  name: string;

  @ApiPropertyOptional({
    example: 'Present Simple, Past Simple, Future Simple.',
  })
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  order?: number;
}
