// @ts-ignore
import React from 'react';
import {useDispatch} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import {Box, CssBaseline} from '@mui/material';
import {createTheme, Theme, ThemeProvider} from '@mui/material/styles';
import darkScrollbar from '@mui/material/darkScrollbar';
import {NodeMap} from './types/NodeMap';
import {setEdges} from './store/StoreEdges';
import {setNodes} from './store/StoreNodes';
import App from './App';
import Menu from './components/Menu';
import Util from './Util';

const DarkTheme: Theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar()
      }
    }
  },
  palette: {
    background: {
      default: '#201D39',
      paper: '#4E4868'
    },
    mode: 'dark',
    primary: {
      main: '#00C899'
    },
    secondary: {
      main: '#F4ECFF'
    }
  }
});

export default function Main(): React.ReactElement {
  const dispatch: Dispatch = useDispatch();

  React.useEffect((): void => {
    Util.readNodes().then((nodes: NodeMap): void => {
      dispatch(setNodes({nodes}));

      Util.readEdges().then((edges: string[]): void => {
        dispatch(setEdges({edges}));
      });
    });
  }, []);

  return (
    <ThemeProvider theme={DarkTheme}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />

        <Menu />

        <Box component='main'>
          <App />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
