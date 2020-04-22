import React from 'react';

import { FaTimes, FaTrashAlt } from 'react-icons/fa';

import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import Fab from '@material-ui/core/Fab';

import { StyledChoiceButton } from './style';
import EditableLabel from '../editable/label';
import EditableThumbnail from '../editable/thumbnail';
// import { useRadioStyle } from './style';
import Radio, { RadioProps } from '@material-ui/core/Radio';

type onChangeType = (uuid: string) => void;
type deleteChoice = (uuid: string) => void;

interface ChoiceProps {
  choice: any; // TODO
  index: number;
  editMode: boolean;
  onChange: onChangeType;
  selected: boolean;
  deleteChoice: deleteChoice;
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
  const { choice, index, editMode, onChange, deleteChoice } = props;
  // const classesRadio = useRadioStyle();

  const [state, setState] = React.useState({
    hovered: false,
  });

  const onDeleteChoiceClick = (e: any) => {
    e.stopPropagation(); // do not select choice
    deleteChoice(choice.uuid);
  };

  const handleChange = () => {
    onChange(choice.uuid);
  };

  const onHover = () => {
    if (editMode) {
      setState({ hovered: !state.hovered });
    } else {
      setState({ hovered: false });
    }
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
              {/*following variant has flicker due icon is not mount to parent StyledChoiceButton*/}
              {/*{editMode && state.hovered ? (*/}
              {/*  <span title="Delete answer">*/}
              {/*    <FaTrashAlt onClick={onDeleteChoiceClick} />*/}
              {/*  </span>*/}
              {/*) : (*/}
              {/*  index*/}
              {/*)}*/}
              {/*</ChoiceIndex>*/}
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
          <EditableLabel value={choice.content.text} editMode={editMode} cursorPointer={true} />
        </Grid>
        <Grid item xs={2} md={1}>
          <EditableThumbnail value={''} showAddImageIcon={state.hovered} editMode={editMode} />
        </Grid>
      </Grid>
    </StyledChoiceButton>
  );
};

export default Choice;
