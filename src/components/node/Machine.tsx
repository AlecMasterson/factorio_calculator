// @ts-ignore
import React from 'react';
import {useSelector} from 'react-redux';
import {Handle, NodeProps, Position} from 'reactflow';
import {Card, CardContent} from '@mui/material';
import {sum} from 'lodash';
import {Item, ItemIngredient, ItemProduct} from '../../types/Item';
import {NodeMachine} from '../../types/Node';
import {NodeMap} from '../../types/NodeMap';
import {NodeType} from '../../types/NodeType';

const ConnectionHeight = 64;

interface CustomHandleProps {
  index: number;
  item: Item;
  position: Position;
}

function CustomHandle(props: CustomHandleProps): React.ReactElement {
  let rate: number;
  if (props.position === Position.Left) {
    // @ts-ignore
    rate = sum(Object.values((props.item as ItemIngredient).rate));
  } else {
    rate = (props.item as ItemProduct).rate;
  }

  let className: string = `custom-handle ${props.position === Position.Left ? 'position-left' : 'position-right'}`;
  if (rate === props.item.maxRate) {
    className += ' satisfied';
  } else if (rate > props.item.maxRate) {
    className += ' overflow';
  } else if (rate !== 0 && rate < props.item.maxRate) {
    className += ' starved';
  }

  return (
    <div className={className}>
      <span>{props.item.name}</span>
      <span>{props.position === Position.Left ? 'Consumes' : 'Produces'}: {props.item.value}</span>
      {props.position === Position.Right && (props.item as ItemProduct).percent !== 1 && (<span>Percent Chance: {(props.item as ItemProduct).percent}</span>)}
      <span>Rate: {rate.toFixed(2)} of {props.item.maxRate.toFixed(2)}</span>

      <Handle
        id={props.item.id}
        position={props.position}
        style={{top: ConnectionHeight*(props.index+1)}}
        type={props.position === Position.Left ? 'target' : 'source'}
      />
    </div>
  );
}

export default function Machine(props: NodeProps): React.ReactElement {
  const nodes: NodeMap = useSelector((state: {nodes: NodeMap}): NodeMap => state.nodes);

  if (!(props.id in nodes)) {
    return null;
  }
  if (nodes[props.id].type !== NodeType.MACHINE) {
    throw new Error('Attempting to Render Non-Machine Node as a Machine Node');
  }

  const node: NodeMachine = nodes[props.id] as NodeMachine;
  // @ts-ignore
  const ingredients: ItemIngredient[] = Object.values(node.ingredients);
  // @ts-ignore
  const products: ItemProduct[] = Object.values(node.products);

  return (
    <Card variant='outlined'>
      <CardContent>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span>{node.name}</span>
          <span>Number of Machines: {node.count}</span>
          <span>Seconds per Craft: {node.cycle}</span>
          {node.multiplier !== 1 && (<span>Base Craft Multiplier: {node.multiplier}</span>)}
          {node.modules.prod !== 0 && (<span>Productivity Bonus: {node.modules.prod}</span>)}
          {node.modules.speed !== 0 && (<span>Speed Bonus: {node.modules.speed}</span>)}
        </div>

        <div style={{display: 'flex'}}>
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
        </div>
      </CardContent>
    </Card>
  );
}
