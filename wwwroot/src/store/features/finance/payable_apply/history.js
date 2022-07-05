import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetHistoryApplyPayable?"

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
      label: 'Doc. Type',
      key: 'DocumentType',
      _classes: 'text-center',
      width: 90,
    },
    {
      label: 'Curr.',
      key: 'CurrencyCode',
      _classes: 'text-center',
      width: 80,
    }, 
    {
      label: 'Vendor Code',
      key: 'VendorCode',
      width: 100,
      _classes: 'text-center',
    },
    {
      label: 'Vendor Name',
      key: 'VendorName',
    },
    {
      label: 'Org. Applied Amount',
      key: 'OriginatingTotalPaid',
      width: 180,
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
        for (var i = 0; i < response.data.PayableApplies.length; i++) {
          response.data.PayableApplies[i]['Status'] = util.docStatusCaption(response.data.PayableApplies[i].Status)
        }

        commit("FETCH_DATA", response.data.PayableApplies);
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
