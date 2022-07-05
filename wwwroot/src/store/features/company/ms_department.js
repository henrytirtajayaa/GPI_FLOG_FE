import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "MsDepartment?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
        key: 'DepartmentCode',
        label: 'Department Code',
        classes: 'text-left',
        sort: true,
        filter: true,
      },
      {
        key: 'DepartmentName',
        label: 'Department Name',
        classes: 'text-left',
        sort: true,
        filter: true,
      }
  ], 
});

export const actions = {
  async actGetData({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data.Departments);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }else{
        commit("FETCH_DATA", []);
      }      
    }
    catch (err) {
      commit("FETCH_DATA", []);
      console.log(err);
    }
  },
  async actGetRawData({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data.Departments);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }else{
        commit("FETCH_DATA", []);
      }      
    }
    catch (err) {
      commit("FETCH_DATA", []);
      console.log(err);
    }
  },

  async actUpdate({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('MsDepartment', {
            DepartmentId : model.DepartmentId,
            DepartmentCode : model.DepartmentCode,
            DepartmentName : model.DepartmentName,
            Inactive : model.InActive
      })
      .then(response => {
        commit("FETCH_RESULT_UPDATE", response);
      })
      .catch(e => {
        this.errors.push(e);
      })
    }
    catch (err){
      console.log(err)
    }
  },

  async actCreate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('MsDepartment', {
            DepartmentCode : model.DepartmentCode,
            DepartmentName : model.DepartmentName,
            Inactive : model.InActive
      })
      .then(response => {
        commit("FETCH_RESULT_CREATE", response);
      })
      .catch(e => {
        this.errors.push(e);
      })
    }
    catch (err) {
      console.log(err);
    }
  },
  
  async actDelete({ commit, rootState }, row) {
      try{
          var response = await new Axios({
              'Content-Type': 'application/json',
              'Authorization': rootState.token
          })
          .delete('MsDepartment', { data: { DepartmentId: row.DepartmentId } })
          .then(response => {
              commit("FETCH_RESULT_DELETE", response);
          })
          .catch(e => {
              this.errors.push(e);
              alert(this.errors);
          })
      }
      catch (err) {
          console.log(err);
      }
  }
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value)
};


