import { lessonMockData } from './lessonMockData';

export function lesson(id: string) {
  console.warn('Fetching lesson:', id);
  return lessonMockData;
}