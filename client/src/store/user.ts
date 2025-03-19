import { atom } from 'recoil';

// Define User interface
interface User {
    id: string;
    name: string | null;
    email: string;
}

// Update atom with proper typing
export const userAtom = atom<User | null>({
    key: 'userState',
    default: null,
});