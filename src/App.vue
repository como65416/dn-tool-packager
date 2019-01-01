<template>
  <div>
    <el-steps :active="step" style="padding-bottom: 16px;" finish-status="success" align-center>
      <el-step title="Step 1" icon="el-icon-goods" description="Select package directory"></el-step>
      <el-step title="Step 2" icon="el-icon-edit" description="Input package information"></el-step>
      <el-step title="Step 3" icon="el-icon-edit-outline" description="Input tool data"></el-step>
      <el-step title="Step 4" icon="el-icon-sold-out" description="Package and save your package"></el-step>
    </el-steps>
    <div class="step-content" v-if="step == 0">
      <el-button type="primary" @click="selectPackageDirtory()">
        <i class="el-icon-circle-plus-outline"></i>
        Select package directory
      </el-button>
    </div>
    <div class="step-content" v-if="step == 1">
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
          <el-input v-model="packageDir" readonly></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="description"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="finishInputPackageInformation()">
        Next
      </el-button>
    </div>
    <div class="step-content" v-if="step == 2">
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
    <div class="step-content" v-if="step == 3">
      <el-button type="primary" icon="el-icon-sold-out" @click="packageAndSave()">
        Package And Save
      </el-button>
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
import { remote as electron } from 'electron';
import fs from "fs";
import readChunk from 'read-chunk';
import path from 'path';
import AdmZip from 'adm-zip';

export default {
  data() {
    return {
      step: 0,
      packageDir: "",
      packageName: "",
      description: "",
      iconPath: "",
      imageUrl: "",
      dialogVisible: false,
      fileTreeProrps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      optionDatas: [],
      selectedOptions: [],
      options: []
    };
  },
  methods: {
    selectPackageDirtory: function () {
      let selectedDirs = electron.dialog.showOpenDialog({ properties: ['openDirectory'] });
      if (selectedDirs == null) {
        return;
      }

      this.packageDir = selectedDirs[0];
      this.step = 1;
    },
    onIconSelected: function (file) {
      let path = file.path;
      let buffer = readChunk.sync(path, 0, 12);
      let imageType = file.type;
      if (!['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/svg+xml'].includes(imageType)) {
        return;
      }
      let bitmap = fs.readFileSync(path);
      let imageDataUrl = "data:" + imageType + ";base64," + Buffer.from(bitmap).toString('base64');
      this.iconPath = path;
      this.imageUrl = imageDataUrl;
    },
    finishInputPackageInformation: function () {
      this.step = 2;
    },
    selectOptionsFinish: function () {
      this.dialogVisible = false;
      for (let file of this.selectedOptions) {
        let relativePosition = file.substr(this.packageDir.length + 1);
        this.optionDatas.push({
          file: relativePosition,
          name: path.basename(relativePosition).replace(/\.[a-z0-9_]+$/, '')
        });
      }
    },
    loadFileNode: function (node, resolve) {
      let dir = (node.data != null) ? node.data.path + "/" : this.packageDir + "/";
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
      this.step = 3;
    },
    packageAndSave: function() {
      let packageId = "";
      let dnManifestContent = {};
      let iconFileName = Math.random().toString(36).substring(2) + "-" + path.basename(this.iconPath);
      for (let i = 0; i < 4; i++) {
        packageId += Math.random().toString(36).substring(2);
      }
      dnManifestContent.packageId = packageId;
      dnManifestContent.version = "1.0.0";
      dnManifestContent.packageName = this.packageName;
      dnManifestContent.description = this.description;
      dnManifestContent.iconFile = iconFileName;
      dnManifestContent.options = this.optionDatas;

      electron.dialog.showSaveDialog({title: "save package", defaultPath: "package.zip" ,filters: [
        { name: 'Zip', extensions: ['zip'] }
      ]}, (savePath) => {
        let zip = new AdmZip();
        let content = JSON.stringify(dnManifestContent, null, 2);
        let buffer = Buffer.from(fs.readFileSync(this.iconPath));
        zip.addLocalFolder(this.packageDir);
        zip.addFile(iconFileName, buffer);
        zip.addFile("dn-manifest.json", Buffer.alloc(content.length, content), "");
        zip.writeZip(savePath);
      });
    }
  },
  components: {
  }
}
</script>