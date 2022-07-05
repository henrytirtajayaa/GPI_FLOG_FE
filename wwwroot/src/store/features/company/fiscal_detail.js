import Axios from '../../../plugins/axios';

const configUrl = "fiscalperioddetail?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultPost: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      text: 'Start Date',
      value: 'PeriodStart',
      align: 'center',
      sort: true,
      filter: true,
    },
    {
      text: 'End Date',
      value: 'PeriodEnd',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    }
  ], 
});

export const actions = {
  async actGetFiscalDetail({ commit, rootState }, model) {
    try {
    var url = configUrl
    var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url + 'FiscalHeaderId=' + model.FiscalHeaderId)
      if (response.status == 200) {
        commit("FETCH_DATA_FISCAL_DETAIL", response.data.FiscalPeriodDetails);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actPostFiscalDetail({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('fiscalperioddetail', model)
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
  async actDeleteFiscalDetail({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .delete('fiscalperioddetail', { data: { FiscalHeaderId: row.FiscalHeaderId } })
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
  FETCH_DATA_FISCAL_DETAIL: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultPost = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


