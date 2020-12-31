<template>
  <div>
    <div class="login-container">
      <Login />
    </div>
    <div class="text-center">
      <img class="logo" alt="Email to self logo" src="@/assets/logo.png">
    </div>
    
  </div>
</template>

<style lang="scss">
  .login-container {
    float: right;
  }
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Login from '@/components/Login.vue'

@Component({
  components: { Login }
})
export default class TopBar extends Vue {
}
</script>
