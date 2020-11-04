import * as t from 'io-ts';

export const QuestionIo = t.interface({
  content: t.type({
    text: t.string,
    evaluatedMathText: t.union([t.string, t.undefined]),
    image: t.string,
    hint: t.string,
  }),
  type: t.string,
});

export type Question = t.TypeOf<typeof QuestionIo>;

// not so good idea combine File type, because we need to work with REST data

// import { right, left, Either } from 'fp-ts/lib/Either';
//
// const FileType = new t.Type<File, string, unknown>(
//   'FileType',
//   (u): u is File => u instanceof File,
//   (u, c) => right(u),
//   a => {
//     return '';
//   },
// );

// export interface Question {
//   content: {
//     text: string;
//     image: string | File;
//     hint: string;
//   };
//   type: string;
// }
//
// // User-Defined Type Guards
// export function isQuestion(data: any): data is Question {
//   if ('content' in (data as Question) && 'type' in (data as Question)) {
//     // need to validate content and type
//     return true;
//   } else return false;
// }
