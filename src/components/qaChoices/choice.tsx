import React from 'react';

import { FaTrashAlt } from 'react-icons/fa';

import Radio, { RadioProps } from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';

import { withStyles, makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { StyledChoiceButton } from './style';
import EditableLabel from '../editable/label';
import EditableThumbnail from '../editable/thumbnail';
import { Choice as IChoice } from './IData/choices';

type onSelectType = (uuid: string) => void;
type deleteChoice = (uuid: string) => void;
type onChange = (choice: IChoice) => void;

interface ChoiceProps {
  choice: IChoice;
  index: number;
  editMode: boolean;
  onSelect: onSelectType;
  selected: boolean;
  deleteChoice: deleteChoice;
  onChange: onChange;
}

const BlueRadio = withStyles({
  root: {
    // color: blue[400],
    '&$checked': {
      color: '#1caff6',
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

const Choice: React.FC<ChoiceProps> = props => {
  const { choice, index, editMode, onSelect, deleteChoice, onChange } = props;
  // const classesRadio = useRadioStyle();

  const [state, setState] = React.useState({
    hovered: false,
  });

  const onDeleteChoiceClick = (e: any): void => {
    e.stopPropagation(); // do not select choice
    deleteChoice(choice.uuid);
  };

  const handleChange = (): void => {
    onSelect(choice.uuid);
  };

  const onHover = (): void => {
    if (editMode) {
      setState({ hovered: !state.hovered });
    } else {
      setState({ hovered: false });
    }
  };

  const onTextChange = (text: string) => {
    choice.content.text = text;
    onChange(choice);
  };

  const onImageChange = (image: string) => {
    // choice.content.text = text;
    // onChange(choice);
  };

  return (
    <StyledChoiceButton style={{ flexGrow: 1 }} onClick={handleChange} onMouseOver={onHover} onMouseOut={onHover}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={2} md={1}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={2}>
              <div title="Delete answer" style={{ display: editMode && state.hovered ? 'block' : 'none' }}>
                <FaTrashAlt onClick={onDeleteChoiceClick} />
              </div>
              <span style={{ display: editMode && state.hovered ? 'none' : 'block' }}>{index}</span>
            </Grid>
            <Grid item xs={3}>
              <BlueRadio
                checked={props.selected}
                onChange={handleChange}
                style={{ marginLeft: '10%' }}
                // inputProps={{ 'aria-label': 'B' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8} md={10}>
          <EditableLabel onChange={onTextChange} value={choice.content.text} editMode={editMode} cursorPointer={true} />
        </Grid>
        <Grid item xs={2} md={1}>
          <span style={{ display: editMode && state.hovered ? 'block' : 'none' }}>
            <EditableThumbnail image={choice.content.image} editMode={editMode} onImageChange={onImageChange} />
          </span>
        </Grid>
      </Grid>
    </StyledChoiceButton>
  );
};

export default Choice;
