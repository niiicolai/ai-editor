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

import shortcuts from './features/shortcuts';
import userAgentSession from './features/userAgentSession';
import userAgentSessionSettings from './features/userAgentSessionSettings';
import search from './features/search';
import hierarchySettings from './features/hierarchySettings';
import hierarchy from './features/hierarchy';
import editor from './features/editor';
import terminals from './features/terminals';
import terminalSettings from './features/terminalSettings';
import tabs from './features/tabs';
import projectIndex from './features/projectIndex';
import theme from './features/theme';
import rag from './features/rag';

const store = configureStore({
    reducer: {
        projectIndex,
        userAgentSession,
        userAgentSessionSettings,
        shortcuts,
        search,
        hierarchySettings,
        hierarchy,
        terminals,
        terminalSettings,
        editor,
        tabs,
        theme,
        rag,
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
