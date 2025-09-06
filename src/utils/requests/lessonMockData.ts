interface Task {
  id: string;
  name: string;
  answer: string;
  options: string[];
}

interface LessonMockData {
  id: string;
  name: string;
  tasks: Task[]
}

export const lessonMockData: LessonMockData = {
  id: 'random-lesson-id',
  name: 'Present Simple',
  tasks: [
    {
      id: 'random-task-id',
      name: 'Я люблю гулять',
      answer: 'I love to walk',
      options: [ 'I', 'he',  'we', 'like', 'climbing', 'walking', 'working', 'watching', 'bathing' ],
    },
  ],
}