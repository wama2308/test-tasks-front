<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import TaskList from "./components/TaskList.vue";
</script>

<template>
  <main>
    <div class="container">
      <TaskList />
    </div>
  </main>
</template>

<style scoped>
.container {
  width: calc(100% - 40px);
  max-width: 100%;
  margin: 48px auto;
}

@media (min-width: 1024px) {
  .container {
    max-width: 1000px;
    width: 100%;
  }
}
</style>
