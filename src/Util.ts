import Graph from 'graphology';
import {Connection} from 'reactflow';
import {Dispatch} from '@reduxjs/toolkit';
import {cloneDeep, min, set, sum, uniq, unset} from 'lodash';
import {ItemIngredient, ItemProduct} from './types/Item';
import {NodeConstant, NodeMachine} from './types/Node';
import {NodeMap} from './types/NodeMap';
import {NodeType} from './types/NodeType';
import {updateIngredients, updateProducts, updateTargets} from './store/StoreNodes';

const CacheLocation = 'http://localhost:5173';
const CacheNameEdges = 'Edges';
const CacheNameNodes = 'Nodes';

export default class Util {

  public static graphCanConnect(graph: Graph, connection: Connection): boolean {
    const nodeType: NodeType = graph.getNodeAttribute(connection.source, 'type');

    let sourceName: string;
    if (nodeType === NodeType.CONSTANT) {
      sourceName = graph.getNodeAttribute(connection.source, 'name');
    } else {
      sourceName = graph.getNodeAttribute(connection.source, 'products')[connection.sourceHandle].name;
    }

    const targetName: string = graph.getNodeAttribute(connection.target, 'ingredients')[connection.targetHandle].name;

    return sourceName === targetName;
  }

  public static graphEdgeAdded(dispatch: Dispatch, graph: Graph, params: {key: string}): void {
    const source: string = params.key.split(',')[0].split('-')[0];
    const sourceHandle: string = params.key.split(',')[0].split('-')[1];
    const target: string = params.key.split(',')[1].split('-')[0];

    const nodeType: NodeType = graph.getNodeAttribute(source, 'type');

    if (nodeType === NodeType.CONSTANT) {
      graph.updateNodeAttribute(source, 'targets', (temp: string[]): string[] => {
        const newTargets: string[] = uniq([...temp, target]);

        dispatch(updateTargets({nodeId: source, targets: newTargets}));
        return newTargets;
      });
    }

    if (nodeType === NodeType.MACHINE) {
      graph.updateNodeAttribute(source, 'products', (temp: {[id: string]: ItemProduct}): {[id: string]: ItemProduct} => {
        const newTemp: {[id: string]: ItemProduct} = cloneDeep(temp);
        set(newTemp, `${sourceHandle}.targets`, uniq([...newTemp[sourceHandle].targets, target]));

        dispatch(updateProducts({nodeId: source, products: newTemp}));
        return newTemp;
      });
    }
  }

  public static graphEdgeDropped(dispatch: Dispatch, graph: Graph, params: {key: string}): void {
    const source: string = params.key.split(',')[0].split('-')[0];
    const sourceHandle: string = params.key.split(',')[0].split('-')[1];
    const target: string = params.key.split(',')[1].split('-')[0];
    const targetHandle: string = params.key.split(',')[1].split('-')[1];

    const nodeTypeSource: NodeType = graph.getNodeAttribute(source, 'type');
    if (nodeTypeSource === NodeType.CONSTANT) {
      graph.updateNodeAttribute(source, 'targets', (temp: string[]): string[] => {
        const newTargets: string[] = temp.filter((x: string): boolean => x !== target);

        dispatch(updateTargets({nodeId: source, targets: newTargets}))
        return newTargets;
      });
    }

    if (nodeTypeSource === NodeType.MACHINE) {
      graph.updateNodeAttribute(source, 'products', (temp: {[id: string]: ItemProduct}): {[id: string]: ItemProduct} => {
        const newTemp: {[id: string]: ItemProduct} = cloneDeep(temp);
        set(newTemp, `${sourceHandle}.targets`, newTemp[sourceHandle].targets.filter((x: string): boolean => x !== target));

        dispatch(updateProducts({nodeId: source, products: newTemp}));
        return newTemp;
      });
    }

    graph.updateNodeAttribute(target, 'ingredients', (temp: {[id: string]: ItemIngredient}): {[id: string]: ItemIngredient} => {
      const newTemp: {[id: string]: ItemIngredient} = cloneDeep(temp);
      unset(newTemp, `${targetHandle}.rate.${source}`);

      dispatch(updateIngredients({ingredients: newTemp, nodeId: target}));
      return newTemp;
    });
  }

