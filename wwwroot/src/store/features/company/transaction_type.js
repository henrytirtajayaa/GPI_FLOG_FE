import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "MSTransactionType?" 
const configUrlByDocSetup = "MSTransactionTypeByDocSetup?"

export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
        key: 'TransactionType',
        label: 'Transaction Type',
        classes: 'text-left',
        sort: true,
        filter: true,
        width:250,
      },
      {
        key: 'TransactionName',
        label: 'Transaction Name',
        classes: 'text-left',
        sort: true,
        filter: true,
      }
  ], 
});

export const actions = {
  async actGetData({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.TransactionTypes.length; i++) {
          response.data.TransactionTypes[i]['TrxModule'] = util.trxModuleCaption(response.data.TransactionTypes[i].TrxModule)
        }

        commit("FETCH_DATA", response.data.TransactionTypes);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }else{
        commit("FETCH_DATA", []);
      }      
    }
    catch (err) {
      commit("FETCH_DATA", []);
      console.log(err);
    }
  },
  async actGetRawData({ commit, rootState }, url) {
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
        commit("FETCH_DATA", response.data.TransactionTypes);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }else{
        commit("FETCH_DATA", []);
      }      
    }
    catch (err) {
      commit("FETCH_DATA", []);
      console.log(err);
    }
  },

  async actUpdate({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('MSTransactionType', {
            TransactionTypeId : model.TransactionTypeId,
            TransactionType : model.TransactionType,
            TransactionName : model.TransactionName,
            PaymentCondition : model.PaymentCondition,
            RequiredSubject : model.RequiredSubject,
            InActive : model.InActive
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
        .post('MSTransactionType', {
            TransactionTypeId : model.TransactionTypeId,
            TransactionType : model.TransactionType,
            TransactionName : model.TransactionName,
            PaymentCondition : model.PaymentCondition,
            RequiredSubject : model.RequiredSubject,
            InActive : model.InActive
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
      try{
          var response = await new Axios({
              'Content-Type': 'application/json',
              'Authorization': rootState.token
          })
          .delete('MSTransactionType', { data: { TransactionTypeId: row.TransactionTypeId } })
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
  
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value)
};


