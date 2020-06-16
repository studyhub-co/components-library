import * as t from 'io-ts';

export const VectorIo = t.interface({
  angle: t.number,
  xComponent: t.number,
  yComponent: t.number,
});

export type Vector = t.TypeOf<typeof VectorIo>;

// export interface Vector {
//   angle: number;
//   xComponent: number;
//   yComponent: number;
// }
