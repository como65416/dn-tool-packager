<template>
  <div>
    <el-button type="primary" icon="el-icon-sold-out" @click="packageAndSave()">
      Packaging And Save
    </el-button>
  </div>
</template>

<style scoped>
</style>

<script>
import { remote as electron } from 'electron';
import fs from "fs";
import path from 'path';
import JSZip from "jszip";
import recursive from "recursive-readdir";

export default {
  data() {
    return {
    };
  },
  methods: {
    packageAndSave: function() {
      let packageId = "";
      let dnManifestContent = {};
      for (let i = 0; i < 4; i++) {
        packageId += Math.random().toString(36).substring(2);
      }
      let iconFileName = packageId + "-icon." + path.basename(this.$store.state.iconPath).replace(/.*?\./, '');
      dnManifestContent.packageId = packageId;
      dnManifestContent.version = "1.0.0";
      dnManifestContent.packageName = this.$store.state.packageName;
      dnManifestContent.description = this.$store.state.description;
      dnManifestContent.iconFile = iconFileName;
      dnManifestContent.options = this.$store.state.optionDatas;

      electron.dialog.showSaveDialog({title: "save package", defaultPath: "package.zip" ,filters: [
        { name: 'Zip', extensions: ['zip'] }
      ]}, (savePath) => {
        let manifestContent = JSON.stringify(dnManifestContent, null, 2);
        recursive(this.$store.state.packageDir, (err, files) => {
          let zip = new JSZip();
          // package folder file
          for (let file of files) {
            let relativePath = file.substr(this.$store.state.packageDir.length + 1);
            let buffer = Buffer.from(fs.readFileSync(file));
            zip.file(relativePath, buffer);
          }
          // icon file
          let buffer = Buffer.from(fs.readFileSync(this.$store.state.iconPath));
          zip.file(iconFileName, buffer);
          // dn-manifest.json
          zip.file("dn-manifest.json", manifestContent);

          zip.generateNodeStream({type:'nodebuffer', streamFiles:true})
            .pipe(fs.createWriteStream(savePath))
            .on('finish', () => {
              this.$message({
                message: 'Save Success',
                type: 'success'
              });
            });
        });
      });
    }
  },
  components: {
  }
}
</script>