import { atom } from 'recoil';

export const userAtom = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

