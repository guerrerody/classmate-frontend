import {
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import routes from "./slice/routes";
import prefs from "./slice/prefs";
import bottomSheet from "./slice/bottomSheet";
import { reduxStorage } from "./storage";
import post from "./slice/post";
import searchPost from "./slice/post/search";
import toast from "./slice/toast/toast";
import { authApi } from "./api/auth";

import user from "./slice/user";
import {
  persistReducer,
  REHYDRATE,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from "redux-persist";
import chatList from "./slice/chat/chatlist";
import { userApi } from "./api/user";
import { servicesApi } from "./api/services";
import loadingModal from "./slice/modal/loading";
import searchPeople from "./slice/people/search";
import followers from "./slice/user/followers";
import followedPost from "./slice/post/followed";
import { chatApi } from "./api/chat";
import online from "./slice/chat/online";
import currentPage from "./slice/currentPage";
import audio from "./slice/post/audio"

const reducer = combineReducers({
  routes,
  prefs,
  bottomSheet,
  post,
  toast,
  loadingModal,
  searchPost,
  followers,
  chatlist: chatList,
  online,
  audio,
  [chatApi.reducerPath]: chatApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  user,
  searchPeople,
  followedPost,
  currentPage,
});

const persistConfig: PersistConfig<ReturnType<typeof reducer>> = {
  key: "root",
  storage: reduxStorage,
  whitelist: ["routes", "prefs", "user"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        immutableCheck: false,
        serializableCheck: false,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(servicesApi.middleware)
      .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
