// @ts-ignore
import React from 'react';
import {useSelector} from 'react-redux';
import {Handle, NodeProps, Position} from 'reactflow';
import {Card, CardContent} from '@mui/material';
import {NodeConstant} from '../../types/Node';
import {NodeMap} from '../../types/NodeMap';
import {NodeType} from '../../types/NodeType';

export default function Constant(props: NodeProps): React.ReactElement {
  const nodes: NodeMap = useSelector((state: {nodes: NodeMap}): NodeMap => state.nodes);

  if (!(props.id in nodes)) {
    return null;
  }
  if (nodes[props.id].type !== NodeType.CONSTANT) {
    throw new Error('Attempting to Render Non-Constant Node as a Constant Node');
  }

  const node: NodeConstant = nodes[props.id] as NodeConstant;

  return (
    <Card variant='outlined'>
      <CardContent>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span>{node.name}</span>
          <span>Rate: {node.rate.toFixed(2)}</span>

          <Handle
            id={node.id}
            position={Position.Right}
            type='source'
          />
        </div>
      </CardContent>
    </Card>
  );
}
