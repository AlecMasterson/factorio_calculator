import React from 'react';
import {
  Box,
  Card,
  CssBaseline,
  Dialog,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal
} from '@mui/material';
import {createTheme, Theme, ThemeProvider} from '@mui/material/styles';
import darkScrollbar from '@mui/material/darkScrollbar';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import App from './App';
import {Node, NodeMachine} from './types/Node';
import AddConstant from './components/AddConstant';
import AddMachine from './components/AddMachine';

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
const DefaultNodes: {[id: string]: NodeMachine} = {
  '0': {
    count: 1,
    cycle: 10,
    id: '0',
    ingredients: {
      '0': {id: '0', name: 'Copper', rate: {['-1']: 2, ['-2']: 5}, value: 2},
      '1': {id: '1', name: 'Iron', rate: {[-1]: 6}, value: 3}
    },
    modules: {},
    multiplier: 1,
    name: 'Test Machine 1',
    position: {x: 10, y: 10},
    products: {
      '0': {id: '0', name: 'Gear', rate: (6/3)*4, targets: [], value: 4},
      '1': {id: '1', name: 'Taco', rate: (6/3)*3, targets: [], value: 3}
    }
  },
  '1': {
    count: 1,
    cycle: 10,
    id: '1',
    ingredients: {
      '0': {id: '0', name: 'Gear', rate: {}, value: 1}
    },
    modules: {},
    multiplier: 1,
    name: 'Test Machine 2',
    position: {x: 500, y: 200},
    products: {
      '0': {id: '0', name: 'Idk', rate: 0, targets: [], value: 2}
    }
  },
  '2': {
    count: 1,
    cycle: 10,
    id: '2',
    ingredients: {
      '0': {id: '0', name: 'Idk', rate: {}, value: 6}
    },
    modules: {},
    multiplier: 1,
    name: 'Test Machine 3',
    position: {x: 1000, y: 400},
    products: {
      '0': {id: '0', name: 'Idk Tier 2', rate: 0, targets: [], value: 2}
    }
  },
  '3': {
    count: 1,
    cycle: 10,
    id: '3',
    ingredients: {
      '0': {id: '0', name: 'Gear', rate: {}, value: 2}
    },
    modules: {},
    multiplier: 1,
    name: 'Test Machine 4',
    position: {x: 500, y: 600},
    products: {
      '0': {id: '0', name: 'Something else', rate: 0, targets: [], value: 3}
    }
  }
};
const WidthDrawer: number = 240;

async function readCache(): Promise<{[id: string]: Node}> {
  try {
    const cache = await caches.open('Test');
    const cacheFile = await cache.match('http://localhost:5173');
    const data: {[id: string]: Node} = await cacheFile?.json();

    return data;
  } catch (error: unknown) {
    console.error('Failed to Read Cache', error);
    return {};
  }
}

async function writeCache(data: {[id: string]: Node}): Promise<void> {
  try {
    const cache = await caches.open('Test');
    cache.put('http://localhost:5173', new Response(JSON.stringify(data)));
  } catch (error: unknown) {
    console.error('Failed to Write Cache', error);
  }
}

export default function Main(): React.ReactElement {
  const [nodes, setNodes] = React.useState<{[id: string]: Node}>(DefaultNodes);
  const [showAddConstant, setShowAddConstant] = React.useState<boolean>(false);
  const [showAddNode, setShowAddNode] = React.useState<boolean>(false);

  React.useEffect(() => {
    readCache().then((data: {[id: string]: Node}): void => setNodes(data));
  }, []);

  function save(): void {
    writeCache(nodes);
  }

  function onAdd(node: Node): void {
    const newId: string = Object.keys(nodes).length.toString();

    setNodes({...nodes, [newId]: {...node, id: newId}});
  }

  return (
    <ThemeProvider theme={DarkTheme}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />

        <Drawer
          anchor='left'
          sx={{
            width: WidthDrawer,
            '& .MuiDrawer-paper': {
              width: WidthDrawer,
              boxSizing: 'border-box',
            }
          }}
          variant='permanent'
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={(): void => setShowAddConstant(true)}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>

                <ListItemText primary='Add Constant' />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={(): void => setShowAddNode(true)}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>

                <ListItemText primary='Add Machine' />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={save}>
                <ListItemIcon>
                  <SaveIcon />
                </ListItemIcon>

                <ListItemText primary='Save' />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
        </Drawer>

        <Dialog onClose={(): void => setShowAddConstant(false)} open={showAddConstant}>
          <DialogTitle>Add Constant</DialogTitle>

          <AddConstant onAdd={onAdd} />
        </Dialog>

        <Dialog onClose={(): void => setShowAddNode(false)} open={showAddNode}>
          <DialogTitle>Add Machine</DialogTitle>

          <AddMachine onAdd={onAdd} />
        </Dialog>

        <Box component='main'>
          <App nodes={nodes} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
