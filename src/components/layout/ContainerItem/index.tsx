import React from 'react';

import Grid from '@material-ui/core/Grid';

import { useStyles } from '../ContainerItem/style';

// TODO use styles for PIB Container Item
const ContainerItem: React.FC = props => {
  const classes = useStyles();

  const newProps = {
    // default props
    item: true,
    xs: 12,
    md: 6,
    ...props,
  } as React.HTMLAttributes<any>;

  // return <Grid {...newProps}></Grid>;
  return <Grid className={classes.root} {...newProps}></Grid>;
  // return <Grid container className={classes.root} {...newProps}></Grid>;
};

export default ContainerItem;
