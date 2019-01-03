<template>
  <div>
    <el-steps :active="step" style="padding-bottom: 16px;" finish-status="success" align-center>
      <el-step title="Step 1" icon="el-icon-goods" description="Select package directory"></el-step>
      <el-step title="Step 2" icon="el-icon-edit" description="Input package information"></el-step>
      <el-step title="Step 3" icon="el-icon-edit-outline" description="Input tool data"></el-step>
      <el-step title="Step 4" icon="el-icon-sold-out" description="Packaging and save"></el-step>
    </el-steps>
    <div class="step-content">
      <step1 v-if="step == 0" @stepFinish="toNextStep()"></step1>
      <step2 v-if="step == 1" @stepFinish="toNextStep()"></step2>
      <step3 v-if="step == 2" @stepFinish="toNextStep()"></step3>
      <step4 v-if="step == 3" @stepFinish="toNextStep()"></step4>
    </div>
  </div>
</template>

<style scoped>
.step-content {
  text-align:center;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
</style>

<script>
import Step1 from './components/Step1.vue';
import Step2 from './components/Step2.vue';
import Step3 from './components/Step3.vue';
import Step4 from './components/Step4.vue';

export default {
  data() {
    return {
      step: 0
    };
  },
  methods: {
    toNextStep: function () {
      this.step++;
    }
  },
  components: {
    step1: Step1,
    step2: Step2,
    step3: Step3,
    step4: Step4
  }
}
</script>