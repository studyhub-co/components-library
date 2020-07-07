import React, { useEffect, useState } from 'react';

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
  userReactionState: string; // todo enum?
}

// card styles
const useCardStyles = makeStyles({
  root: {
    maxWidth: '15rem',
    display: 'inline-block',
    margin: '1rem',
    cursor: 'pointer',
  },
  media: {
    height: '10rem',
    overflow: 'hidden',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '0.5rem',
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
  const {
    choice,
    index,
    editMode,
    onSelect,
    deleteChoice,
    onImageChange,
    onTextChange,
    cardMode,
    userReactionState,
  } = props;
  // const { choice, index, editMode, onSelect, deleteChoice, onChange } = props;
  // const classesRadio = useRadioStyle();

  const [state, setState] = React.useState({
    hovered: false,
  });
  // const [imageSrc, setImageSrc] = useState<string>('');

  // useEffect(() => {
  //   if (
  //     choice &&
  //     choice.content &&
  //     choice.content.image instanceof File &&
  //     choice.content.image.type.startsWith('image/')
  //   ) {
  //     const objectUrl = URL.createObjectURL(choice.content.image);
  //     setImageSrc(objectUrl);
  //   }
  // }, [choice]);

  const onDeleteChoiceClick = (e: any): void => {
    e.stopPropagation(); // do not select choice
    deleteChoice(choice.uuid);
  };

  const handleChange = (): void => {
    onSelect(choice.uuid);
  };

  const onHover = (): void => {
    if (editMode) {
      setState({ hovered: true });
    } else {
      setState({ hovered: false });
    }
  };

  const onHoverOut = (): void => {
    setState({ hovered: false });
  };

  const cardClasses = useCardStyles();

  if (choice.reactionResult === 'wrong') {
    console.log(choice);
  }

  // TODO process userReactionState==reaction && choice.reactionResult to show correct\wrong answers

  return cardMode ? (
    // return true ? (
    <Card className={cardClasses.root} onClick={handleChange} onMouseOver={onHover} onMouseOut={onHoverOut}>
      {/*{imageSrc ? (*/}
      {/*  <CardMedia className={cardClasses.media} image={imageSrc} />*/}
      {/*) : (*/}
      {/*  <CardMedia className={cardClasses.media}></CardMedia>*/}
      {/*)}*/}
      <CardMedia className={cardClasses.media}>
        <EditableThumbnail image={choice.content.image} editMode={editMode} onImageChange={onImageChange} />
      </CardMedia>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="div">
          <EditableLabel onChange={onTextChange} value={choice.content.text} editMode={editMode} cursorPointer={true} />
        </Typography>
      </CardContent>
      <div className={cardClasses.controls}>
        <BlueRadio
          checked={props.selected}
          onChange={handleChange}
          // style={{ marginLeft: '5%' }}
          // inputProps={{ 'aria-label': 'B' }}
        />
        <span>
          <div title="Delete answer" style={{ display: editMode && state.hovered ? 'block' : 'none' }}>
            <FaTrashAlt onClick={onDeleteChoiceClick} />
          </div>
          <span style={{ display: editMode && state.hovered ? 'none' : 'block' }}>{index}</span>
        </span>
      </div>
    </Card>
  ) : (
    <StyledChoiceButton
      style={
        props.selected
          ? {
              color: '#1caff6',
              border: '0.2rem solid #1caff6',
            }
          : {}
      }
      onClick={handleChange}
      onMouseOver={onHover}
      onMouseOut={onHoverOut}
    >
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
