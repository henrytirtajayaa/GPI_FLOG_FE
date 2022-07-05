import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "GetSmartView?"

export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},  
  listInfo: [],
  defaultSmartview: [],
  resultSmartview: [],
  baseUrl: configUrl,
  headers: [
   
    {
      label: 'Smartview Name',
      key: 'SmartTitle',
      _classes: 'text-left',
      width: 300,
    
    },
    {
      label: 'SQL View',
      key: 'SqlViewName',
      _classes: 'text-left',
    },
    {
      label: 'Smartview Group',
      key: 'GroupName',
      _classes: 'text-left',
      width: 250,
    },
   
  ]
});

export const actions = {
  async actGetData({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data.Smartviews);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }      
    }
    catch (err) {
      console.log(err);
    }
  },
  
  async actCreate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('PostSmartView', {
          SmartTitle: model.SmartViewName,
          SqlViewName: model.SQLViewName,
          GroupName: model.SmartViewGroup,
          IsFunction: model.IsFunction
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

  async actUpdate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutSmartView', {
          SmartViewId: model.SmartViewId,
          SmartTitle: model.SmartViewName,
          SqlViewName: model.SQLViewName,
          GroupName: model.SmartViewGroup,
          IsFunction: model.IsFunction
        })
        .then(response => {
          commit("FETCH_RESULT_UPDATE", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  },

  async actDelete({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('DeleteSmartView', { data: { SmartViewId: model.SmartviewId } })
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
  },

  async actGetSmartvieByRoleId({ commit, rootState }, model) {
  
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get("GetSmartViewByRoleId?SecurityRoleId=" + model.SecurityRoleId)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data);  
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actGetDefaultSmartview({ commit, rootState }, model) {
  
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get("GetDefaultSmartview?SmartviewId=" + model.SmartviewId)
      if (response.status == 200) {
        commit("FETCH_DATA_SMARTVIEW", response.data);  
      }else{
        commit("FETCH_DATA_SMARTVIEW", []);  
      }
    }
    catch (err) {
      commit("FETCH_DATA_SMARTVIEW", []);  
      console.log(err);      
    }
  },
  
  async actGetResultSmartview({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post ('GetResultSmartview', {
          SmartviewId: model.SmartviewId,
          Filter: model.Filter
        })
        .then(response => {
          commit("FETCH_DATA_RESULT_SMARTVIEW", response.data);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  },
 
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_DATA_SMARTVIEW: (state, value) => (state.defaultSmartview = value),
  FETCH_DATA_RESULT_SMARTVIEW: (state, value) => (state.resultSmartview = value),
 
};
