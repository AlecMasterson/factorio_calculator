export interface Item {
  id: string;
  name: string;
  value: number;
}

export interface ItemIngredient extends Item {
  rate: {[nodeId: string]: number};
}

export interface ItemProduct extends Item {
  percent: number;
  rate: number;
  targets: string[];
}
