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
    searchAlbums() {
      this.currentPage = 1;
      this.loadAlbums();
    },

    async loadAlbums() {
      const url = `https://api.discogs.com/database/search?q=${this.searchQuery}&type=master&per_page=${this.itemsPerPage}&page=${this.currentPage}&token=GrLGSaCUkGbliMTFbVuKgVJpIJkOyYGGkYdVFoav`;
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
  },

  computed: {
    totalItems() {
      return this.albums ? this.albums.length : 0;
    },
  },

  watch: {
    currentPage() {
      this.loadAlbums();
    },
  },
});
</script>
