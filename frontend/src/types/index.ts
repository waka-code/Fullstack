export interface Task {
  id?: string;
  name: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TaskFormData {
  name: string;
  completed: boolean;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TaskContextType {
  tasks: Task[];
  allTasks: Task[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchTasks: (page?: number) => Promise<void>;
  createTask: (task: TaskFormData) => Promise<void>;
  updateTask: (id: string, task: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  fetchAllTasks: () => Promise<void>;
}
