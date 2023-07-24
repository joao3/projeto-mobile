<template>
  <div class="loginPage">
    <q-input v-model="usuario"
      input-class="text-left"
      placeholder="Usuário"
      @change="handleUserChange"
    >
      <template v-slot:prepend>
        <q-icon name="person" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useUserStore } from 'src/stores/user';

const user = useUserStore();

export default defineComponent({
  name: 'LoginPage',
  data() {
    return {
      usuario: '',
    };
  },

  created() {
    this.usuario = user.user;
  },

  methods: {
    handleUserChange() {
      user.user = this.usuario;
    },
  },
});
</script>

<style scoped>
  .loginPage {
    padding: 16px;
  }
</style>
