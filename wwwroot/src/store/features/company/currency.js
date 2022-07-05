import Axios from '../../../plugins/axios';

const configUrl = "currency?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      text: 'Code',
      value: 'CurrencyCode',
      align: 'text-sm-center',
      width:'100px',
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
      text: 'Symbol',
      value: 'Symbol',
      align: 'text-sm-center',
      width:'100px',
      sort: true, 
      filter: true,
    },
    { 
      text: 'Decimal Places',
      value: 'DecimalPlaces',
      align: 'text-sm-center',
      width:'100px',
      sort: true, 
      filter: true,
    },
  ], 
});

export const actions = {
  async actGetCurrency({ commit, rootState }, url) {
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

        let arrResult = [];
        for (var i = 0; i < response.data.Currencies.length; i++) {
          arrResult.push({
            CurrencyId: response.data.Currencies[i].CurrencyId,
            CurrencyCode: response.data.Currencies[i].CurrencyCode,
            Description: response.data.Currencies[i].Description,
            Symbol: response.data.Currencies[i].Symbol,
            DecimalPlaces: response.data.Currencies[i].DecimalPlaces,
            RealizedGainAcc: response.data.Currencies[i].RealizedGainAcc,
            RealizedLossAcc: response.data.Currencies[i].RealizedLossAcc,
            UnrealizedGainAcc: response.data.Currencies[i].UnrealizedGainAcc,
            UnrealizedLossAcc: response.data.Currencies[i].UnrealizedLossAcc,
            IsFunctional : response.data.Currencies[i].IsFunctional,
            CurrencyUnit: response.data.Currencies[i].CurrencyUnit,
            CurrencySubUnit: response.data.Currencies[i].CurrencySubUnit,
            Inactive : (response.data.Currencies[i].Inactive ? 'Inactive' : 'Active'),
          })
        }
        commit("FETCH_DATA_CURRENCY", arrResult);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdateCurrency({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('Currency', {
        CurrencyId : model.CurrencyId,
        Description : model.Description,
        Symbol : model.Symbol,
        DecimalPlaces : model.DecimalPlaces,
        RealizedGainAcc : model.RealizedGainAcc,
        RealizedLossAcc : model.RealizedLossAcc,
        UnrealizedGainAcc : model.UnrealizedGainAcc,
        UnrealizedLossAcc : model.UnrealizedLossAcc,
        Inactive : model.Inactive,
        CurrencyUnit : model.CurrencyUnit,
        CurrencySubUnit : model.CurrencySubUnit
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
  async actCreateCurrency({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('Currency', {
        CurrencyCode : model.CurrencyCode,
        Description : model.Description,
        Symbol : model.Symbol,
        DecimalPlaces : model.DecimalPlaces,
        RealizedGainAcc : model.RealizedGainAcc,
        RealizedLossAcc : model.RealizedLossAcc,
        UnrealizedGainAcc : model.UnrealizedGainAcc,
        UnrealizedLossAcc : model.UnrealizedLossAcc,
        Inactive : model.Inactive,
        CurrencyUnit : model.CurrencyUnit,
        CurrencySubUnit : model.CurrencySubUnit
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
  async actDeleteCurrency({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .delete('Currency', { data: { CurrencyId: row.CurrencyId } })
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
  FETCH_DATA_CURRENCY: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


