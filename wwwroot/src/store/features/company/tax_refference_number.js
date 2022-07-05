import Axios from '../../../plugins/axios';
import moment from 'moment';

const configUrl = "TaxRefferenceNumber?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    { key: 'StartDate', label: 'Start Date', _classes: 'text-left', width: 300 },
    { key: 'ReffNoStart', label: 'Reff No Start', _classes: 'text-left', width: 400, },
    {
      key: 'ReffNoEnd',
      label: 'Reff No End',
      width: 200,
    },
    { key: 'LastNo', label: 'LastNo', _classes: 'text-center', width: 50, filter: false },
    { key: 'Status', label: 'Status', _classes: 'text-center', width: 80 },
  ],
 
});

export const actions = {
  async actGet({ commit, rootState }, url) {
    var arrTaxRefference = [];
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
        for (var i = 0; i < response.data.TaxRefferenceNumbers.length; i++) {
          arrTaxRefference.push({
            TaxRefferenceId: response.data.TaxRefferenceNumbers[i].TaxRefferenceId,
            StartDate: moment(response.data.TaxRefferenceNumbers[i].StartDate).format('YYYY-MM-DD'),
            ReffNoStart: response.data.TaxRefferenceNumbers[i].ReffNoStart,
            ReffNoEnd: response.data.TaxRefferenceNumbers[i].ReffNoEnd,
            DocLength: response.data.TaxRefferenceNumbers[i].DocLength,
            LastNo: response.data.TaxRefferenceNumbers[i].LastNo,
            Status: response.data.TaxRefferenceNumbers[i].Status,
          });
        }

        
        commit("FETCH_DATA", arrTaxRefference);
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
        .post('TaxRefferenceNumber', {
          StartDate: model.StartDate,
          ReffNoStart: model.ReffNoStart,
          ReffNoEnd: model.ReffNoEnd,
          DocLength: model.DocLength,
          LastNo: model.LastNo,
          Status: model.Status,
        })
        .then(response => {
          commit("FETCH_RESULT_CREATE", response);
        })
        .catch(e => {
          this.error.push(e);
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
        .put('TaxRefferenceNumber', {
          TaxRefferenceId: model.TaxRefferenceId,
          StartDate: model.StartDate,
          ReffNoStart: model.ReffNoStart,
          ReffNoEnd: model.ReffNoEnd,
          DocLength: model.DocLength,
          LastNo: model.LastNo,
          Status: model.Status,
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
        .delete('TaxRefferenceNumber', { data: { TaxRefferenceId: row.TaxRefferenceId, StartDate: row.StartDate } })
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
