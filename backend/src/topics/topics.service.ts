import { Injectable } from '@nestjs/common';
import { TopicDto } from './dto/topic.dto';

@Injectable()
export class TopicsService {
  /** Мок-данные; позже — из БД */
  private readonly topics: TopicDto[] = [
    {
      id: 'topic-present-simple',
      name: 'Простое время',
      description: 'Present Simple, Past Simple, Future Simple.',
      order: 1,
    },
    {
      id: 'topic-continuous',
      name: 'Длительные времена',
      description: 'Present Continuous, Past Continuous.',
      order: 2,
    },
  ];

  findAll(): TopicDto[] {
    return [ ...this.topics ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
}
