import Axios from '../../../plugins/axios';

const configUrl = "CompanyBranch?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Branch Code',
      key: 'BranchCode',
      _classes: 'text-left',
      width: 200,
      sort: true,
      filter: true,
    },
    {
      label: 'branch Name',
      key: 'BranchName',
      _classes: 'text-left',
      sort: true,
      filter: true,
    },
    {
      label: 'Default',
      key: 'Default',
      _classes: 'text-center',
      wdith: 80,
      sort: true,
      filter: false,
    },
    {
      label: 'Status',
      key: 'Inactive',
      _classes: 'text-center',
      width: 150,
      sort: true,
      filter_select: true,
      filter_select_options: [
        { key: false, value: 'Active' },
        { key: true, value: 'Inactive' }
      ]
    },
  ]
});

export const actions = {
  async actGetCompanyBranches({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.CompanyBranches.length; i++) {
          response.data.CompanyBranches[i].Default = response.data.CompanyBranches[i].Default ? "YES" : "";
          response.data.CompanyBranches[i].Inactive = response.data.CompanyBranches[i].Inactive ? "Inactive" : "Active";
        }

        commit("FETCH_DATA", response.data.CompanyBranches);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actCreateCompanyBranch({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('CompanyBranch', model)
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

  async actUpdateCompanyBranch({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('CompanyBranch', model)
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

  async actDeleteCompanyBranch({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('CompanyBranch', { data: { CompanyBranchId: row.CompanyBranchId } })
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
