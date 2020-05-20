import React from 'react';

import { FaTrashAlt } from 'react-icons/fa';

import Radio, { RadioProps } from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';

import { withStyles, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { StyledChoiceButton } from './style';
import EditableLabel from '../editable/label';
import EditableThumbnail from '../editable/thumbnail';
import { Choice as IChoice } from './IData/choices';

type onSelectType = (uuid: string) => void;
type deleteChoice = (uuid: string) => void;
// type onChange = (choice: IChoice) => void;
type onImageChange = (file: File) => void;
type onTextChange = (text: string) => void;

interface ChoiceProps {
  choice: IChoice;
  index: number;
  editMode: boolean;
  onSelect: onSelectType;
  selected: boolean;
  cardMode: boolean;
  deleteChoice: deleteChoice;
  // onChange: onChange;
  onImageChange: onImageChange;
  onTextChange: onTextChange;
}

// card styles
const useCardStyles = makeStyles({
  root: {
    maxWidth: '15rem',
    display: 'inline-block',
    margin: '1rem',
  },
  media: {
    height: '10rem',
  },
});

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
  const { choice, index, editMode, onSelect, deleteChoice, onImageChange, onTextChange, cardMode } = props;
  // const { choice, index, editMode, onSelect, deleteChoice, onChange } = props;
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

  // const onTextChange = (text: string) => {
  //   choice.content.text = text;
  //   onChange(choice);
  // };
  //
  // const onImageChange = (image: string) => {
  //   // choice.content.text = text;
  //   // onChange(choice);
  // };

  const cardClasses = useCardStyles();

  // return cardMode ? (
  return true ? (
    <Card className={cardClasses.root}>
      <CardMedia className={cardClasses.media} image="" title="Contemplative Reptile" />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents
          except Antarctica
        </Typography>
      </CardContent>
    </Card>
  ) : (
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
