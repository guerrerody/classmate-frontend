import { IPost } from "./../../../types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { servicesApi } from "../../api/services";

export type postState = {
  data: IPost[];
  error: any;
  loading: boolean;
};

const post = createSlice({
  name: "post",
  initialState: {
    data: [],
    error: null,
    loading: false,
  } as postState,
  reducers: {
    addPost: () => {},
    resetPost: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((post) => post.id !== action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      servicesApi.endpoints.getAllPosts.matchFulfilled,
      (state, { payload }) => {
        const data = [...state.data, ...payload.posts];
        state.data = data;
        state.error = null;
        state.loading = false;
      }
    );
    builder.addMatcher(
      servicesApi.endpoints.getAllPosts.matchPending,
      (state, { payload }) => {
        state.error = null;
        state.loading = true;
      }
    );
    builder.addMatcher(
      servicesApi.endpoints.getAllPosts.matchRejected,
      (state, { payload, error }) => {
        state.error = error;
        state.loading = false;
      }
    );
  },
});

export default post.reducer;
export const {resetPost, deletePost} = post.actions
