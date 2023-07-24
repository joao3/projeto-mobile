import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    page: 1,
    scrollY: 0,
  }),
});
