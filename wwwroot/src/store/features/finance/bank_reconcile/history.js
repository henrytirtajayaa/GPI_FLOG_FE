import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetHistoryBankReconcile?"

export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  listInfo: [],
  baseUrl: configUrl,
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
        { key: util.docStatus('Posted'), value: 'POSTED' },
        { key: util.docStatus('Void'), value: 'VOID' },
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
  async actGetPrevBankReconcile({ commit, rootState }, model) {

    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('GetPrevBankReconcile?CheckbookCode=' + model.CheckbookCode + '&BankCutoffStart=' + model.BankCutoffStart)
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
  async actGetActivitiesBankReconcile({ commit, rootState }, model) {

    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('GetActivitiesBankReconcile?CheckbookCode=' + model.CheckbookCode + '&BankCutoffEnd=' + model.BankCutoffEnd + '&BankReconcileId=' + model.BankReconcileId)
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
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};
