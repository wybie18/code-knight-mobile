export interface NextContent {
  type: "lesson" | "code" | "quiz" | "congratulations";
  content: {
    id: string;
    title: string;
    slug?: string;
  };
  module: {
    id: string;
    title: string;
    slug: string;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface PrevContent {
  type: "lesson" | "code" | "quiz";
  content: {
    id: string;
    title: string;
    slug?: string;
  };
  module: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface NavigationContext {
  current_index: number;
  total_content: number;
  has_previous: boolean;
  has_next: boolean;
  previous?: PrevContent;
  next?: NextContent;
}

export interface CourseCompletionData {
  type: "congratulations";
  course: {
    id: string;
    title: string;
    slug: string;
  };
}

export function isCourseCompletionData(
  data: NextContent | CourseCompletionData
): data is CourseCompletionData {
  return data.type === "congratulations";
}
