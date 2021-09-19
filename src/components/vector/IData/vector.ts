import * as t from 'io-ts';

export const VectorIo = t.interface({
  angle: t.number,
  xComponent: t.number,
  yComponent: t.number,
  magnitude: t.number,
});

export type Vector = t.TypeOf<typeof VectorIo>;
