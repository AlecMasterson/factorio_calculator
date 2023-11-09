// @ts-ignore
import React from 'react';
import {Box, Button, TextField} from '@mui/material';
import {NodeConstant} from '../types/Node';
import {NodeType} from '../types/NodeType';

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
      <TextField
        error={name === ''}
        fullWidth
        label='Item Name'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => setName(event.target.value)}
        required
        value={name}
      />

      <TextField
        error={rate === '0.0'}
        fullWidth
        label='Output Rate'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => {
          try {
            // @ts-ignore
            if (parseFloat(event.target.value) !== 0 && !Number.isNaN(parseFloat(event.target.value))) {
              setRate(event.target.value);
            }
          } catch (error: unknown) {}
        }}
        required
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
