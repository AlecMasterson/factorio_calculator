import {createSlice, Slice} from '@reduxjs/toolkit';
import {set} from 'lodash';
import {ItemIngredient, ItemProduct} from '../types/Item';
import {ItemMap} from '../types/ItemMap';
import {Node, NodeConstant, NodeMachine} from '../types/Node';
import {NodeMap} from '../types/NodeMap';
import {NodeType} from '../types/NodeType';

export const SliceNodes: Slice = createSlice({
  initialState: {},
  name: 'nodes',
  reducers: {
    addNode: (state: NodeMap, params: {payload: {node: Node}}): void => {
      const nodeId: string = Object.keys(state).length.toString();

      set(state, nodeId, {...params.payload.node, id: nodeId});
    },
    removeNode: (state: NodeMap, params: {payload: {nodeId: string}}): void => {
      delete state[params.payload.nodeId];
    },
    setNodes: (_: NodeMap, params: {payload: {nodes: NodeMap}}): NodeMap => {
      return {...params.payload.nodes};
    },
    updateIngredients: (state: NodeMap, params: {payload: {ingredients: ItemMap, nodeId: string}}): void => {
      if (state[params.payload.nodeId].type !== NodeType.MACHINE) {
        console.error('Attempted to Update Ingredients of Non-Machine Node');
        return;
      }

      (state[params.payload.nodeId] as NodeMachine).ingredients = params.payload.ingredients as {[id: string]: ItemIngredient};
    },
    updatePosition: (state: NodeMap, params: {payload: {nodeId: string, position: {x: number, y: number}}}): void => {
      state[params.payload.nodeId].position = params.payload.position;
    },
    updateProducts: (state: NodeMap, params: {payload: {nodeId: string, products: ItemMap}}): void => {
      if (state[params.payload.nodeId].type !== NodeType.MACHINE) {
        console.error('Attempted to Update Products of Non-Machine Node');
        return;
      }

      (state[params.payload.nodeId] as NodeMachine).products = params.payload.products as {[id: string]: ItemProduct};
    },
    updateTargets: (state: NodeMap, params: {payload: {nodeId: string, targets: string[]}}): void => {
      if (state[params.payload.nodeId].type !== NodeType.CONSTANT) {
        console.error('Attempted to Update Targets of Non-Constant Node');
        return;
      }

      (state[params.payload.nodeId] as NodeConstant).targets = params.payload.targets;
    }
  }
});

export const {
  addNode,
  removeNode,
  setNodes,
  updateIngredients,
  updatePosition,
  updateProducts,
  updateTargets
} = SliceNodes.actions;
