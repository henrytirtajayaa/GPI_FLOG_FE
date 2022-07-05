import Axios from '../../../plugins/axios';

const configUrl = "companysecurity?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    { 
      label: 'User Name',
      key: 'UserName',
      _classes: 'text-left',
      sort: true, 
      filter: true,
    },
    {
      label: 'Company',
      key: 'CompanyName',
      _classes: 'text-left',
      sort: true,
      filter: true,
    },
    {
      label: 'Role Name',
      key: 'RoleName',
      _classes: 'text-left',
      sort: true,
      filter: true,
    }
  ], 
});

export const actions = {
  async actGet({ commit, rootState }, url) {
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
        commit("FETCH_DATA", response.data.CompanySecurities);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdate({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('CompanySecurity', {
          CompanySecurityId: model.CompanySecurityId,
          UserId: model.UserId,
          CompanyId: model.CompanyId,
          RoleId: model.RoleId
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
      .post('CompanySecurity', {
          UserId: model.UserId,
          CompanyId : model.CompanyId,
          RoleId: model.RoleId
      
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
      .delete('CompanySecurity', { data: { CompanySecurityId: row.CompanySecurityId } })
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


