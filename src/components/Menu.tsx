// @ts-ignore
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import {
  Dialog,
  DialogTitle,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import UndoIcon from '@mui/icons-material/UndoOutlined';
import {Node} from '../types/Node';
import {NodeMap} from '../types/NodeMap';
import {setEdges} from '../store/StoreEdges';
import {addNode, resetConnections, setNodes} from '../store/StoreNodes';
import AddConstant from './AddConstant';
import AddMachine from './AddMachine';
import Util from '../Util';

const WidthDrawer: number = 240;

export default function Menu(): React.ReactElement {
  const dispatch: Dispatch = useDispatch();
  const edges: string[] = useSelector((state: {edges: string[]}): string[] => state.edges);
  const nodes: NodeMap = useSelector((state: {nodes: NodeMap}): NodeMap => state.nodes);
  const [showAddConstant, setShowAddConstant] = React.useState<boolean>(false);
  const [showAddMachine, setShowAddMachine] = React.useState<boolean>(false);

  function onAdd(node: Node): void {
    dispatch(addNode({node}));

    setShowAddConstant(false);
    setShowAddMachine(false);
  }

  function resetAll(): void {
    dispatch(setEdges({edges: []}));
    dispatch(setNodes({nodes: {}}));
  }

  function resetEdges(): void {
    dispatch(setEdges({edges: []}));
    dispatch(resetConnections({}));
  }

  function save(): void {
    Util.saveEdges(edges);
    Util.saveNodes(nodes);
  }

  return (
    <Drawer
      anchor='left'
      sx={{
        width: WidthDrawer,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: WidthDrawer
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
          <ListItemButton onClick={(): void => setShowAddMachine(true)}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>

            <ListItemText primary='Add Machine' />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={resetEdges}>
            <ListItemIcon>
              <UndoIcon />
            </ListItemIcon>

            <ListItemText primary='Reset Edges' />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={resetAll}>
            <ListItemIcon>
              <UndoIcon />
            </ListItemIcon>

            <ListItemText primary='Reset All' />
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

      <Dialog onClose={(): void => setShowAddConstant(false)} open={showAddConstant}>
        <DialogTitle>Add Constant</DialogTitle>

        <AddConstant onAdd={onAdd} />
      </Dialog>

      <Dialog onClose={(): void => setShowAddMachine(false)} open={showAddMachine}>
        <DialogTitle>Add Machine</DialogTitle>

        <AddMachine onAdd={onAdd} />
      </Dialog>
    </Drawer>
  );
}
