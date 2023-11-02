import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {useSelector} from 'react-redux';
import {Card, CardContent} from '@mui/material';
import {sum} from 'lodash';
import {Item, ItemIngredient, ItemProduct} from '../../types/Item';
import {NodeMachine} from '../../types/Node';
import {NodeMap} from '../../types/NodeMap';
import {NodeType} from '../../types/NodeType';

const ConnectionHeight = 64;

function CustomHandle(props: {index: number, item: Item, position: Position}): React.ReactElement {
  let rate: number = 0;
  if (props.position === Position.Left) {
    rate = sum(Object.values((props.item as ItemIngredient).rate));
  } else {
    rate = (props.item as ItemProduct).rate;
  }

  return (
    <div style={{border: '1px solid black', maxWidth: '200px', margin: '8px', borderRadius: '8px', padding: '8px'}}>
      <span>{props.item.name}</span>
      <br/>
      <span>{props.position === Position.Left ? 'Consumes' : 'Produces'}: {props.item.value}</span>
      <br/>
      <span>Rate: {rate.toFixed(2)} of ?</span>
      <Handle
        id={props.item.id}
        position={props.position}
        style={{top: (ConnectionHeight*(props.index+1))+30}}
        type={props.position === Position.Left ? 'target' : 'source'}
      />
    </div>
  );
}

export default function Machine(props: NodeProps): React.ReactElement {
  const nodes: NodeMap = useSelector((state: {nodes: NodeMap}): NodeMap => state.nodes);

  if (nodes[props.id].type !== NodeType.MACHINE) {
    throw new Error('Attempting to Render Non-Machine Node as a Machine Node');
  }
  const node: NodeMachine = nodes[props.id] as NodeMachine;

  const ingredients: ItemIngredient[] = Object.values(node.ingredients);
  const products: ItemProduct[] = Object.values(node.products);

  return (
    <Card variant='outlined'>
      <CardContent style={{display: 'flex'}}>
        <div>
          {ingredients.map((item: ItemIngredient, index: number): React.ReactElement => (
            <CustomHandle
              index={index}
              item={item}
              key={index}
              position={Position.Left}
            />
          ))}
        </div>

        <div>
          {products.map((item: ItemProduct, index: number): React.ReactElement => (
            <CustomHandle
              index={index}
              item={item}
              key={index}
              position={Position.Right}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
