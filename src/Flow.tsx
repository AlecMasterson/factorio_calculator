import React from 'react';
import ReactFlow, {Connection, Edge, Node as FlowNode} from 'reactflow';
import 'reactflow/dist/style.css';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import NodeConstant from './components/node/Constant';
import NodeMachine from './components/node/Machine';
import {Node} from './types/Node';
import {NodeMap} from './types/NodeMap';
import {NodeType} from './types/NodeType';
import {updatePosition} from './store/StoreNodes';

const NodeTypes = {NodeConstant, NodeMachine};

interface FlowProps {
  onAddEdge: (connection: Connection) => boolean;
}

function Flow(props: FlowProps): React.ReactElement {
  const dispatch: Dispatch = useDispatch();
  const edgeUpdateRef = React.useRef(false);
  const edges: string[] = useSelector((state: {edges: string[]}): string[] => state.edges);
  const nodes: NodeMap = useSelector((state: {nodes: NodeMap}): NodeMap => state.nodes);

  const flowEdges: Edge[] = edges.map((edge: string): Edge => ({
    id: edge,
    source: edge.split(',')[0].split('-')[0],
    sourceHandle: edge.split(',')[0].split('-')[1],
    target: edge.split(',')[1].split('-')[0],
    targetHandle: edge.split(',')[1].split('-')[1]
  }));

  const flowNodes: FlowNode[] = Object.values(nodes).map((node: Node): FlowNode => ({
    data: {},
    id: node.id,
    position: node.position,
    type: node.type === NodeType.CONSTANT ? 'NodeConstant' : 'NodeMachine'
  }));

  const onConnect = React.useCallback((connection: Connection): void => {
    props.onAddEdge(connection)
  }, []);

  const onEdgeUpdate = React.useCallback((_1: Edge, _2: Connection): void => {
    edgeUpdateRef.current = true;
  }, []);

  const onEdgeUpdateStart = React.useCallback((_1: React.MouseEvent, _2: Edge, _3: 'source' | 'target'): void => {
    edgeUpdateRef.current = false;
  }, []);

  const onEdgeUpdateEnd = React.useCallback((_1: React.MouseEvent, edge: Edge, _3: 'source' | 'target'): void => {
    if (!edgeUpdateRef.current) {
      // TODO: Attempt to update state for removing edge.
    }

    edgeUpdateRef.current = false;
  }, []);

  const onNodeDragStop = React.useCallback((_1: React.MouseEvent, node: FlowNode, _3: FlowNode[]): void => {
    dispatch(updatePosition({nodeId: node.id, position: node.position}));
  }, []);

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <ReactFlow
        edges={flowEdges}
        nodes={flowNodes}
        nodeTypes={NodeTypes}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onNodeDragStop={onNodeDragStop}
      />
    </div>
  );
}

export default React.memo(Flow);
