import Axios from '../../../plugins/axios';

const configUrl = "MSTransactionTypeByDocSetup?"
export const state = () => ({
  data: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [],
  ACTION_TYPE: {
    TRXTYPE: "MSTransactionTypeByDocSetup?",
  },
});

export const actions = {
  async actGetByDocSetup({ commit, rootState }, trxModule) {
    try {
      let result = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get('MSTransactionTypeByDocSetup?TrxModule=' + trxModule)
      if (response.status == 200) {
        return response.data;
      }  
    }
    catch (err) {
      return []
    }
  },
  
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
};


