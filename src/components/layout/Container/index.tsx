import React, { createRef } from 'react';
import Grid from '@material-ui/core/Grid';
// import { withStyles } from '@material-ui/core/styles';
import { useStyles } from './style';

const Container: React.FC = props => {
  const classes = useStyles();
  const newProps = {
    container: true,
    spacing: 3,
    justify: 'center',
    ...props,
  } as React.HTMLAttributes<any>;

  return <Grid className={classes.root} {...newProps}></Grid>;
};

export default Container;
