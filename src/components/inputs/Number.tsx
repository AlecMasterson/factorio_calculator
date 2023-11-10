// @ts-ignore
import React from 'react';
import {TextField, TextFieldProps} from '@mui/material';

interface InputNumberProps {
  canBeZero?: boolean;
  isInteger?: boolean;
  label: string;
  props?: Partial<TextFieldProps>;
  setValue: (value: string) => void;
  value: string;
}

function isError(props: InputNumberProps): boolean {
  if (props.canBeZero) {
    return false;
  }

  if (props.isInteger) {
    return parseInt(props.value) === 0;
  }

  return parseFloat(props.value) === 0;
}

export default function InputNumber(props: InputNumberProps): React.ReactElement {
  return (
    <TextField
      error={isError(props)}
      fullWidth
      label={props.label}
      margin='normal'
      onChange={(event: {target: {value: string}}): void => {
        // @ts-ignore
        if (props.isInteger && !Number.isNaN(parseInt(event.target.value))) {
          props.setValue(event.target.value);
        }

        // @ts-ignore
        if (!props.isInteger && !Number.isNaN(parseFloat(event.target.value))) {
          props.setValue(event.target.value);
        }
      }}
      required
      value={props.value}
      {...props.props}
    />
  );
}
