<template>
  <div>
    <TopBar />
    <ScheduleEmailForm />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TopBar from '@/components/TopBar.vue'
import ScheduleEmailForm from '@/components/ScheduleEmailForm.vue'

@Component({
  components: { TopBar, ScheduleEmailForm }
})
export default class Home extends Vue {
}
</script>
