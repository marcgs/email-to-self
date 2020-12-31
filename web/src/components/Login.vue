<template>
  <div>
    <button type="button" @click="login" v-if="!loggedInUserEmail" class="btn btn-link">Login</button>
    <button type="button" @click="logout" v-if="loggedInUserEmail" class="btn btn-link">Logout</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueRouter from 'vue-router';
import axios from 'axios';
import nprogress from 'nprogress';
import authService from '../services/auth.service';

@Component
export default class Login extends Vue {

  public login(): void {
    authService.login();
  }

  public logout(): void {
    authService.logout();
  }

  get loggedInUserEmail(): string {
    return authService.getLoggedInUserEmail();
  }
}
</script>
