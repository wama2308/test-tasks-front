<template>
  <v-container class="pa-0" style="max-width: 100%">
    <v-card class="bg-grey-lighten-3 pt-5 pb-7 pb-md-0 px-5">
      <v-row align="center" justify="end" class="py-3">
        <v-col cols="12" md="auto" class="d-flex justify-end pa-0 px-4 pa-md-2">
          <v-switch
            v-model="deleteTasks"
            @change="loadDeleteTasks"
            color="primary"
            label="Eliminadas"
            inset
          ></v-switch>
        </v-col>
        <v-col cols="12" md="3" class="pa-0 px-4 pa-md-2">
          <v-select
            v-model="status"
            :items="itemsStatus"
            item-title="label"
            item-value="value"
            label="Estatus"
            @update:model-value="getTasksParams"
            variant="outlined"
            dense
            :disabled="deleteTasks"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="3" class="pa-0 px-4 pa-md-2">
          <v-select
            v-model="priority"
            :items="itemsPriority"
            item-title="label"
            item-value="value"
            label="Prioridad"
            @update:model-value="getTasksParams"
            variant="outlined"
            dense
            :disabled="deleteTasks"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="auto" class="text-right pa-0 px-4 pa-md-2">
          <v-btn @click="clear" color="light" block :disabled="deleteTasks">Limpiar</v-btn>
        </v-col>
        <v-col cols="12" md="auto" class="text-right pa-0 pt-5 px-4 pa-md-2">
          <v-btn @click="openModal" color="info" block :disabled="deleteTasks">Crear</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { OPTIONS_STATUS, OPTIONS_PRIORITY } from "../constants";

export default {
  props: {
    modal: {
      type: Boolean,
      default: "",
    },
    openModal: {
      type: Function,
      default: () => {},
    },
    getListTasksFilters: {
      type: Function,
      default: () => {},
    },
    setSnackbar: {
      type: Function,
      default: () => {},
    },
    getTasks: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      status: null,
      priority: null,
      deleteTasks: false,
      itemsStatus: OPTIONS_STATUS,
      itemsPriority: OPTIONS_PRIORITY,
    };
  },
  methods: {
    getTasksParams(value) {
      let url = "/tasks";

      if (this.status) {
        url += `?status=${this.status}`;
      }

      if (this.priority) {
        url += this.status
          ? `&priority=${this.priority}`
          : `?priority=${this.priority}`;
      }

      this.$axios
        .get(url)
        .then((response) => {
          this.getListTasksFilters(response.data.data.tasks);
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setSnackbar("Error consultando las tareas", "error");
        });
    },
    clear() {
      this.status = null;
      this.priority = null;
      this.getTasks();
    },
    loadDeleteTasks() {
      this.status = null;
      this.priority = null;
      this.$emit('filterTasksDeleted', this.deleteTasks)
      let url = "/tasks";
      if (this.deleteTasks) url += `?delete=true`;
      this.$axios
        .get(url)
        .then((response) => {
          this.getListTasksFilters(response.data.data.tasks);
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setSnackbar("Error consultando las tareas", "error");
        });
    },
  },
};
</script>

<style>
.filters-container {
  border: none;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  border-radius: 16px;
  box-shadow: 0 9px 20px #2e235e12;
  background: #eeeeee;
  padding: 16px 16px 0;
}

.filter-content {
  display: flex;
  gap: 16px;
  width: 100%;
}
</style>