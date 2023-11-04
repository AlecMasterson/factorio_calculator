import {createSlice, Slice} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';

export const SliceEdges: Slice = createSlice({
  initialState: {},
  name: 'edges',
  reducers: {
    addEdge: (state: string[], params: {payload: {edge: string}}): string[] => {
      const edges: string[] = cloneDeep(state);
      edges.push(params.payload.edge);

      return edges;
    },
    setEdges: (_: string[], params: {payload: {edges: string[]}}): string[] => {
      return params.payload.edges;
    }
  }
});

export const {addEdge, setEdges} = SliceEdges.actions;
