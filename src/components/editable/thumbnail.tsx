import React, { useEffect, useState, useRef } from 'react';
import { FaFileImage, FaImage } from 'react-icons/fa';

import { uuidV4 } from '../../utils/index';

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

interface EditableThumbnailProps {
  image: any;
  // cursorPointer: boolean;
  editMode: boolean;
  // showAddImageIcon: boolean;
  onImageChange: (image: any) => void;
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
  const { image, editMode, onImageChange } = props;
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

  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (image && image instanceof File && image.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(image);
      setImageSrc(objectUrl);
    }
  }, [image]);

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // console.log(event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      console.log(onImageChange);

      onImageChange(event.target.files[0]);
      // console.log(event.target.files);
    }
  };

  const inputId = uuidV4();

  return (
    <div>
      {/*{value && <img src={''} />}*/}
      {!editMode && imageSrc && <img width={'100%'} src={imageSrc} />}
      {editMode && (
        <React.Fragment>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={inputId}
            // multiple
            type="file"
            onChange={selectImage}
          />
          <label htmlFor={inputId}>
            {image && imageSrc ? (
              <img width={'100%'} src={imageSrc} style={{ cursor: 'pointer' }} />
            ) : (
              <FaFileImage style={{ cursor: 'pointer' }} size={'2rem'} />
            )}
          </label>
        </React.Fragment>
      )}
      {/*<div style={{ display: showAddImageIcon && editMode ? 'block' : 'none' }}>*/}
      {/*  <FaImage size={'2rem'} />*/}
      {/*</div>*/}
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
