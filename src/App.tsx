import React from 'react';
import Graph from 'graphology';
import {min, sum, update} from 'lodash';
import {useDispatch} from 'react-redux';
import {Connection} from 'reactflow';
import Store, {set, updateIngredient, updateProduct} from './Store';
import {ItemIngredient, ItemProduct} from './types/Item';
import {Node} from './types/Node';
import Flow from './Flow';

const graph = new Graph({allowSelfLoops: false, multi: true, type: 'directed'});

interface AppProps {
  nodes: {[id: string]: Node};
}

function App(props: AppProps): React.ReactElement {
  const dispatch = useDispatch();
  const [graphJson, setGraphJson] = React.useState<{nodes: any[]}>({nodes: []});

  React.useEffect(() => {
    graph.clear();
    dispatch(set(props.nodes));

    Object.values(props.nodes).forEach((node: Node): void => {
      graph.addNode(node.id, {...node});
    });

    setGraphJson(graph.export());
  }, [props.nodes]);

  React.useEffect(() => {
    graph.on('edgeAdded', ({key, source, target}) => {
      const keyy = key.split(',')[0].split('-')[1];
      graph.updateNodeAttribute(source, 'products', (temp: {[id: string]: ItemProduct}): {[id: string]: ItemProduct} => {
        const newProducts: {[id: string]: ItemProduct} = {...temp};

        const product: ItemProduct = {...newProducts[keyy]};
        product.targets = [...product.targets, target];

        dispatch(updateProduct({nodeId: source, product}));
        return {...newProducts, [keyy]: product};
      });
    });

    graph.on('nodeAttributesUpdated', ({attributes, key, name}) => {
      console.log('Node attribute Updated', attributes, key, name);

      if (name === 'products') {
        (Object.values(attributes.products) as ItemProduct[]).forEach((product: ItemProduct): void => {
          const rateShared: number = product.rate / product.targets.length;

          product.targets.forEach((target: string): void => {
            graph.updateNodeAttribute(target, 'ingredients', (temp: {[id: string]: ItemIngredient}): {[id: string]: ItemIngredient} => {
              const newIngredients: {[id: string]: ItemIngredient} = {...temp};
              console.log('Current Ingredients', newIngredients);
              console.log('product.id', product.id);

              const ingredient: ItemIngredient = {...newIngredients[product.id]};
              console.log('ingredient', ingredient);
              ingredient.rate = {...ingredient.rate, [attributes.id]: rateShared};

              dispatch(updateIngredient({nodeId: target, ingredient}));
              return {...newIngredients, [product.id]: ingredient};
            });
          });
        });
      }

      if (name === 'ingredients') {
        const crafts: number[] = (Object.values(attributes.ingredients) as ItemIngredient[]).map((ingredient: ItemIngredient): number => {
          return sum(Object.values(ingredient.rate)) / ingredient.value;
        });
        const craftsMin: number = min(crafts);

        graph.updateNodeAttribute(attributes.id, 'products', (temp: {[id: string]: ItemProduct}): {[id: string]: ItemProduct} => {
          let newProducts: {[id: string]: ItemProduct} = {...temp};

          Object.values(newProducts).forEach((product: ItemProduct): void => {
            const newProduct: ItemProduct = {...product};
            newProduct.rate = craftsMin*newProduct.value;

            dispatch(updateProduct({nodeId: attributes.id, product: newProduct}));
            newProducts = {...newProducts, [newProduct.id]: newProduct};
          });

          return newProducts;
        });
      }
    });
  }, []);

  function addEdge(connection: Connection): boolean {
    const sourceName: string = graph.getNodeAttribute(connection.source, 'products')[connection.sourceHandle as string].name;
    const targetName: string = graph.getNodeAttribute(connection.target, 'ingredients')[connection.targetHandle as string].name;
    if (sourceName !== targetName) {
      return false;
    }

    const keyId: string = `${connection.source}-${connection.sourceHandle},${connection.target}-${connection.targetHandle}`;
    graph.addEdgeWithKey(keyId, connection.source, connection.target);
    return true;
  }

  return (
    <Flow
      graph={graphJson}
      onAddEdge={addEdge}
    />
  );
}

export default React.memo(App);
