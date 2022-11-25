// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { toHaveNoViolations } from "jest-axe";
import { server } from "./src/mocks/msw";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fetch } from "whatwg-fetch"; // Trenger denne for å få fetch til å funke i tester

expect.extend(toHaveNoViolations);
Element.prototype.scrollIntoView = jest.fn();

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
