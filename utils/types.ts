export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Study' | 'Personal' | 'University' | 'Work' | 'Health';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  deadline: string | null; // ISO date string, or null if no deadline
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  notificationId?: string | null;
}

export interface AppData {
  userName: string | null;
  tasks: Task[];
  points: number;
  streak: number;
  lastCompletedDate: string | null; // toDateString()
}
