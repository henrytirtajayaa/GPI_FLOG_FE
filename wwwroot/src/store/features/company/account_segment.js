import Axios from '../../../plugins/axios';

const configUrl = "AccountSegment?" 
export const state = () => ({
  data: [],
  resultPost: {},
  resultDelete: {},
  listInfo: [],
  baseUrl: configUrl,
  CoaTotalLength: 0
});

export const actions = {
  async actGetAccountSegment({ commit, rootState }, url) {
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
        commit("FETCH_DATA_ACCOUNT_SEGMENT", response.data.AccountSegments);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
        commit("FETCH_RESULT_COA_TOTAL_LENGTH", response.data.CoaTotalLength);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actPostAccountSegment({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('AccountSegment', model)
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
  async actDeleteAccountSegment({ commit, rootState }) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('AccountSegment')
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
  FETCH_DATA_ACCOUNT_SEGMENT: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultPost = value),
  FETCH_RESULT_COA_TOTAL_LENGTH: (state, value) => (state.CoaTotalLength = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


