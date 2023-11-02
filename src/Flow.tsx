import React, {useCallback} from 'react';
import ReactFlow, {addEdge, Connection, Edge, Node as FlowNode, useNodesState, useEdgesState} from 'reactflow';
import 'reactflow/dist/style.css';
import {useDispatch} from 'react-redux';
import NodeConstant from './components/node/Constant';
import NodeMachine from './components/node/Machine';
import {Node} from './types/Node';
import {NodeType} from './types/NodeType';
import {updatePosition} from './Store';

const NodeTypes = {NodeConstant, NodeMachine};

interface GraphNode {
  attributes: Node;
  key: string;
}

interface GraphProps {
  nodes: GraphNode[];
}

interface FlowProps {
  graph: GraphProps;
  onAddEdge: (connection: Connection) => boolean;
}

export default function Flow(props: FlowProps): React.ReactElement {
  const dispatch = useDispatch();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  React.useEffect(() => {
    if (!props.graph.nodes) {
      return;
    }

    console.log('Flow Props', props);
    setNodes(props.graph.nodes.map((node: GraphNode): FlowNode => ({
      data: {},
      id: node.key,
      position: node.attributes.position,
      type: node.attributes.type === NodeType.CONSTANT ? 'NodeConstant' : 'NodeMachine'
    })));
  }, [props.graph]);

  const onConnect = useCallback((connection: Connection): void => {
    if (props.onAddEdge(connection)) {
      setEdges((tempEdges: Edge[]) => addEdge(connection, tempEdges));
    }
  }, [setEdges]);

  const onNodeDragStop = useCallback((_: any, x: {id: string, position: {x: number, y: number}}): void => {
    dispatch(updatePosition({nodeId: x.id, position: x.position}));
  }, [onNodesChange]);

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <ReactFlow
        edges={edges}
        nodes={nodes}
        nodeTypes={NodeTypes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onNodesChange={onNodesChange}
      />
    </div>
  );
}
