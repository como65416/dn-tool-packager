<template>
  <div>
    <el-upload
      class="icon-selector"
      action="#"
      :show-file-list="false"
      :before-upload="onIconSelected">
      <img v-if="imageUrl" :src="imageUrl" class="icon-img">
      <span v-else>
        select icon
      </span>
    </el-upload>

    <el-form :label-position="'right'" label-width="120px" size="small">
      <el-form-item label="Package Name">
        <el-input v-model="packageName"></el-input>
      </el-form-item>
      <el-form-item label="Package Directory">
        <el-input v-model="$store.state.packageDir" readonly></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="description"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="checkAndFinish()">
      Next
    </el-button>
  </div>
</template>

<style scoped>
.icon-selector {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  line-height: 140px;
  text-align: center;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

.icon-img {
  max-width: 100%;
  max-height: 100%;
}
</style>

<script>
import fs from "fs";
import readChunk from 'read-chunk';

export default {
  data() {
    return {
      imageUrl: ""
    };
  },
  methods: {
    onIconSelected: function (file) {
      let path = file.path;
      let buffer = readChunk.sync(path, 0, 12);
      let imageType = file.type;
      if (!['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/svg+xml'].includes(imageType)) {
        return;
      }
      let bitmap = fs.readFileSync(path);
      let imageDataUrl = "data:" + imageType + ";base64," + Buffer.from(bitmap).toString('base64');
      this.imageUrl = imageDataUrl;
      this.$store.commit('changeIconPath', path)
    },
    checkAndFinish: function () {
      for (let col of ['packageName', 'description']) {
        if (this.$store.state[col].trim().length == 0) {
          this.$message({
            message: 'some data not input',
            type: 'error'
          });
          return;
        }
      }
      if (this.$store.state.iconPath.trim().length == 0) {
        this.$message({
          message: 'not select icon',
          type: 'error'
        });
        return;
      }
      this.$emit('stepFinish');
    }
  },
  computed: {
    packageName: {
      get() {
        return this.$store.state.packageName;
      },
      set(val) {
        this.$store.commit('changePackageName', val)
      }
    },
    description: {
      get() {
        return this.$store.state.description;
      },
      set(val) {
        this.$store.commit('changeDescription', val)
      }
    }
  },
  components: {
  }
}
</script>