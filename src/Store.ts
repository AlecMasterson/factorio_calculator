import {configureStore} from '@reduxjs/toolkit';
import {SliceEdges} from './store/StoreEdges';
import {SliceNodes} from './store/StoreNodes';

export default configureStore({
  reducer: {
    edges: SliceEdges.reducer,
    nodes: SliceNodes.reducer
  }
});
