// @ts-ignore
import React from 'react';
import {TextField} from '@mui/material';

interface InputTextProps {
  label: string;
  setValue: (value: string) => void;
  value: string;
}

export default function InputText(props: InputTextProps): React.ReactElement {
  return (
    <TextField
      error={props.value === ''}
      fullWidth
      label={props.label}
      margin='normal'
      onChange={(event: {target: {value: string}}): void => props.setValue(event.target.value)}
      required
      value={props.value}
    />
  );
}
