// @ts-ignore
import React from 'react';
import {Box, Button} from '@mui/material';
import {NodeConstant} from '../types/Node';
import {NodeType} from '../types/NodeType';
import InputNumber from './inputs/Number';
import InputText from './inputs/Text';

export default function AddConstant(props: {onAdd: (node: NodeConstant) => void}): React.ReactElement {
  const [name, setName] = React.useState<string>('');
  const [rate, setRate] = React.useState<string>('0.0');

  function onAdd(): void {
    props.onAdd({
      id: '',
      name: name,
      position: {x: 0, y: 0},
      rate: parseFloat(rate),
      targets: [],
      type: NodeType.CONSTANT
    });
  }

  return (
    <Box
      autoComplete='off'
      component='form'
      noValidate
      sx={{
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
    >
      <InputText
        label='Item Name'
        setValue={setName}
        value={name}
      />

      <InputNumber
        label='Rate'
        setValue={setRate}
        value={rate}
      />

      <Button
        disabled={name === '' || rate === '0.0'}
        fullWidth
        onClick={onAdd}
        variant='outlined'
      >
        Add
      </Button>
    </Box>
  );
}
