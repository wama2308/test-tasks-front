<template>
  <v-dialog v-model="modal" persistent width="600">
    <ActionsTask
      :task="task"
      :openModal="openModal"
      :setSnackbar="setSnackbar"
      :addDataTasks="addDataTasks"
      :editDataTasks="editDataTasks"
    />
  </v-dialog>
  <v-dialog v-model="modalDeleteStatus" persistent width="600">
    <DeleteChangeStatus
      :headerModalDeleteStatus="headerModalDeleteStatus"
      :bodyModalDeleteStatus="bodyModalDeleteStatus"
      :actionDeleteChangeStatus="actionDeleteChangeStatus"
      :loading="loading"
      :closeModalStatus="closeModalStatus"
    />
  </v-dialog>
  <div class="taskList">
    <h1>Listado de Tareas</h1>
    <Filters
      :modal="modal"
      :openModal="openModal"
      :getListTasksFilters="getListTasksFilters"
      :setSnackbar="setSnackbar"
      :getTasks="getTasks"
      @filterTasksDeleted="filterTasksDeletedAction"
    />
    <div>
      <p class="my-2">Tareas encontradas: {{ dataTasks.length }}</p>
      <v-table v-if="dataTasks.length">
        <thead class="bg-grey-lighten-2">
          <tr>
            <th class="text-left">Nro</th>
            <th class="text-left">Titulo</th>
            <th class="text-left">Descripción</th>
            <th class="text-left">Prioridad</th>
            <th class="text-left">Estatus</th>
            <th class="text-left">Acciones</th>
          </tr>
        </thead>

        <draggable
          :list="dataTasks"
          @end="updateNumOrder"
          tag="tbody"
          :disabled="filterDeleteTasks || dataTasks.length === 1"
        >
          <tr
            v-for="(item, index) in dataTasks"
            :key="item.id"
            :class="{
              successTr: item.status === 'completada',
              warningTr: item.status === 'pendiente',
            }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
            <td>{{ capitalizeFirstLetter(item.priority) }}</td>
            <td>{{ capitalizeFirstLetter(item.status) }}</td>
            <td>
              <div v-if="!item.deleteAt" class="div-buttons-actions">
                <span title="Editar tarea">
                  <AkEdit @click.stop="showTaskId(item)" class="icon" />
                </span>
                <span title="Eliminar tarea">
                  <FlDelete
                    @click.stop="deleteChangeStatus(item, true)"
                    class="icon"
                  />
                </span>
                <span
                  v-if="item.status === 'pendiente'"
                  title="Completar tarea"
                >
                  <OcTrackedByClosedCompleted
                    @click.stop="deleteChangeStatus(item, false)"
                    title="Completar tarea"
                    class="icon"
                  />
                </span>
              </div>
            </td>
          </tr>
        </draggable>
      </v-table>
    </div>
  </div>
  <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
    {{ text }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import Filters from "./Filters.vue";
import ActionsTask from "./ActionsTask.vue";
import DeleteChangeStatus from "./DeleteChangeStatus.vue";
import { VueDraggableNext } from "vue-draggable-next";
import { OcTrackedByClosedCompleted } from "@kalimahapps/vue-icons";
import { FlDelete } from "@kalimahapps/vue-icons";
import { AkEdit } from "@kalimahapps/vue-icons";

export default {
  components: {
    Filters,
    ActionsTask,
    DeleteChangeStatus,
    draggable: VueDraggableNext,
    OcTrackedByClosedCompleted,
    FlDelete,
    AkEdit,
  },
  data() {
    return {
      dataTasks: [],
      task: null,
      modal: false,
      modalDeleteStatus: false,
      deleteTask: false,
      snackbar: false,
      text: "",
      timeout: 3000,
      colorSnackbar: "",
      loading: false,
      enabled: true,
      dragging: false,
      filterDeleteTasks: false,
    };
  },
  created() {
    this.getTasks();
  },
  computed: {
    headerModalDeleteStatus() {
      return this.deleteTask
        ? "Eliminar tarea"
        : "Colocar tarea como completada";
    },
    bodyModalDeleteStatus() {
      if (this.task) {
        return this.deleteTask
          ? `¿Desea eliminar la tarea "${this.task.title}"?`
          : `¿Desea marcar la tarea "${this.task.title}" como completada?`;
      }
      return "";
    },
  },
  watch: {
    modal: {
      handler(newModal) {
        if (!newModal) {
          this.task = null;
        }
      },
      deep: true,
      immediate: true,
    },
    modalDeleteStatus: {
      handler(newModal) {
        if (!newModal) {
          this.task = null;
          this.deleteTask = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getTasks() {
      this.$axios
        .get("/tasks")
        .then((response) => {
          if (response.data.data && response.data.data.tasks.length) {
            this.dataTasks = response.data.data.tasks;
          }

          return response;
        })
        .catch((error) => {
          this.setSnackbar("Error consultando las tareas", "error");
          return error;
        });
    },
    openModal() {
      this.modal = !this.modal;
    },
    setSnackbar(message, color) {
      this.snackbar = true;
      this.text = message;
      this.colorSnackbar = color;
    },
    addDataTasks(newData) {
      this.dataTasks = [...this.dataTasks, newData];
    },
    editDataTasks(editData) {
      const newData = this.dataTasks.map((item, i) => {
        if (item.id === editData.id) {
          return {
            ...item,
            title: editData.title,
            description: editData.description,
            priority: editData.priority,
          };
        }
        return {
          ...item,
        };
      });
      this.dataTasks = newData;
    },
    deleteDataTasks(id) {
      const newData = this.dataTasks.filter((item) => item.id !== id);
      this.dataTasks = newData;
    },
    changeStatusTask(id) {
      const newData = this.dataTasks.map((item, i) => {
        if (item.id === id) {
          return {
            ...item,
            status: "completada",
          };
        }
        return {
          ...item,
        };
      });
      this.dataTasks = newData;
    },
    showTaskId(data) {
      this.task = data;
      this.openModal();
    },
    deleteChangeStatus(data, deleteTaskValue) {
      if (deleteTaskValue) {
        this.deleteTask = true;
      }
      this.task = data;
      this.modalDeleteStatus = true;
    },
    actionDeleteChangeStatus() {
      let text = "";
      let color = "";
      this.loading = true;
      const url = !this.deleteTask
        ? `/tasks/update-status/${this.task.id}`
        : `/tasks/delete/${this.task.id}`;

      this.$axios
        .put(url)
        .then((response) => {
          text = response.data.message;
          color = "success";
          if (!this.deleteTask) {
            this.changeStatusTask(response.data.data.task.id);
          } else {
            this.deleteDataTasks(response.data.data.task.id);
          }
          return response;
        })
        .catch((error) => {
          text = this.deleteTask
            ? "Error eliminando la tarea"
            : "Error colocando la tarea como completada";
          color = "error";
          return error;
        })
        .finally(() => {
          this.loading = false;
          this.setSnackbar(text, color);
          this.modalDeleteStatus = false;
        });
    },
    getListTasksFilters(data) {
      this.dataTasks = data;
    },
    updateNumOrder() {
      const newOrderData = {
        order: this.dataTasks.map((item, index) => ({
          id: item.id,
          order: index + 1,
        })),
      };
      this.$axios
        .put("/tasks/update/orders", newOrderData)
        .then((response) => {
          this.dataTasks.forEach((item, index) => {
            item.numOrder = index + 1;
          });
          this.setSnackbar("Tarea ordena correctamente", "success");
          return response;
        })
        .catch((error) => {
          return error;
        })
        .finally(() => {});
    },
    filterTasksDeletedAction(value) {
      this.filterDeleteTasks = value;
    },
    closeModalStatus() {
      this.modalDeleteStatus = false;
    },
    capitalizeFirstLetter(value){
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
};
</script>

<style scoped lang="scss">
.div-buttons-actions {
  display: flex;
  align-items: center;
  gap: 16px;

  > span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.taskList {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.successTr {
  background-color: #d4edda;
}

.warningTr {
  background-color: #fff3cd;
}
</style>