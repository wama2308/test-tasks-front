<template>
  <v-card outlined class="py-4">
    <v-card-title class="px-6">{{ headerTitle }}</v-card-title>
    <v-card-text>
      <v-form ref="formActions" v-model="valid">
        <v-row class="pa-0">
          <v-col cols="12">
            <v-text-field
              label="Titulo"
              variant="outlined"
              v-model="title"
              :rules="rulesTitle"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="priority"
              :items="itemsPriority"
              :rules="rulesPriority"
              item-title="label"
              item-value="value"
              label="Prioridad"
              variant="outlined"
              clearable
              dense
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Descripcion"
              variant="outlined"
              v-model="description"
              :rules="rulesDescription"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="px-6">
      <v-spacer />
      <v-btn
        color="error"
        variant="tonal"
        @click="openModal"
        :disabled="loading"
        >Cancelar</v-btn
      >
      <v-btn
        color="info"
        variant="tonal"
        @click="actionTask"
        :loading="loading"
        :disabled="loading"
        >Aceptar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { OPTIONS_PRIORITY } from "../constants";
export default {
  props: {
    task: {
      type: Object,
      default: {},
    },
    openModal: {
      type: Function,
      default: () => {},
    },
    setSnackbar: {
      type: Function,
      default: () => {},
    },
    addDataTasks: {
      type: Function,
      default: () => {},
    },
    editDataTasks: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      priority: null,
      itemsPriority: OPTIONS_PRIORITY,
      valid: false,
      title: "",
      description: "",
      priority: "",
      loading: false,
      // RULES
      rulesTitle: [
        (title) => (title && title.length > 0) || "El titulo es requerido",
      ],
      rulesDescription: [
        (description) =>
          (description && description.length > 0) ||
          "La descripción es requerida",
      ],
      rulesPriority: [
        (priority) =>
          (priority && priority.length > 0) || "La prioridad es requerida",
      ],
    };
  },
  computed: {
    headerTitle() {
      return this.task ? "Editar tarea" : "Registrar tarea";
    },
  },
  watch: {
    task: {
      handler(newTask) {
        if (newTask) {
          this.title = newTask.title;
          this.description = newTask.description;
          this.priority = newTask.priority;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    actionTask() {
      if (this.valid) {
        let text = "";
        let color = "";
        this.loading = true;
        const url = this.task ? `/tasks/${this.task.id}` : "/tasks";
        const method = this.task ? "put" : "post";

        this.$axios[method](url, {
          title: this.title,
          description: this.description,
          priority: this.priority,
        })
          .then((response) => {
            text = response.data.message;
            color = "success";
            if (!this.task) {
              this.addDataTasks(response.data.data.task);
            } else {
              this.editDataTasks(response.data.data.task);
            }
            return response;
          })
          .catch((error) => {
            text = this.task
              ? "Error actualizando la tarea"
              : "Error creando la tarea";
            color = "error";
            return error;
          })
          .finally(() => {
            this.loading = false;
            this.setSnackbar(text, color);
            this.openModal();
          });
      } else {
        this.$refs.formActions.validate();
      }
    },
  },
};
</script>

<style>
</style>