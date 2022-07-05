import Axios from '../../../plugins/axios';

const configUrl = "securityrole?" 
export const state = () => ({
  data: [],
  datadetail: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  listInfoDetail: [],
  baseUrl: configUrl,
  FormGroup: [],
  headers: [
    {
      text: 'Role Code',
      value: 'RoleCode',
      align: 'text-sm-left',
      sort: true,
      filter: true
    },
    {
      text: 'Role Name',
      value: 'RoleName',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    }
  ], 
});

export const actions = {
  async actGetSecurityrole({ commit, rootState }, url) {
  
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
        commit("FETCH_DATA", response.data.SecurityRoles);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actGetSecurityroleDetail({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('securityroledetail?&RoleId='+ model.RoleId,model)
        .then(response => {
          return response;
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
      return response;

    }
    catch (err) {
      console.log(err);
    } 
  },
  async actGetSecurityroleSmartview({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('SecuritySmartRole?&SecurityRoleId=' + model.RoleId, model)
        .then(response => {
          return response;
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
      return response;

    }
    catch (err) {
      console.log(err);
    }
  },
 
  
  async actUpdateSecurityrole({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('securityrole', {
          RoleCode: model.RoleCode,
          RoleName : model.RoleName,
          RoleId: model.RoleId,
          RoleAccess: model.RoleAccess,
          RoleSmart: model.RoleSmart
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
  async actCreateSecurityrole({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('securityrole', {
        RoleCode: model.RoleCode,
        RoleName: model.RoleName,
        RoleAccess :model.RoleAccess,
        RoleSmart: model.RoleSmart

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
  async actDeleteSecurityrole({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('securityrole', { data: { RoleId: row.RoleId} })
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
  async actDeleteSecurityroleDetail({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('securityroledetail', { data: { AccesId: row} })
      .then(response => {
        commit("FETCH_RESULT_DELETE_DETAIL", response);
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
  FETCH_DATA_GROUP: (state, value) => (state.FormGroup = value),
  FETCH_DATA_FORMS: (state, value) => (state.data = value),
  FETCH_DATA_DETAIL: (state, value) => (state.datadetail = value),
  FETCH_DATA_INFO_DETAIL: (state, value) => (state.listInfoDetail = value),
  FETCH_RESULT_DELETE_DETAIL: (state, value) => (state.resultDelete = value)
};


