import React from 'react';
import {Card, CardContent} from '@mui/material';
import {useSelector} from 'react-redux';
import {Handle, NodeProps, Position} from 'reactflow';
import {NodeConstant} from '../../types/Node';
import NodeMap from '../../types/NodeMap';
import {NodeType} from "../../types/NodeType";

export default function Constant(props: NodeProps): React.ReactElement {
  const nodes: NodeMap = useSelector((state: {nodes: NodeMap}): NodeMap => state.nodes);

  if (nodes[props.id].type !== NodeType.CONSTANT) {
    throw new Error('Attempting to Render Non-Constant Node as a Constant Node');
  }
  const node: NodeConstant = nodes[props.id] as NodeConstant;

  return (
    <Card variant='outlined'>
      <CardContent>
        <h2>{node.name}</h2>
        <span>Output Rate: {node.rate}</span>

        <Handle
          id={node.id}
          position={Position.Right}
          type='source'
        />
      </CardContent>
    </Card>
  );
}
