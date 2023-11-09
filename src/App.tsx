// @ts-ignore
import React from 'react';
import Graph from 'graphology';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import {Connection} from 'reactflow';
import {Node, NodeConstant, NodeMachine} from './types/Node';
import {NodeMap} from './types/NodeMap';
import {addEdge} from './store/StoreEdges';
import Flow from './Flow';
import Util from './Util';

const graph = new Graph({multi: true, type: 'directed'});

function App(): React.ReactElement {
  const dispatch: Dispatch = useDispatch();
  const edges: string[] = useSelector((state: {edges: string[]}): string[] => state.edges);
  const nodes: NodeMap = useSelector((state: {nodes: NodeMap}): NodeMap => state.nodes);

  React.useEffect(() => {
    graph.clear();

    // @ts-ignore
    Object.values(nodes).forEach((node: Node): void => {
      graph.addNode(node.id, {...node});
    });
  }, [ nodes]);

  React.useEffect(() => {
    graph.on('edgeAdded', (params: {key: string}): void => Util.graphEdgeAdded(dispatch, graph, params));

    graph.on('nodeAttributesUpdated', (params: any): void => {
      if (params.name === 'ingredients') {
        Util.graphUpdatedIngredients(dispatch, graph, params.attributes as NodeMachine);
      }

      if (params.name === 'products') {
        Util.graphUpdatedProducts(dispatch, graph, params.attributes as NodeMachine);
      }

      if (params.name === 'targets') {
        Util.graphUpdatedTargets(dispatch, graph, params.attributes as NodeConstant);
      }
    });
  }, []);

  const graphAddEdge: (connection: Connection) => boolean = React.useCallback((connection: Connection): boolean => {
    try {
      const canConnect: boolean = Util.graphCanConnect(graph, connection);
      if (!canConnect) {
        return false;
      }

      const keyId: string = `${connection.source}-${connection.sourceHandle},${connection.target}-${connection.targetHandle}`;

      graph.addEdgeWithKey(keyId, connection.source, connection.target);
      dispatch(addEdge({edge: keyId}));

      return true;
    } catch (error: unknown) {
      console.error('Failed to Add Edge', error);
      return false;
    }
  }, []);

  return (
    <Flow
      onAddEdge={graphAddEdge}
    />
  );
}

export default React.memo(App);
