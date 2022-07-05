import Axios from '../../../plugins/axios';

const configUrl = "calcmethod?"
export const state = () => ({
  data: [],
  companyBranches : [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [],
  ACTION_TYPE: {
    CALC_METHOD: "calcmethod?",
    RATE_TYPE: "ratetype?",
    DOC_STATUS : "docstatus?",
    TRX_MODULE : "trxmodule?"
  },
  resultUpdate: {},
});

export const actions = {
  async actGet({ commit, rootState }, url) {
    if(url != ''){
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
          .get(url)
        if (response.status == 200) {
          if(url.indexOf(this.state.features.finance.constants.ACTION_TYPE.RATE_TYPE) > -1){
            commit("FETCH_DATA", response.data.RateTypes);
          }else if(url.indexOf(this.state.features.finance.constants.ACTION_TYPE.CALC_METHOD) > -1){
            commit("FETCH_DATA", response.data.CalcMethods);
          }else if(url.indexOf(this.state.features.finance.constants.ACTION_TYPE.DOC_STATUS) > -1){
            commit("FETCH_DATA", response.data.DocStatus);
          }else if(url.indexOf(this.state.features.finance.constants.ACTION_TYPE.TRX_MODULE) > -1){
            commit("FETCH_DATA", response.data.TrxModules);
          }else{
            commit("FETCH_DATA", []);
          }
          commit("FETCH_DATA_INFO", response.data.ListInfo);
        }
      }
      catch (err) {
        console.log(err);
      }
    }
  }, 
  async actGetRateType({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(this.state.features.finance.constants.ACTION_TYPE.RATE_TYPE)
        .then(response => {
          result = response.data.RateTypes
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
  async actGetDocStatus({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(this.state.features.finance.constants.ACTION_TYPE.DOC_STATUS)
        .then(response => {
          result = response.data.DocStatus
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
  async actGetCalcMethod({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(this.state.features.finance.constants.ACTION_TYPE.CALC_METHOD)
        .then(response => {
          result = response.data.CalcMethods
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
  async actGetTrxModule({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(this.state.features.finance.constants.ACTION_TYPE.TRX_MODULE)
        .then(response => {
          result = response.data.TrxModules
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
  async actGetMinInputDateFinancial({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('MinInputDate?TrxModule=3')
        .then(response => {
          result = response.data.MinInputDate
          commit("FETCH_DATA_BRANCH", response.data.CompanyBranches);
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
  async actGetMinInputDatePurchasing({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('MinInputDate?TrxModule=1')
        .then(response => {
          result = response.data.MinInputDate
          commit("FETCH_DATA_BRANCH", response.data.CompanyBranches);
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
  async actGetMinInputDateSales({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('MinInputDate?TrxModule=2')
        .then(response => {
          result = response.data.MinInputDate
          commit("FETCH_DATA_BRANCH", response.data.CompanyBranches);
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
  /** BEGIN POSTING SETUP */
  async actGetPostingParam({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('PostingParam')
        .then(response => {
          result = response.data.PostingParams
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
  async actUpdatePostingParam({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PostingParam', {
          PostingParams : model.PostingParams,
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
  }, /** END POSTING SETUP */
  /** BEGIN DOC NUMBER SETUP */
  async actGetDocNumberSetup({ commit, rootState }, model) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('DocNumberSetup')
        .then(response => {
          result = response.data;
        })
        .catch(e => {
          this.errors.push(e);
          result = []
        })
      return result
    }
    catch (err) {
      console.log(err);
      return []
    }
  },
  async actUpdateDocNumberSetup({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('DocNumberSetup', {
          DocNumberSetups : model.DocNumberSetups,
          TrxTypeSetups : model.TrxTypeSetups,
        })
        .then(response => {
          commit("FETCH_RESULT_UPDATE", response);
        })
        .catch(e => {
          commit("FETCH_RESULT_UPDATE", []);
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  }, /** END DOC NUMBER SETUP */

};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_DATA_BRANCH: (state, value) => (state.companyBranches = value),
};


