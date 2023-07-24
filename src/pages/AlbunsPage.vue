<template>
  <div class="albunsPage">
    <q-form @submit.prevent="searchAlbums">
      <q-input v-model="searchQuery"
        input-class="text-left"
        placeholder="Search"
        type="search"
      >
        <template v-slot:append>
          <q-icon v-if="searchQuery === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="searchQuery = ''" />
        </template>
      </q-input>
    </q-form>

    <div v-if="albums" class="albuns">
      <router-link v-for="album in albums" :key="album.id" :to="`albuns/${album.id}`">
        <q-card class="albumCard" >
          <q-img :src="album.image">
            <div class="absolute-bottom text-subtitle2 text-center">
              {{ album.title }}
            </div>
          </q-img>
        </q-card>
      </router-link>

      <div class="flex flex-center">
        <q-pagination
          v-if="albums"
          class="center"
          v-model="currentPage"
          :max="totalPages"
          :max-pages="4"
          :boundary-numbers="false"
          :ellipses="false"
          :boundary-links="true"
          :total-items="totalItems"
          @input="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.albunsPage {
  padding: 16px;
}

.albuns {
  margin-top: 16px;
}

.albumCard {
  margin-bottom: 16px;
}
</style>

<script>
import { defineComponent } from 'vue';
import { useSearchStore } from 'src/stores/search';

const search = useSearchStore();

export default defineComponent({
  name: 'albunsPage',
  data() {
    return {
      albums: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 20,
      totalPages: null,
    };
  },
  methods: {
    // Volta para a busca com a query e número de página do state (quando a página é recarregada).
    async searchAlbumsState() {
      this.currentPage = search.page;
      this.searchQuery = search.query;
      await this.loadAlbums();
    },

    searchAlbums() {
      this.currentPage = 1;
      search.query = this.searchQuery;
      this.loadAlbums();
    },

    async loadAlbums() {
      const apiKey = import.meta.env.VITE_DISCOGS_TOKEN;
      const url = `https://api.discogs.com/database/search?q=${this.searchQuery}&type=master&per_page=${this.itemsPerPage}&page=${this.currentPage}&token=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      this.totalPages = data.pagination.pages;

      this.albums = data.results.map((album) => ({
        id: album.id,
        title: album.title,
        image: album.cover_image,
      }));

      window.scrollTo(0, 0);
    },

    saveScrollY() {
      search.scrollY = window.scrollY;
    },

    resetScrollY() {
      window.scrollTo(0, search.scrollY);
    },
  },

  beforeRouteLeave() {
    this.saveScrollY();
  },

  async created() {
    // Se o state não está vazio, faz a busca.
    // (quando o usuário clica em um item específico e volta para a busca).
    if (search.query !== '') {
      await this.searchAlbumsState();

      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 600));
      this.resetScrollY();
    }
  },

  computed: {
    totalItems() {
      return this.albums ? this.albums.length : 0;
    },
  },

  watch: {
    currentPage() {
      search.page = this.currentPage;
      this.loadAlbums();
    },
  },
});
</script>