  public static graphUpdatedIngredients(dispatch: Dispatch, graph: Graph, node: NodeMachine): void {
    const crafts: number = min(Object.values(node.ingredients).map((ingredient: ItemIngredient): number => Math.min(ingredient.maxRate, sum(Object.values(ingredient.rate))) / ingredient.value));

    const isUpdate: boolean = Object.values(node.products).some((product: ItemProduct): boolean => {
      const newRate: number = crafts * product.percent * product.value * (1 + (0.08 * node.modules.prod));
      return newRate !== product.rate;
    });

    if (!isUpdate) {
      return;
    }

    graph.updateNodeAttribute(node.id, 'products', (temp: {[id: string]: ItemProduct}): {[id: string]: ItemProduct} => {
      const newTemp: {[id: string]: ItemProduct} = cloneDeep(temp);

      Object.keys(newTemp).forEach((id: string): void => {
        set(newTemp, `${id}.rate`, crafts * newTemp[id].percent * newTemp[id].value * (1 + (0.08 * node.modules.prod)));
      });

      dispatch(updateProducts({nodeId: node.id, products: newTemp}));
      return newTemp;
    });
  }

  public static graphUpdatedProducts(dispatch: Dispatch, graph: Graph, node: NodeMachine): void {
    Object.values(node.products).forEach((product: ItemProduct): void => {
      const rateShared: number = product.rate / product.targets.length;

      product.targets.forEach((target: string): void => {
        graph.updateNodeAttribute(target, 'ingredients', (temp: {[id: string]: ItemIngredient}): {[id: string]: ItemIngredient} => {
          const newTemp: {[id: string]: ItemIngredient} = cloneDeep(temp);

          const targetHandle: string = Object.values(newTemp).find((ingredient: ItemIngredient): boolean => product.name === ingredient.name).id;
          set(newTemp, `${targetHandle}.rate.${node.id}`, rateShared);

          dispatch(updateIngredients({ingredients: newTemp, nodeId: target}));
          return newTemp;
        });
      });
    });
  }

  public static graphUpdatedTargets(dispatch: Dispatch, graph: Graph, node: NodeConstant): void {
    const rateShared: number = node.rate / node.targets.length;

    node.targets.forEach((target: string): void => {
      graph.updateNodeAttribute(target, 'ingredients', (temp: {[id: string]: ItemIngredient}): {[id: string]: ItemIngredient} => {
        const newTemp: {[id: string]: ItemIngredient} = cloneDeep(temp);

        const targetHandle: string = Object.values(newTemp).find((ingredient: ItemIngredient): boolean => node.name === ingredient.name).id;
        set(newTemp, `${targetHandle}.rate.${node.id}`, rateShared);

        dispatch(updateIngredients({ingredients: newTemp, nodeId: target}));
        return newTemp;
      });
    });
  }

  public static async readEdges(): Promise<string[]> {
    try {
      const cache = await caches.open(CacheNameEdges);
      const cacheFile = await cache.match(CacheLocation);
      return await cacheFile.json();
    } catch (error: unknown) {
      console.error('Failed to Read Edges from Cache', error);
      return [];
    }
  }

  public static async readNodes(): Promise<NodeMap> {
    try {
      const cache = await caches.open(CacheNameNodes);
      const cacheFile = await cache.match(CacheLocation);
      return await cacheFile.json();
    } catch (error: unknown) {
      console.error('Failed to Read Nodes from Cache', error);
      return {};
    }
  }

  public static async saveEdges(edge: string[]): Promise<void> {
    try {
      const cache = await caches.open(CacheNameEdges);
      await cache.put(CacheLocation, new Response(JSON.stringify(edge)));
    } catch (error: unknown) {
      console.error('Failed to Write Edges to Cache', error);
    }
  }

  public static async saveNodes(data: NodeMap): Promise<void> {
    try {
      const cache = await caches.open(CacheNameNodes);
      await cache.put(CacheLocation, new Response(JSON.stringify(data)));
    } catch (error: unknown) {
      console.error('Failed to Write Nodes to Cache', error);
    }
  }
}
