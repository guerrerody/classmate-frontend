import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const onLineUserIDs = createSlice({
  name: "onlineUserIds",
  initialState: {
    ids: [],
  } as { ids: Array<string> },
  reducers: {
    updateOnlineIds: (state, action: PayloadAction<{ ids: Array<string> }>) => {
      console.log(">>>> file: online.ts:11 ~ state:", state)
      state.ids = action.payload.ids;
    },
  },
});

export default onLineUserIDs.reducer;
export const { updateOnlineIds } = onLineUserIDs.actions;
