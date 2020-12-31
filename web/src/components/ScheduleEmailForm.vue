<template>
  <div class="container">
    <form class="mt-5 mb-3">
      <fieldset :disabled="!!loading">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" class="form-control form-control-lg" v-model="email" :readonly="!!loggedInUserEmail">
        </div>
        <div class="form-group">
          <label for="subject">Subject</label>
          <input id="subject" class="form-control form-control-lg" v-model="subject">
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" class="form-control form-control-lg" rows="4" v-model="message" placeholder="Say something to your future self!"/>
        </div>
        <div class="form-group">
          <label for="when">When</label>
          <v-date-picker v-model="when" :min-date='new Date()' :popover="{ visibility: 'focus' }"/>  
        </div>
        <div v-if="submitted">
          <div v-if="hasErrors()" class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Woops!</h4>
            <p>It looks like something went wrong :-(</p>
          </div>
        </div>
      </fieldset>
      <button type="submit" @click.prevent="schedule" class="btn-lg btn-primary btn-block" :disabled="!!loading">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="!!loading"></span>
        Schedule it!
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueRouter from 'vue-router';
import axios from 'axios';
import nprogress from 'nprogress';
import authService from '../services/auth.service';

@Component
export default class ScheduleEmailForm extends Vue {
  private email = this.loggedInUserEmail;
  private subject = "";
  private message = "";
  private when = "";
  private loading = false;
  private submitted = false;
  private errors = [] as string[];

  mounted() {
    axios.interceptors.request.use(config => {
      this.loading = true;
      nprogress.start();
      return config;
    });

    axios.interceptors.response.use(
      response => {
        this.loading = false;
        nprogress.done();
        return response;
      },
      error => {
          this.loading = false;
          nprogress.done();
          return Promise.reject(error);
      }
    );
  }

  public schedule(): void {
    const data = {
        email: this.email,
        subject: this.subject,
        message: this.message,
        when: this.when
    };
    
    axios.post(`${process.env.VUE_APP_API}/rse`,data)
      .then(() => this.handleSuccess())
      .catch(error => this.handleError(error))
      .finally(() => this.submitted = true);
  }

  private handleSuccess(): void {
    this.errors = [];
    this.cleanInputs();
    this.$router.push("/success");
  }

  private handleError(error: any): void {
    this.errors.push(error.message);
  }

  private cleanInputs(): void {
    this.email = "";
    this.subject = "";
    this.message = "";
    this.when = "";
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  get loggedInUserEmail(): string {
    return authService.getLoggedInUserEmail();
  }
}
</script>
