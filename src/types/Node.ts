import {ItemIngredient, ItemProduct} from './Item';
import {NodeType} from './NodeType';

export interface Node {
  id: string;
  name: string;
  position: {x: number, y: number};
  type: NodeType;
}

export interface NodeConstant extends Node {
  rate: number;
  targets: string[];
}

export interface NodeMachine extends Node {
  count: number;
  cycle: number;
  ingredients: {[id: string]: ItemIngredient};
  modules: {[type: string]: number};
  multiplier: number;
  products: {[id: string]: ItemProduct};
}
