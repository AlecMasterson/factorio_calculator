import React from 'react';
import {Box, Button, TextField} from '@mui/material';
import {NodeMachine} from '../types/Node';

function AddItem(props: {item: {name: string, value: string}, onChangeName: (name: string) => void, onChangeValue: (value: string) => void}): React.ReactElement {
  const [name, setName] = React.useState<string>(props.item.name);
  const [value, setValue] = React.useState<string>(props.item.value);

  React.useEffect((): void => {
    props.onChangeName(name);
  }, [name]);

  React.useEffect((): void => {
    props.onChangeValue(value);
  }, [value]);

  return (
    <React.Fragment>
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
        error={value === '0'}
        fullWidth
        label='Number Consumed'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => {
          try {
            if (/^\d*\.?\d+$/.test(event.target.value)) {
              setValue(event.target.value);
            }
          } catch (error: unknown) {}
        }}
        required
        value={value}
      />
    </React.Fragment>
  );
}

export default function AddMachine(props: {onAdd: (node: NodeMachine) => void}): React.ReactElement {
  const [count, setCount] = React.useState<string>('0');
  const [cycle, setCycle] = React.useState<string>('0');
  const [ingredients, setIngredients] = React.useState<{name: string, value: string}[]>([]);
  const [multiplier, setMultiplier] = React.useState<string>('0');
  const [name, setName] = React.useState<string>('');
  const [products, setProducts] = React.useState<{name: string, value: string}[]>([]);

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
      products: p
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
        label='Machine Name'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => setName(event.target.value)}
        required
        sx={{marginTop: 0}}
        value={name}
      />

      <TextField
        error={count === '0'}
        fullWidth
        label='Number of Machines'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => {
          try {
            if (/^\d*\.?\d+$/.test(event.target.value)) {
              setCount(event.target.value);
            }
          } catch (error: unknown) {}
        }}
        required
        value={count}
      />

      <TextField
        error={cycle === '0'}
        fullWidth
        label='Number of Seconds per Craft'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => {
          try {
            if (/^\d*\.?\d+$/.test(event.target.value)) {
              setCycle(event.target.value);
            }
          } catch (error: unknown) {}
        }}
        required
        value={cycle}
      />

      <TextField
        error={multiplier === '0'}
        fullWidth
        label='Crafter Multiplier'
        margin='normal'
        onChange={(event: {target: {value: string}}): void => {
          try {
            if (/^\d*\.?\d+$/.test(event.target.value)) {
              setMultiplier(event.target.value);
            }
          } catch (error: unknown) {}
        }}
        required
        value={multiplier}
      />

      <Button
        fullWidth
        onClick={() => setIngredients([...ingredients, {name: '', value: '0'}])}
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
        onClick={() => setProducts([...products, {name: '', value: '0'}])}
        variant='outlined'
      >
        Add Product
      </Button>

      {products.map((product: {name: string, value: string}, index: number): React.ReactElement => (
        <AddItem
          item={product}
          key={index}
          onChangeName={(name: string): void => {
            const temp = [...products];
            temp[index].name = name;

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
        disabled={name === '' || count === '0' || cycle === '0' || multiplier === '0'}
        fullWidth
        onClick={onAdd}
        variant='outlined'
      >
        Add
      </Button>
    </Box>
  );
}
