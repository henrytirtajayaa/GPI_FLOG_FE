import Axios from '../../../plugins/axios';

const configUrl = "user?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      text: 'User Full Name',
      value: 'UserFullName',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    { 
      text: 'Email Address',
      value: 'EmailAddress',
      align: 'text-sm-left',
      sort: true, 
      filter: true,
    },
    { 
      text: 'User Group Code',
      value: 'UserGroupCode',
      align: 'text-sm-left',
      sort: true, 
      filter: true,
    },
  ]
});

export const actions = {
  async actGetUser({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.Users.length; i++) {
          response.data.Users[i]['InActive'] = (response.data.Users[i].InActive ? "Inactive" : "Active");
        }

        commit("FETCH_DATA_USER", response.data.Users);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actCreateUser({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('User', {
        UserFullName : model.UserFullName,
        UserPassword : model.UserPassword,
        EmailAddress: model.EmailAddress,
        UserGroupId: model.UserGroupId,
        InActive: model.InActive
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
  async actUpdateUser({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('User', {
          UserId: model.UserId,
          UserFullName: model.UserFullName,
          UserPassword: model.UserPassword,
          EmailAddress: model.EmailAddress,
          UserGroupId: model.UserGroupId,
          InActive: model.InActive
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
  async actDelete({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('User', { data: { UserId: row.UserId } })
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
  FETCH_DATA_USER: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
};


