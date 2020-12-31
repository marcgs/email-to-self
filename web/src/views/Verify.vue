<template>
  <div>
    <div  class="alert alert-success mt-5" role="alert" v-if="success">
      <h4 class="alert-heading">All good!</h4>
      You will get your email on {{ when }}.
    </div>
    <div  class="alert alert-danger mt-5" role="alert" v-if="hasErrors()">
      <h4 class="alert-heading">Woops!</h4>
      It looks like something went wrong :-(. Please try again <a href="/" class="alert-link">here</a>.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueRouter from 'vue-router';
import axios from 'axios';
import nprogress from 'nprogress';

@Component
export default class Verify extends Vue {

  private success = false;
  private when = 'unknown';
  private errors = [] as string[];

  mounted() {
    nprogress.start();

    axios.get(`${process.env.VUE_APP_API}/vse?id=${this.$route.query.id}`)
      .then((response) => this.handleSuccess(response.data))
      .catch(error => this.handleError(error))
      .finally(() => nprogress.done());
  }

  private handleSuccess(data: any): void {
    this.success = true;
    this.when = new Date(data.when).toLocaleDateString();
    this.errors = [];
  }

  private handleError(error: any): void {
    this.success = false;
    this.errors.push(error.message);
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

}
</script>
