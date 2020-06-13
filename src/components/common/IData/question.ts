export interface Question {
  content: {
    text: string;
    image: string | File;
    hint: string;
  };
  type: string;
}

// User-Defined Type Guards
export function isQuestion(data: any): data is Question {
  if ('content' in (data as Question) && 'type' in (data as Question)) {
    // need to validate content and type
    return true;
  } else return false;
}
