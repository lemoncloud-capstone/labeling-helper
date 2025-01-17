import '@testing-library/jest-dom';
import crypto from 'crypto';

import { unmountComponentAtNode } from 'react-dom';

jest.mock('./App.tsx', () => 'App');

Object.defineProperty(global.self, 'crypto', {
    value: {
        getRandomValues: arr => crypto.randomBytes(arr.length),
    },
});

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    container.setAttribute('id', 'root');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});
