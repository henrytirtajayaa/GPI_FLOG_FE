import Axios from '../../../../plugins/axios';

const configUrl = "GetGLStatementPeriod?"

export const state = () => ({
  data: [],
  periods: [],
  listInfo: [],
  baseUrl: configUrl,
});

export const actions = {
  async actGetTrialBalance({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get("GetStatementTB?PeriodIndex=" + model.PeriodIndex + "&PeriodYear=" + model.PeriodYear + "&BranchCode=" + model.BranchCode)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }      
    }
    catch (err) {
      commit("FETCH_DATA", []);
      console.log(err);
    }
  },
  async actGetPeriod({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('GetGLStatementPeriod?')
      if (response.status == 200) {
        commit("FETCH_PERIOD", response.data);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }      
    }
    catch (err) {
      console.log(err);
    }
  },
  
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_PERIOD: (state, value) => (state.periods = value),
};
