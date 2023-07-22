<template>
  <div v-if="albumData" class="albumPage">

    <q-card class="albumCard no-shadow">
      <img :src="albumData.image">

      <q-card-section>
        <div><strong>Título:</strong> {{ albumData.title }}</div>
        <div><strong>Artista:</strong> {{ albumData.artist }}</div>
        <div><strong>Ano:</strong> {{ albumData.year }}</div>
        <div><strong>Gêneros:</strong> {{ albumData.genres.join(', ') }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat round color="" icon="favorite" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'albumPage',
  data() {
    return {
      albumData: null,
    };
  },
  methods: {
    async loadAlbum() {
      const url = `https://api.discogs.com/masters/${this.$route.params.id}?token=GrLGSaCUkGbliMTFbVuKgVJpIJkOyYGGkYdVFoav`;
      const response = await fetch(url);
      const data = await response.json();

      this.albumData = {
        id: data.id,
        title: data.title,
        artist: data.artists[0].name,
        year: data.year,
        image: data.images[0].uri,
        genres: [...data.genres, ...data.styles],
      };
    },
  },

  created() {
    this.loadAlbum();
  },

});
</script>

<style scoped>
  .albumPage {
    padding: 16px;
  }
</style>
