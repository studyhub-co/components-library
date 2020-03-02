import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { FaTimes, FaTrashAlt } from 'react-icons/fa';

import { StyledChoiceButton, ChoiceIndex } from './style';
import EditableLabel from '../editable/label';
import { useRadioStyle } from './style';
import Radio, { RadioProps } from '@material-ui/core/Radio';

type onChangeType = (uuid: string) => void;

interface ChoiceProps {
  choice: any;
  index: number;
  editMode: boolean;
  onChange: onChangeType;
  selected: boolean;
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
  const { choice, index, editMode, onChange } = props;
  // const classesRadio = useRadioStyle();

  const [state, setState] = React.useState({
    hovered: false,
  });

  const onDeleteChoiceClick = (e: any) => {
    console.log(onDeleteChoiceClick);
    // this.props.onDeleteImageClick()
  };

  const handleChange = () => {
    onChange(choice.uuid);
  };

  return (
    <StyledChoiceButton style={{ flexGrow: 1 }} onClick={handleChange}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={1}>
          <ChoiceIndex>{state.hovered ? <FaTrashAlt onClick={onDeleteChoiceClick} /> : index}</ChoiceIndex>
          {/*<span>{state.hovered ? <FaTrashAlt onClick={onDeleteChoiceClick} /> : index}</span>*/}
          <BlueRadio
            checked={props.selected}
            onChange={handleChange}
            // inputProps={{ 'aria-label': 'B' }}
          />
        </Grid>
        <Grid item xs={9}>
          <EditableLabel value={choice.content.text} editMode={editMode} cursorPointer={true} />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </StyledChoiceButton>
  );
};

export default Choice;
