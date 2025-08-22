interface Task {
  id: number;
  name: string;
  answer: string;
  options: string[];
}

interface LessonMockData {
  id: number;
  name: string;
  tasks: Task[]
}

export const lessonMockData: LessonMockData = {
  id: 1,
  name: 'Present Simple',
  tasks: [
    {
      id: 1,
      name: 'Я люблю гулять',
      answer: 'I love to walk',
      options: [ 'I', 'he',  'we', 'like', 'climbing', 'walking', 'working', 'watching', 'bathing' ],
    },
  ],
}