import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetDetailJournalEntry?"

export const state = () => ({
  data: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Account Id',
      key: 'AccountId',
      _classes: 'text-center',
      width: 120,
    },
    {
      label: 'Account Desc',
      key: 'AccountDescription',
      _classes: 'text-left',
    },
    {
      label: 'Description',
      key: 'Description',
      _classes: 'text-left',
    }, 
    {
      label: 'Org. Debit',
      key: 'OriginatingDebit',
      _classes: 'text-right currency',
      width: 120,
    }, 
    {
      label: 'Org. Credit',
      key: 'OriginatingCredit',
      _classes: 'text-right currency',
      width: 120,
    }, 
    {
        label: 'Func. Debit',
        key: 'FunctionalDebit',
        _classes: 'text-right currency',
        width: 120,
      }, 
    {
      label: 'Func. Credit',
      key: 'FunctionalCredit',
      width: 120,
      _classes: 'text-right currency',
    },
  ]
});

export const actions = {
  async actGetData({ commit, rootState }, id) {
    try {
      var url = configUrl
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url + 'JournalEntryHeaderId=' + id)
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
  }
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
};
