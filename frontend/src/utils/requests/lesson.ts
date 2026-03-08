import { lessonMockData } from './lessonMockData';

export function lesson(id: string) {
  console.log('Fetching lesson:', id);
  return lessonMockData;
}