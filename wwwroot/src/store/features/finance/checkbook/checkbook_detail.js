import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetDetailCheckbookTransaction?"

export const state = () => ({
  data: [],
  listInfo: [],
  resultDataPrint: [],
  baseUrl: configUrl,
  headers: []
});

export const actions = {
  async actGetData({ commit, rootState }, id) {
    try {
      var url = configUrl
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url + 'CheckbookTransactionId=' + id)
        if (response.status == 200) {
          return response.data.DetailEntries;
        }else{
          return [];
        }
    }
    catch (err) {
      console.log(err);
      return [];
    }
  },
  async actGetDataPrint({ commit, rootState }, model) {
  
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get("GetCheckbookTransactionById?CheckbookTransactionId=" + model.CheckbookTransactionId + "&CompanyId=" + model.CompanyId)
      if (response.status == 200) {
        commit("FETCH_DATA_PRINT", response.data);  
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
  FETCH_DATA_PRINT: (state, value) => (state.resultDataPrint = value),
};
