import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetProgressBankReconcile?"

export const state = () => ({
  data: [],
  dataCB: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},  
  listInfo: [],
  listInfoCB: [],
  baseUrl: configUrl,
  baseUrlCB: "GetCheckbookByCutoffDate?",
  headers: [
    {
      label: 'Doc. No',
      key: 'DocumentNo',
      _classes: 'text-center',
      width: 110,
    },
    {
      label: 'Trx. Date',
      key: 'TransactionDate',
      _classes: 'text-center',
      width: 90,
      filter_date: true,
    },
    {
      label: 'Checkbook Code',
      key: 'CheckbookCode',
      width: 120,
      _classes: 'text-center',
    },
    {
      label: 'Curr.',
      key: 'CurrencyCode',
      _classes: 'text-center',
      width: 80,
    }, 
    {
      label: 'Cutoff',
      key: 'BankCutoffEnd',
      _classes: 'text-center',
      width: 80,
      filter_date: true,
      filter:false
    }, 
    {
      label: 'Bank Ending Balance',
      key: 'BankEndingOrgBalance',
      width: 130,
      _classes: 'text-right currency',
      filter: false,
      currency:true
    },
    {
      label: 'Checkbook Ending Balance',
      key: 'CheckbookEndingOrgBalance',
      width: 130,
      _classes: 'text-right currency',
      filter: false,
      currency:true
    },
    {
      label: 'Difference',
      key: 'BalanceDifference',
      width: 100,
      _classes: 'text-right currency',
      filter: false,
      currency:true
    },
    {
      label: 'Status',
      key: 'Status',
      _classes: 'text-center',
      width: '100px',
      filter_select: true,
      filter_select_options: [
        { key: 1, value: 'NEW' },
        { key: 10, value: 'PROCESS' },
        { key: 31, value: 'APPROVED' },
      ]
    }
  ]
});

export const actions = {
  async actGetData({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.Reconciles.length; i++) {
          response.data.Reconciles[i]['Status'] = util.docStatusCaption(response.data.Reconciles[i].Status)
        }

        commit("FETCH_DATA", response.data.Reconciles);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }      
    }
    catch (err) {
      console.log(err);
    }
  },

  async actGetCheckbooksByCutoffDate({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = baseUrlCN
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)

      commit("FETCH_DATA_CB", response.data.Checkbooks);
      commit("FETCH_DATA_CB_INFO", response.data.ListInfo);     
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
        .post('BankReconcile', model)
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

  async actUpdate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('BankReconcile', model)
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

  async actDelete({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('BankReconcile', { data: { BankReconcileId: model.BankReconcileId } })
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
  async actPosting({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusBankReconcile', {
          BankReconcileId: model.BankReconcileId,
          ActionDocStatus: util.docStatus('Posted'),
          Comments: model.Reason,
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
  async actVoid({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusBankReconcile', {
          BankReconcileId: model.BankReconcileId,
          ActionDate : model.VoidDate,
          ActionDocStatus: util.docStatus('Void'),
          Comments: model.Reason,
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
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_DATA_CB: (state, value) => (state.dataCB = value),
  FETCH_DATA_CB_INFO: (state, value) => (state.listInfoCB = value),
};
