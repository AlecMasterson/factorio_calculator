import {createSlice, Slice} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';
import {ItemIngredient, ItemProduct} from '../types/Item';
import {ItemMap} from '../types/ItemMap';
import {Node, NodeConstant, NodeMachine} from '../types/Node';
import {NodeMap} from '../types/NodeMap';
import {NodeType} from '../types/NodeType';

export const SliceNodes: Slice = createSlice({
  initialState: {},
  name: 'nodes',
  reducers: {
    addNode: (state: NodeMap, params: {payload: {node: Node}}): NodeMap => {
      const nodes: NodeMap = cloneDeep(state);
      const nodeId: string = Object.keys(nodes).length.toString();

      return {...nodes, [nodeId]: {...params.payload.node, id: nodeId}};
    },
    removeNode: (state: NodeMap, params: {payload: {nodeId: string}}): NodeMap => {
      const nodes: NodeMap = cloneDeep(state);
      delete nodes[params.payload.nodeId];

      return nodes;
    },
    resetConnections: (state: NodeMap): NodeMap => {
      const nodes: NodeMap = cloneDeep(state);

      Object.keys(nodes).forEach((nodeId: string): void => {
        if (nodes[nodeId].type === NodeType.CONSTANT) {
          (nodes[nodeId] as NodeConstant).targets = [];
        }

        if (nodes[nodeId].type === NodeType.MACHINE) {
          const ingredients: ItemMap = (nodes[nodeId] as NodeMachine).ingredients;
          const products: ItemMap = (nodes[nodeId] as NodeMachine).products;

          Object.keys(ingredients).forEach((id: string): void => {
            (ingredients[id] as ItemIngredient).rate = {};
          });
          Object.keys(products).forEach((id: string): void => {
            (products[id] as ItemProduct).rate = 0;
            (products[id] as ItemProduct).targets = [];
          });

          (nodes[nodeId] as NodeMachine).ingredients = ingredients as {[id: string]: ItemIngredient};
          (nodes[nodeId] as NodeMachine).products = products as {[id: string]: ItemProduct};
        }
      });

      return nodes;
    },
    setNodes: (_: NodeMap, params: {payload: {nodes: NodeMap}}): NodeMap => {
      return params.payload.nodes;
    },
    updateIngredients: (state: NodeMap, params: {payload: {ingredients: ItemMap, nodeId: string}}): NodeMap => {
      const nodes: NodeMap = cloneDeep(state);

      if (nodes[params.payload.nodeId].type !== NodeType.MACHINE) {
        console.error('Attempted to Update Ingredients of Non-Machine Node');
        return nodes;
      }

      (nodes[params.payload.nodeId] as NodeMachine).ingredients = params.payload.ingredients as {[id: string]: ItemIngredient};

      return nodes;
    },
    updatePosition: (state: NodeMap, params: {payload: {nodeId: string, position: {x: number, y: number}}}): NodeMap => {
      const nodes: NodeMap = cloneDeep(state);
      nodes[params.payload.nodeId].position = params.payload.position;

      return nodes;
    },
    updateProducts: (state: NodeMap, params: {payload: {nodeId: string, products: ItemMap}}): NodeMap => {
      const nodes: NodeMap = cloneDeep(state);

      if (nodes[params.payload.nodeId].type !== NodeType.MACHINE) {
        console.error('Attempted to Update Products of Non-Machine Node');
        return nodes;
      }

      (nodes[params.payload.nodeId] as NodeMachine).products = params.payload.products as {[id: string]: ItemProduct};

      return nodes;
    },
    updateTargets: (state: NodeMap, params: {payload: {nodeId: string, targets: string[]}}): NodeMap => {
      const nodes: NodeMap = cloneDeep(state);

      if (nodes[params.payload.nodeId].type !== NodeType.CONSTANT) {
        console.error('Attempted to Update Targets of Non-Constant Node');
        return nodes;
      }

      (nodes[params.payload.nodeId] as NodeConstant).targets = params.payload.targets;

      return nodes;
    }
  }
});

export const {
  addNode,
  removeNode,
  resetConnections,
  setNodes,
  updateIngredients,
  updatePosition,
  updateProducts,
  updateTargets
} = SliceNodes.actions;
