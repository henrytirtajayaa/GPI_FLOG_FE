import Axios from '../../../plugins/axios';

const configUrl = "DashboardMyTasks?"
export const state = () => ({
  data: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [],
});

export const actions = {
  async actGetMyTask({ commit, rootState }) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('DashboardMyTasks?')
        .then(response => {
          result = response.data.MyTasks
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
      return result
    }
    catch (err) {
      console.log(err);
      return []
    }
  },
  async actGetMyApprovals({ commit, rootState }) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('DashboardMyApprovals?')
        .then(response => {
          result = response.data.MyApprovals
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
      return result
    }
    catch (err) {
      console.log(err);
      return []
    }
  },
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
};


