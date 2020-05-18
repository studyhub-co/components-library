export interface Question {
  content: {
    text: string;
    image: string | File;
    hint: string;
  };
  type: string;
}
