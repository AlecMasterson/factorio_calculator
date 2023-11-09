// @ts-ignore
import React from 'react';
import {Box, Button} from '@mui/material';
import {NodeMachine} from '../types/Node';
import {NodeType} from '../types/NodeType';
import InputNumber from './inputs/Number';
import InputText from './inputs/Text';

interface AddItemProps {
  isProduct?: boolean;
  item: {name: string, percent?: string, value: string};
  onChangeName: (name: string) => void;
  onChangePercent?: (percent: string) => void;
  onChangeValue: (value: string) => void;
}

function AddItem(props: AddItemProps): React.ReactElement {
  const [name, setName] = React.useState<string>(props.item.name);
  const [percent, setPercent] = React.useState<string>(props.item.percent || '');
  const [value, setValue] = React.useState<string>(props.item.value);

  React.useEffect((): void => {
    props.onChangeName(name);
  }, [name]);

  React.useEffect((): void => {
    props.onChangePercent && props.onChangePercent(percent);
  }, [percent]);

  React.useEffect((): void => {
    props.onChangeValue(value);
  }, [value]);

  return (
    <React.Fragment>
      <InputText
        label='Item Name'
        props={{fullWidth: false}}
        setValue={setName}
        value={name}
      />

      <InputNumber
        label={`Number ${props.isProduct ? 'Produced' : 'Consumed'}`}
        props={{fullWidth: false}}
        setValue={setValue}
        value={value}
      />

      {props.isProduct && (
        <InputNumber
          label='Percent Output'
          props={{fullWidth: false}}
          setValue={setPercent}
          value={percent}
        />
      )}
    </React.Fragment>
  );
}

export default function AddMachine(props: {onAdd: (node: NodeMachine) => void}): React.ReactElement {
  const [count, setCount] = React.useState<string>('0');
  const [cycle, setCycle] = React.useState<string>('0.0');
  const [ingredients, setIngredients] = React.useState<{name: string, value: string}[]>([]);
  const [multiplier, setMultiplier] = React.useState<string>('0.0');
  const [name, setName] = React.useState<string>('');
  const [products, setProducts] = React.useState<{name: string, percent: string, value: string}[]>([]);

  function onAdd(): void {
    const i = ingredients.reduce((x, ingredient) => ({
      ...x,
      [Object.keys(x).length.toString()]: {
        id: Object.keys(x).length.toString(),
        name: ingredient.name,
        rate: {},
        value: parseInt(ingredient.value)
      }
    }), {});

    const p = products.reduce((x, product) => ({
      ...x,
      [Object.keys(x).length.toString()]: {
        id: Object.keys(x).length.toString(),
        name: product.name,
        rate: 0,
        targets: [],
        value: parseInt(product.value)
      }
    }), {});

    props.onAdd({
      count: parseInt(count),
      cycle: parseFloat(cycle),
      id: '',
      ingredients: i,
      modules: {},
      multiplier: parseFloat(multiplier),
      name: name,
      position: {x: 0, y: 0},
      products: p,
      type: NodeType.MACHINE
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
      <InputText label='Machine Name' setValue={setName} value={name} />
      <InputNumber isInteger label='Number of Machines' setValue={setCount} value={count} />
      <InputNumber label='Number of Seconds per Craft' setValue={setCycle} value={cycle} />
      <InputNumber label='Crafter Multiplier' setValue={setMultiplier} value={multiplier} />

      <Button
        fullWidth
        onClick={() => setIngredients([...ingredients, {name: '', value: '0.0'}])}
        variant='outlined'
      >
        Add Ingredient
      </Button>

      {ingredients.map((ingredient: {name: string, value: string}, index: number): React.ReactElement => (
        <AddItem
          item={ingredient}
          key={index}
          onChangeName={(name: string): void => {
            const temp = [...ingredients];
            temp[index].name = name;

            setIngredients(temp);
          }}
          onChangeValue={(value: string): void => {
            const temp = [...ingredients];
            temp[index].value = value;

            setIngredients(temp);
          }}
        />
      ))}

      <Button
        fullWidth
        onClick={() => setProducts([...products, {name: '', percent: '0.0', value: '0.0'}])}
        variant='outlined'
      >
        Add Product
      </Button>

      {products.map((product: {name: string, percent: string, value: string}, index: number): React.ReactElement => (
        <AddItem
          isProduct
          item={product}
          key={index}
          onChangeName={(name: string): void => {
            const temp = [...products];
            temp[index].name = name;

            setProducts(temp);
          }}
          onChangePercent={(percent: string): void => {
            const temp = [...products];
            temp[index].percent = percent;

            setProducts(temp);
          }}
          onChangeValue={(value: string): void => {
            const temp = [...products];
            temp[index].value = value;

            setProducts(temp);
          }}
        />
      ))}

      <Button
        fullWidth
        onClick={onAdd}
        variant='outlined'
      >
        Add
      </Button>
    </Box>
  );
}
