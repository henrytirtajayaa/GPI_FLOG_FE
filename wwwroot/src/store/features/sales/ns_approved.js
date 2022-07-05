import Axios from '@/plugins/axios';
import util from "@/helper/utils";
import moment from "moment";

const configUrl = "GetNegotiationSheetApproved?"

export const state = () => ({
  TrxModule:20,
  DocFeatureId:62,
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  resultCancel: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Trx Type',
      key: 'TransactionType',
      _classes: 'text-left',
      width:200,
    },
    {
      label: 'Document No',
      key: 'DocumentNo',
      _classes: 'text-left',
      width:150,
    },
    {
      label: 'Document Date',
      key: 'TransactionDate',
      _classes: 'text-center',
      filter_date: true,
      width:80,
    },
    {
      label: 'So Document No',
      key: 'SoDocumentNo',
      _classes: 'text-left',
      width:150,
    },
    {
      label: 'Customer',
      key: 'CustomerName',
      _classes: 'text-left',
    }, 
    {
      label: 'Master No',
      key: 'MasterNo',
      _classes: 'text-left',
      width:100
    },  
    {
      label: 'Agreement No',
      key: 'AgreementNo',
      _classes: 'text-left',
      width:100
    },    
    {
      label: 'Func. Selling',
      key: 'TotalFuncSelling',
      _classes: 'text-right',
      width: 150,
      filter: false,
      currency: true,
    },
    {
      label: 'Func. Buying',
      key: 'TotalFuncBuying',
      _classes: 'text-right',
      width: 150,
      filter: false,
      currency: true,
    },
    {
      label: 'Func. Frofit',
      key: 'TotalFuncProfit', 
      _classes: 'text-right',
      width: 150,
      filter: false,
      currency: true,
    },
    {
      label: 'Status',
      key: 'IsInvoicePending', 
      _classes: 'text-center',
      width: 150,
      filter_select: true,
      filter_select_options: [{ key: true, value: 'PENDING' }, { key : false , value : 'DONE'} ]
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
        for (var i = 0; i < response.data.NegotiationSheetHeaders.length; i++) {
          response.data.NegotiationSheetHeaders[i]['Status'] = util.docStatusCaption(response.data.NegotiationSheetHeaders[i].Status);
          response.data.NegotiationSheetHeaders[i]['IsInvoicePending'] = response.data.NegotiationSheetHeaders[i].IsInvoicePending ? 'Pending' : 'DONE';
        }
      }
      commit("FETCH_DATA", response.data.NegotiationSheetHeaders);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
    }
    catch (err) {
      console.log(err);
    }
  },
  
  async actCreateInvoice({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('CreateInvoiceNegotiationSheet', {
          NegotiationSheetId: model.NegotiationSheetId,
          InvoiceDate : model.InvoiceDate,
          NsSellings : model.NsSellings,
          NsBuyings : model.NsBuyings,
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
  },
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_RESULT_CANCEL: (state, value) => (state.resultCancel = value)
};
