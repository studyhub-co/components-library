import * as t from 'io-ts';

const ChoiceContentIo = t.interface({
  text: t.string,
  image: t.string,
});

const HiddenFields = t.interface({
  selected: t.boolean,
});

export const ChoiceIo = t.interface({
  uuid: t.string,
  position: t.number,
  selected: t.boolean,
  type: t.literal('base'), // FIXME what types of choices do we need here? (was imagewtext)
  content: ChoiceContentIo,
  hiddenFields: HiddenFields,
  reactionResult: t.union([t.literal('none'), t.literal('correct'), t.literal('wrong')]), // FIXME we need use this only at the server side, but io-ts have not optional fields for now
});

export type Choice = t.TypeOf<typeof ChoiceIo>;

// interface ChoiceContent {
//   text: string;
//   image: string | File;
// }
//
// export interface Choice {
//   uuid: string;
//   position: number;
//   type: 'base'; // FIXME what types of choices do we need here? (was imagewtext)
//   content: ChoiceContent;
// }
