<template>
  <div>
    <el-button type="primary" @click="selectPackageDirtory()">
      <i class="el-icon-circle-plus-outline"></i>
      Select package directory
    </el-button>
  </div>
</template>

<style scoped>
</style>

<script>
import { remote as electron } from 'electron';

export default {
  data() {
    return {
    };
  },
  methods: {
    selectPackageDirtory: function () {
      let selectedDirs = electron.dialog.showOpenDialog({ properties: ['openDirectory'] });
      if (selectedDirs != null) {
        this.$store.commit('updatePackageDir', selectedDirs[0]);
        this.$emit('stepFinish')
      }
    }
  },
  components: {
  }
}
</script>