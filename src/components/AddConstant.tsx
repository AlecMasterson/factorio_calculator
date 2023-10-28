import React from 'react';
import {Box, Button, TextField} from '@mui/material';
import {NodeConstant} from '../types/Node';

export default function AddConstant(props: {onAdd: (node: NodeConstant) => void}): React.ReactElement {
  const [name, setName] = React.useState<string>('');
  const [rate, setRate] = React.useState<string>('0');

  function onAdd(): void {
    props.onAdd({
      id: '',
      name: name,
      position: {x: 0, y: 0},
      rate: parseFloat(rate),
      targets: []
    });
  }

  return (
    <Box
      autoComplete='off'
      component='form'
      noValidate sx={{
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
        sx={{marginTop: 0}}
        value={name}
      />

      <TextField
        error={rate === '0'}
        fullWidth
        label='Output Rate'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => {
          try {
            if (/^\d*\.?\d+$/.test(event.target.value)) {
              setRate(event.target.value);
            }
          } catch (error: unknown) {}
        }}
        required
        value={rate}
      />

      <Button
        disabled={name === '' || rate === '0'}
        fullWidth
        onClick={onAdd}
        variant='outlined'
      >
        Add
      </Button>
    </Box>
  );
}
