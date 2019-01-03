<template>
  <div>
    <p v-show="optionDatas.length == 0">
      <strong>Select tool html file : </strong>
      <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus" size="mini"></el-button>
    </p>
    <el-dialog title="Select tool html file" :visible.sync="dialogVisible">
      <el-tree
        :props="fileTreeProrps"
        :load="loadFileNode"
        ref="tree"
        lazy
        @check-change="handleTreeCheckChange"
        show-checkbox>
      </el-tree>
      <p>
        <el-button type="primary" size="mini" @click="selectOptionsFinish()">
          Select
        </el-button>
      </p>
    </el-dialog>

    <el-table
      v-show="optionDatas.length != 0"
      :data="optionDatas"
      size="small"
      height="260"
      style="width: 100%">
      <el-table-column
        label="File"
        prop="file">
      </el-table-column>
      <el-table-column
        label="Name">
        <template slot-scope="scope">
          <el-input size="small" placeholder="Please input" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteOptionData(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-show="optionDatas.length != 0">
      <el-button type="primary" @click="finishInputToolData()">
        Next
      </el-button>
    </p>
  </div>
</template>

<style scoped>
</style>

<script>
import fs from "fs";
import path from 'path';

export default {
  data() {
    return {
      dialogVisible: false,
      fileTreeProrps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      optionDatas: [],
      selectedOptions: []
    };
  },
  methods: {
    selectOptionsFinish: function () {
      this.dialogVisible = false;
      for (let file of this.selectedOptions) {
        let relativePosition = file.substr(this.$store.state.packageDir.length + 1);
        this.optionDatas.push({
          file: relativePosition,
          name: path.basename(relativePosition).replace(/\.[a-z0-9_]+$/, '')
        });
      }
    },
    loadFileNode: function (node, resolve) {
      let dir = (node.data != null) ? node.data.path + "/" : this.$store.state.packageDir + "/";
      let files = fs.readdirSync(dir);
      resolve(files.map(function (file) {
        let fullpath = dir + file;
        let isFile = fs.lstatSync(fullpath).isFile();
        return {
          path: fullpath,
          name: file,
          leaf: isFile,
          disabled: !isFile
        }
      }));
    },
    handleTreeCheckChange: function(data, checked, indeterminate) {
      if (checked) {
        this.selectedOptions.push(data.path);
      } else {
        let index = this.selectedOptions.indexOf(data.path);
        if (index !== -1) {
          this.selectedOptions.splice(index, 1);
        }
      }
    },
    deleteOptionData: function(option) {
      let index = this.optionDatas.findIndex(optionData => option.file == optionData.file);
      if (index != -1) {
        this.optionDatas.splice(index, 1);
      }
    },
    finishInputToolData: function() {
      this.$store.commit('updateOptionDatas', this.optionDatas);
      this.$emit('stepFinish');
    }
  },
  components: {
  }
}
</script>