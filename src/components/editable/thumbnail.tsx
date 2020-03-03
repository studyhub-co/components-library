import React from 'react';
import { FaImage } from 'react-icons/fa';

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

interface EditableThumbnailProps {
  value: string;
  // cursorPointer: boolean;
  editMode: boolean;
  showAddImageIcon: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

const EditableThumbnail: React.FC<EditableThumbnailProps> = props => {
  const { value, editMode, showAddImageIcon } = props;
  // const classes = useStyles();

  // const [state, setState] = React.useState({
  //   hovered: false,
  // });

  // const onHover = () => {
  //   if (editMode) {
  //     setState({ hovered: !state.hovered });
  //   } else {
  //     setState({ hovered: false });
  //   }
  // };

  return (
    <div>
      {value && <img src={''} />}
      <div style={{ display: showAddImageIcon && editMode && !value ? 'block' : 'none' }}>
        <FaImage size={'2rem'} />
      </div>
      {/*<Fab className={classes.fab}>*/}
      {/*<BlueInput*/}
      {/*  // className={classes.margin}*/}
      {/*  defaultValue={value}*/}
      {/*  readOnly={!editMode}*/}
      {/*  inputProps={{*/}
      {/*    'aria-label': 'naked',*/}
      {/*    style: { cursor: editMode || props.cursorPointer ? 'pointer' : 'default' },*/}
      {/*  }}*/}
      {/*/>*/}
      {/*{state.hovered && <FaPencilAlt />}*/}
      {/*</Fab>*/}
    </div>
  );
};

export default EditableThumbnail;
