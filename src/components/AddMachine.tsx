// @ts-ignore
import React from 'react';
import {Box, Button, Stack} from '@mui/material';
import {ItemIngredient, ItemProduct} from '../types/Item';
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
  const [percent, setPercent] = React.useState<string>(props.item.percent || '1.0');
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
    <Stack direction='row' spacing={2} sx={{marginBottom: '8px', marginTop: '16px'}}>
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
    </Stack>
  );
}

export default function AddMachine(props: {onAdd: (node: NodeMachine) => void}): React.ReactElement {
  const [count, setCount] = React.useState<string>('0');
  const [cycle, setCycle] = React.useState<string>('0.0');
  const [ingredients, setIngredients] = React.useState<{name: string, value: string}[]>([]);
  const [moduleProd, setModuleProd] = React.useState<string>('0.0');
  const [moduleSpeed, setModuleSpeed] = React.useState<string>('0.0');
  const [multiplier, setMultiplier] = React.useState<string>('1.0');
  const [name, setName] = React.useState<string>('');
  const [products, setProducts] = React.useState<{name: string, percent: string, value: string}[]>([]);

  function onAdd(): void {
    const moduleEffectSpeed: number = 1 + parseFloat(moduleSpeed);
    const moduleEffectProd: number = 1 + parseFloat(moduleProd);

    const i: {[id: string]: ItemIngredient} =
      ingredients.reduce((x: {[id: string]: ItemIngredient}, ingredient: {name: string, value: string}): {[id: string]: ItemIngredient} => ({
        ...x,
        [Object.keys(x).length.toString()]: {
          id: Object.keys(x).length.toString(),
          maxRate: parseFloat(ingredient.value) / parseFloat(cycle) * parseFloat(multiplier) * moduleEffectSpeed * parseInt(count),
          name: ingredient.name,
          rate: {},
          value: parseFloat(ingredient.value)
        }
      }), {});

    const p: {[id: string]: ItemProduct} =
      products.reduce((x: {[id: string]: ItemProduct}, product: {name: string, percent: string, value: string}): {[id: string]: ItemProduct} => ({
        ...x,
        [Object.keys(x).length.toString()]: {
          id: Object.keys(x).length.toString(),
          maxRate: parseFloat(product.value) / parseFloat(cycle) * parseFloat(multiplier) * moduleEffectSpeed * moduleEffectProd * parseInt(count),
          name: product.name,
          percent: parseFloat(product.percent),
          rate: 0,
          targets: [],
          value: parseFloat(product.value)
        }
      }), {});

    props.onAdd({
      count: parseInt(count),
      cycle: parseFloat(cycle),
      id: '',
      ingredients: i,
      modules: {prod: parseFloat(moduleProd), speed: parseFloat(moduleSpeed)},
      multiplier: parseFloat(multiplier),
      name: name,
      position: {x: 0, y: 0},
      products: p,
      type: NodeType.MACHINE
    });
  }

  function isDisabled(): boolean {
    return (
      parseInt(count) === 0 ||
      parseFloat(cycle) === 0 ||
      ingredients.length === 0 ||
      ingredients.some((ingredient: {name: string, value: string}): boolean => (
        ingredient.name === '' ||
        parseFloat(ingredient.value) === 0
      )) ||
      parseFloat(multiplier) === 0 ||
      name === '' ||
      products.length === 0 ||
      products.some((product: {name: string, percent: string, value: string}): boolean => (
        product.name === '' ||
        parseFloat(product.percent) === 0 ||
        parseFloat(product.value) === 0
      ))
    );
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
      <InputNumber label='Base Craft Multiplier' setValue={setMultiplier} value={multiplier} />
      <InputNumber canBeZero label='Productivity Bonus' setValue={setModuleProd} value={moduleProd} />
      <InputNumber canBeZero label='Speed Bonus' setValue={setModuleSpeed} value={moduleSpeed} />

      <Button
        fullWidth
        onClick={() => setIngredients([...ingredients, {name: '', value: '0.0'}])}
        sx={{marginTop: '16px'}}
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
        onClick={() => setProducts([...products, {name: '', percent: '1.0', value: '0.0'}])}
        sx={{marginTop: '16px'}}
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
        disabled={isDisabled()}
        fullWidth
        onClick={onAdd}
        sx={{marginTop: '16px'}}
        variant='outlined'
      >
        Add
      </Button>
    </Box>
  );
}
