import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetDistributionJournalByDocNo?"

export const state = () => ({
  data: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: []
});

export const actions = {
  async actGetData({ commit, rootState }, docNo) {
    try {
      var url = configUrl
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url + 'DocumentNo=' + docNo)
        if (response.status == 200) {
          return response.data.DistributionJournal;
        }else{
          return [];
        }
    }
    catch (err) {
      console.log(err);
      return [];
    }
  }
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
};
