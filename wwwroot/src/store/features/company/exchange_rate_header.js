import Axios from '../../../plugins/axios';

const configUrl = "exchangerate?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  dataExcRate: 0,
  dataExcIsMultiply: true,
  baseUrl: configUrl,
 
  headers: [
    {
      text: 'Exchange Code',
      value: 'ExchangeRateCode',
      width:100,
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    {
      text: 'Description',
      value: 'Description',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    { 
      text: 'Currency Code',
      value: 'CurrencyCode',
      align: 'text-sm-center',
      width:150,
      sort: true, 
      filter: true,
    },
    { 
      text: 'Expired Period',
      value: 'ExpiredPeriod',
      align: 'text-sm-center',
      width:150,
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
        commit("FETCH_DATA", response.data.ExchangeRateHeaders);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actGetCurrentExchangeRate({ commit, rootState }, url) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA_RATE_AMOUNT", response.data.ExcRate);
        commit("FETCH_DATA_RATE_IS_MULTIPLY", response.data.IsMultiply);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdate({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('exchangerate', {
          ExchangeRateHeaderId: model.ExchangeRateHeaderId,
          ExchangeRateCode: model.ExchangeRateCode,
          CurrencyCode: model.CurrencyCode,
          Description: model.Description,
          RateType: model.RateType,
          ExpiredPeriod: model.ExpiredPeriod,
          CalculationType: model.CalculationType,
          Status: 1,
          ExchangeRateDetails: model.ExchangeRateDetails
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
        .post('exchangerate', {
            ExchangeRateCode: model.ExchangeRateCode,
            CurrencyCode: model.CurrencyCode,
            Description: model.Description,
            RateType: model.RateType,
            ExpiredPeriod: model.ExpiredPeriod,
            CalculationType: model.CalculationType,
            Status: 1,
            ExchangeRateDetails: model.ExchangeRateDetails
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
          .delete('exchangerate', { data: { ExchangeRateHeaderId: row.ExchangeRateHeaderId } })
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
  FETCH_DATA_RATE_AMOUNT: (state, value) => (state.dataExcRate = value),
  FETCH_DATA_RATE_IS_MULTIPLY:  (state, value) => (state.dataExcIsMultiply = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value)
};


