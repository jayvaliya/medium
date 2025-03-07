import { selector } from 'recoil';

export const blogAtom = selector({
    key: 'blogState',
    get: async () => {
        const response = await fetch('/api/v1/blog/bulk');
        const { data } = await response.json();
        return data.blogs;
    }
});
