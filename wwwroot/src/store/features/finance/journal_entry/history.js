import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetJournalEntryHistory?"

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
      label: 'Branch',
      key: 'BranchCode',
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
      label: 'Curr.',
      key: 'CurrencyCode',
      _classes: 'text-center',
      width: 80,
    }, 
    {
      label: 'Source',
      key: 'SourceDocument',
      _classes: 'text-left',
      width: 120,
    }, 
    {
      label: 'Description',
      key: 'Description',
      _classes: 'text-left',
    }, 
    {
      label: 'Org. Total',
      key: 'OriginatingTotal',
      width: 150,
      _classes: 'text-right currency',
      filter: false,
      currency:true
    },
    {
      label: 'Func. Total',
      key: 'FunctionalTotal',
      width: 150,
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
        { key: util.docStatus('Posted'), value: 'Posted' },
        { key: util.docStatus('Void'), value: 'Void' },
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
        for (var i = 0; i < response.data.JournalEntries.length; i++) {
          response.data.JournalEntries[i]['Status'] = util.docStatusCaption(response.data.JournalEntries[i].Status)
        }

        commit("FETCH_DATA", response.data.JournalEntries);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
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
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};
