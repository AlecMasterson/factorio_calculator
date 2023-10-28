import {ItemIngredient, ItemProduct} from './Item';

export interface Node {
  id: string;
  name: string;
  position: {x: number, y: number};
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
