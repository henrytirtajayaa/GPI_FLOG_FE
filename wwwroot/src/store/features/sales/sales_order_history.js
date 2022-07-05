import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";
import moment from "moment";

const configUrl = "GetSalesOrderHistory?"

export const state = () => ({
  TrxModule:20,
  DocFeatureId:62,
  data: [],
  dataComment: {},
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
      label: 'Quotation No',
      key: 'QuotDocumentNo',
      _classes: 'text-left',
      width:150,
    },
    {
      label: 'Document Date',
      key: 'TransactionDate',
      _classes: 'text-center',
      filter_date: true,
      width:90,
    },
    {
      label: 'Sales Person',
      key: 'SalesPerson',
      _classes: 'text-left',
      width:130,
    },   
    {
      label: 'Customer',
      key: 'CustomerName',
      _classes: 'text-left',
    }, 
    {
      label: 'Shipping Line',
      key: 'ShippingLineName',
      _classes: 'text-left',
      width: 150,
    },
    {
      label: 'Master No',
      key: 'MasterNo',
      _classes: 'text-left',
      width: 100,
    },
    {
      label: 'Agreement No',
      key: 'AgreementNo',
      _classes: 'text-left',
      width: 100,
    },
    {
      label: 'Func. Selling Amount',
      key: 'FunctionalSellingAmount',
      _classes: 'text-center',
      width: 150,
      filter: false,
      currency: true,
    },
    {
      label: 'Func. Buying Amount',
      key: 'FunctionalBuyingAmount',
      _classes: 'text-center',
      width: 150,
      filter: false,
      currency: true,
    },
    {
      label: 'Func. Frofit Amount',
      key: 'EstimatedFunctionalAmount', 
      _classes: 'text-center',
      width: 150,
      filter: false,
      currency: true,
    },
    {
      label: 'Status',
      key: 'Status',
      _classes: 'text-center',
      width: '200px',
      width: 100,
      filter:false,
      filter_select: true,
      filter_select_options: [{ key: 1, value: 'New' } ]
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
        for (var i = 0; i < response.data.SalesOrderHeader.length; i++) {
          response.data.SalesOrderHeader[i]['Status'] = util.docStatusCaption(response.data.SalesOrderHeader[i].Status)
          response.data.SalesOrderHeader[i]['EstimatedFunctionalAmount'] = response.data.SalesOrderHeader[i]['FunctionalSellingAmount'] - response.data.SalesOrderHeader[i]['FunctionalSellingAmount']
        }
      }
      commit("FETCH_DATA", response.data.SalesOrderHeader);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
    }
    catch (err) {
      console.log(err);
    }
  },
 
  async actGetApprovalComment({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = "GetNegotiationSheetApprovalComments"
      }
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        for (var i = 0; i < response.data.ApprovalComments.length; i++) {
          response.data.ApprovalComments[i]['StatusColor'] = util.docStatusColor(response.data.ApprovalComments[i].Status),
            response.data.ApprovalComments[i]['Status'] = util.docStatusCaption(response.data.ApprovalComments[i].Status),
            response.data.ApprovalComments[i]['CommentDate'] = moment(response.data.ApprovalComments[i].CommentDate,"YYYY-MM-DD HH:mm:ss").utc().format("DD/MM/YYYY HH:mm:ss")
        }
        commit("FETCH_DATA_COMMENT", response.data.ApprovalComments);
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
  FETCH_RESULT_CANCEL: (state, value) => (state.resultCancel = value),
  FETCH_DATA_COMMENT: (state, value) => (state.dataComment = value),
};
