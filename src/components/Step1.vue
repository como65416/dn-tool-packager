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
    selectPackageDirtory: async function () {
      let result = await electron.dialog.showOpenDialog({ properties: ['openDirectory'] });
      if (result.filePaths.length != 0) {
        this.$store.commit('updatePackageDir', result.filePaths[0]);
        this.$emit('stepFinish')
      }
    }
  },
  components: {
  }
}
</script>
