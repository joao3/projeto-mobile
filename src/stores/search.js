import { defineStore } from 'pinia';

export const useSearchStore = defineStore('counter', {
  state: () => ({
    query: '',
    page: 1,
  }),
});
