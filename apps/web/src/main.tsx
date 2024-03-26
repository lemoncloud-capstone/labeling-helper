import { StrictMode } from 'react';

import './index.scss';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import configureStore from './configureStore';
import { AppInitializer } from './logic/initializer/AppInitializer';

export const store = configureStore();
AppInitializer.inti();

const root = ReactDOM.createRoot(document.getElementById('root') || document.createElement('div'));
root.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
