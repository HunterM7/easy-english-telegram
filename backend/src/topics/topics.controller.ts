import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TopicsService } from './topics.service';
import { TopicDto } from './dto/topic.dto';

@ApiTags('topics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Список учебных разделов (topics)' })
  @ApiResponse({ status: 200, description: 'Массив Topic', type: [ TopicDto ] })
  @ApiResponse({ status: 401, description: 'Нет или невалидный accessToken' })
  findAll(): TopicDto[] {
    return this.topicsService.findAll();
  }
}
