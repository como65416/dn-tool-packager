import Vuex from 'vuex';

let createStore = () => new Vuex.Store({
  state: {
    packageDir: "",
    packageName: "",
    description: "",
    iconPath: "",
    optionDatas: []
  },
  mutations: {
    updatePackageDir (store, value) {
      store.packageDir = value;
    },
    changePackageName (store, value) {
      store.packageName = value;
    },
    changeDescription (store, value) {
      store.description = value;
    },
    changeIconPath (store, value) {
      store.iconPath = value;
    },
    updateOptionDatas (store, value) {
      store.optionDatas = value;
    }
  }
});

export default {
  createStore
}