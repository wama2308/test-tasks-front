<template>
  <v-card outlined class="py-4">
    <v-card-title class="px-6">{{ headerModalDeleteStatus }}</v-card-title>
    <v-card-text>{{ bodyModalDeleteStatus }} </v-card-text>
    <v-card-actions class="px-6">
      <v-spacer />
      <v-btn
        color="error"
        variant="tonal"
        @click="closeModalStatus"
        :disabled="loading"
        >Cancelar</v-btn
      >
      <v-btn
        color="info"
        variant="tonal"
        @click="actionDeleteChangeStatus"
        :loading="loading"
        :disabled="loading"
        >Aceptar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    headerModalDeleteStatus: {
      type: String,
      default: "",
    },
    bodyModalDeleteStatus: {
      type: String,
      default: "",
    },    
    loading: {
      type: Boolean,
      default: false,
    },
    actionDeleteChangeStatus: {
      type: Function,
      default: () => {},
    },
    closeModalStatus: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style>
</style>