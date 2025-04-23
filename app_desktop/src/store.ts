import { configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

import userAgentSession from './features/userAgentSession';
import editorSearch from './features/editorSearch';
import editorSettings from './features/editorSettings';
import hierarchy from './features/hierarchy';
import editor from './features/editor';

const store = configureStore({
    reducer: {
        userAgentSession,
        editorSearch,
        editorSettings,
        hierarchy,
        editor
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
