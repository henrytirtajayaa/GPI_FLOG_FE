import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "GetSalesQuotationAll?"

export const state = () => ({
  TrxModule:20,
  DocFeatureId:60,
  data: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [
        {
        label: 'Trx Type',
        key: 'TransactionType',
        _classes: 'text-left',
        width:130,
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
        width:110,
        },
        {
        label: 'Customer',
        key: 'CustomerName',
        _classes: 'text-left',
        },
        {
        label: 'Sales Person',
        key: 'SalesPerson',
        _classes: 'text-left',
        width:150,
        },   
        {
        label: 'Shipping Line',
        key: 'ShippingLineName',
        _classes: 'text-left',
        width: 150,
        },
        {
        label: 'Total Container',
        key: 'TotalContainer',
        _classes: 'text-center',
        width: 80,
        filter: false,
        },
        {
        label: 'Status',
        key: 'Status',
        _classes: 'text-center',
        width: '200px',
        width: 100,
        filter : false,
        filter_select: true,
        filter_select_options: [
            { key: 1, value: 'New' },
            { key: 44, value: 'Cancel' }, 
            { key: 21, value: 'Submit' }]
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
        for (var i = 0; i < response.data.SalesQuotationHeader.length; i++) {
          response.data.SalesQuotationHeader[i]['Status'] = util.docStatusCaption(response.data.SalesQuotationHeader[i].Status)
        }
      }
      commit("FETCH_DATA", response.data.SalesQuotationHeader);
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
