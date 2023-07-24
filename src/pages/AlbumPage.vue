<template>
  <div v-if="albumData" class="albumPage">

    <q-card class="albumCard no-shadow">
      <img :src="albumData.image">

      <q-card-section>
        <div><strong>Título:</strong> {{ albumData.title }} </div>
        <div><strong>Artista:</strong> {{ albumData.artist }} </div>
        <div><strong>Ano:</strong> {{ albumData.year }} </div>
        <div><strong>Gêneros:</strong> {{ albumData.genres.join(', ') }} </div>
        <div v-if="likes"><strong>Likes: </strong> {{ likes.length }} </div>
      </q-card-section>

      <q-card-actions v-if="user && likes" align="right">
        <q-btn v-if="isLiked" round color="red" icon="favorite" @click="dislike" />
        <q-btn v-else round icon="favorite" @click="like" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useUserStore } from 'src/stores/user';
import { supabase } from 'src/db/supabase';

const userStore = useUserStore();

export default defineComponent({
  name: 'albumPage',
  data() {
    return {
      albumData: null,
      likes: null,
      albumId: null,
    };
  },
  methods: {
    async loadAlbum() {
      this.albumId = this.$route.params.id;

      const apiKey = import.meta.env.VITE_DISCOGS_TOKEN;

      const url = `https://api.discogs.com/masters/${this.albumId}?token=${apiKey}`;

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

      await this.loadLikes();
    },

    async loadLikes() {
      const { data: tuples } = await supabase
        .from('likes')
        .select('username')
        .eq('id', this.albumId);

      this.likes = tuples.map((tuple) => tuple.username);
    },

    async like() {
      await supabase
        .from('likes')
        .insert([
          { id: this.albumId, username: this.user },
        ]);

      await this.loadLikes();
    },

    async dislike() {
      await supabase
        .from('likes')
        .delete()
        .eq('id', this.albumId)
        .eq('username', this.user);

      await this.loadLikes();
    },
  },

  async created() {
    await this.loadAlbum();
  },

  computed: {
    user() {
      return userStore.user;
    },

    isLiked() {
      return this.likes.includes(userStore.user);
    },
  },
});
</script>

<style scoped>
  .albumPage {
    padding: 16px;
  }
</style>
