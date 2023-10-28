import React, {useCallback} from 'react';
import ReactFlow, {addEdge, Connection, Edge, Node as FlowNode, useNodesState, useEdgesState} from 'reactflow';
import Node from './types/Node';
import CustomNode from './CustomNode';
import 'reactflow/dist/style.css';

const NodeTypes = {CustomNode};

interface GraphNode {
    attributes: Node,
    key: string
}

interface GraphProps {
    nodes: GraphNode[];
}

interface FlowProps {
    graph: GraphProps;
    onAddEdge: (connection: Connection) => boolean;
}

export default function Flow(props: FlowProps): React.ReactElement {
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    console.log('Flow Props', props);
    console.log('Flow Edges', edges);
    console.log('Flow Nodes', nodes);

    React.useEffect(() => {
        if (!props.graph.nodes) {
            return;
        }

        setNodes(props.graph.nodes.map((node: GraphNode): FlowNode => ({
            data: {},
            id: node.key,
            position: node.attributes.position,
            type: typeof node.attributes.rate === 'number' ? '' : 'CustomNode'
        })));
    }, [props.graph]);

    const onConnect = useCallback((connection: Connection): void => {
        if (props.onAddEdge(connection)) {
            setEdges((tempEdges: Edge[]) => addEdge(connection, tempEdges));
        }
    }, [setEdges]);

    return (
      <div style={{height: '100vh', width: '100vw'}}>
        <ReactFlow
          edges={edges}
          nodes={nodes}
          nodeTypes={NodeTypes}
          onConnect={onConnect}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
        />
      </div>
    );
}
