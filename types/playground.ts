export interface ProgrammingLanguage {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  boilerplate_code: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string | null;
  stderr: string | null;
  error: string | null;
  execution_time: string | null;
  memory_usage: number | null;
}
