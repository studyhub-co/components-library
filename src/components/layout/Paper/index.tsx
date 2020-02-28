import React, { createRef } from 'react';
import UIPaper from '@material-ui/core/Paper';

import { useStyles } from './style';

const Paper: React.FC = props => {
  const classes = useStyles();

  const newProps = {
    // default props
    ...props,
  } as React.HTMLAttributes<any>;

  return <UIPaper className={classes.root}>{props.children}</UIPaper>;
};

export default Paper;
