import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "GetSalesOrderAll?"

export const state = () => ({
  TrxModule:20,
  DocFeatureId:61,
  data: [],
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
        }
      }
      commit("FETCH_DATA", response.data.SalesOrderHeader);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
    }
    catch (err) {
      console.log(err);
    }
  }
 
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value)
 
};
