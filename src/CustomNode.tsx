import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import {Card, CardContent} from '@mui/material';
import {useSelector} from 'react-redux';
import {sum} from 'lodash';
import {Item, ItemIngredient, ItemProduct} from './types/Item';

const ConnectionHeight = 64;

function CustomHandle(props: {index: number, item: Item, position: Position}): React.ReactElement {
    const rate: number = typeof props.item['rate'] === 'object' ? sum(Object.values(props.item['rate'])) : props.item['rate'];


    return (
        <div style={{border: '1px solid black', maxWidth: '200px', margin: '8px', borderRadius: '8px', padding: '8px'}}>
            <span>{props.item.name}</span>
            <br/>
            <span>Consumes: {props.item.value}</span>
            <br/>
            <span>Rate: {rate.toFixed(2)} of ?</span>
            <Handle
                position={props.position}
                style={{top: (50*(props.index+1))+30}}
                id={props.item.id}
                type={props.position === Position.Left ? 'target' : 'source'}
            />
        </div>
    );
}

export default function CustomNode(props: NodeProps): React.ReactElement {
    const test = useSelector(state => state.nodes);
    const {ingredients, products} = test[props.id];

    console.log('Node Props', props);
    console.log('Node State', test);

    const ingredientList: ItemIngredient[] = Object.values(ingredients);
    const productList: ItemProduct[] = Object.values(products);

    return (
        <Card variant='outlined'>
            <CardContent style={{display: 'flex'}}>
                <div>
                    {ingredientList.map((item: ItemIngredient, index: number): React.ReactElement => (
                        <CustomHandle
                            index={index}
                            item={item}
                            key={index}
                            position={Position.Left}
                        />
                    ))}
                </div>

                <div>
                    {productList.map((item: ItemProduct, index: number): React.ReactElement => (
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
