import Axios from '../../../plugins/axios';

const configUrl = "approvalsetup?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
 
  headers: [
    {
      text: 'Approval Code',
      value: 'ApprovalCode',
      width:100,
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    {
      text: 'Description',
      value: 'Description',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    { 
      text: 'Level',
      value: 'Level',
      align: 'text-sm-center',
      width:150,
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
        commit("FETCH_DATA", response.data.ApprovalSetup);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actGetDataWithPerson({ commit, rootState }, url) {
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
        commit("FETCH_DATA", response.data.ApprovalSetup);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateApprovalSetup({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('approvalsetup', {
          ApprovalSetupHeaderId:model.ApprovalSetupHeaderId,
          ApprovalCode: model.ApprovalCode,
          Description: model.Description,
          Level: model.Level,
          Status: 1,
          ApprovalSetupDetails: model.ApprovalSetupDetails
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
  async actCreateApprovalSetup({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('approvalsetup', {
          ApprovalCode : model.ApprovalCode,
          Description: model.Description,
          Level:model.Level,
          Status : 1,
          ApprovalSetupDetails: model.ApprovalSetupDetails
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
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('approvalsetup', { data: { ApprovalSetupHeaderId: row.ApprovalSetupHeaderId } })
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
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


