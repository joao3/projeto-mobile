<template>
  <div v-if="albuns" class="albuns">
    <q-card class="albumCard" v-for="album in albuns" :key="album.title">
      <q-img :src="album.image">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ album.title }}
        </div>
      </q-img>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AlbunsPage',
  data() {
    return {
      albuns: null,
    };
  },
  methods: {
    async loadAlbuns() {
      const url = 'https://api.discogs.com/database/search?type=master&sort=hot&per_page=100&page=1&token=GrLGSaCUkGbliMTFbVuKgVJpIJkOyYGGkYdVFoav';
      const response = await fetch(url);
      const data = await response.json();

      this.albuns = data.results.map((album) => ({
        title: album.title,
        image: album.cover_image,
      }));
    },
  },
  created() {
    this.loadAlbuns();
  },
});
</script>

<style scoped>
  .albuns {
    padding: 16px;
  }

  .albumCard {
    margin-bottom: 16px;
  }
</style>
