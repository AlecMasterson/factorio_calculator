import {configureStore, createSlice} from '@reduxjs/toolkit';

const NodesSlice = createSlice({
    initialState: {},
    name: 'nodes',
    reducers: {
        set: (_, params) => params.payload,
        updateIngredient: (state, params) => {
            const newIngredient = params.payload.ingredient;
            state[params.payload.nodeId].ingredients[newIngredient.id] = newIngredient;
        },
        updateProduct: (state, params) => {
            const newProduct = params.payload.product;
            state[params.payload.nodeId].products[newProduct.id] = newProduct;
        }
    }
});

export const {set, updateIngredient, updateProduct} = NodesSlice.actions;

export default configureStore({
    reducer: {
        nodes: NodesSlice.reducer
    }
});
