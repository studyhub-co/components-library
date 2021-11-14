import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import { base } from '../../style';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      borderRadius: '1vw',
      backgroundColor: 'white',
      boxShadow: '0 0 1vw #d8d8d8',
      textAlign: 'center',
    },
  }),
);
