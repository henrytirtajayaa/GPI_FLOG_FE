import Axios from '../../../plugins/axios';
import moment from 'moment'

const configUrl = "exchangeratedetail?" 
export const state = () => ({
  data: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      text: 'Date',
      value: 'RateDate',
      width:100,
      align: 'text-sm-left',
      sort: true,
      filter: true,
      display: true
    },
    {
      text: 'Expired Date',
      value: 'ExpiredDate',
      align: 'text-sm-left',
      width:100,
      sort: true,
      filter: true,
      display: true
    },
    { 
      text: 'Rate',
      value: 'RateAmount',
      align: 'text-sm-center',
      width:150,
      sort: true, 
      filter: true,
      display: true
    }
  ], 
});

export const actions = {
  async actGetData({ commit, rootState }, model) {
    try {
      var url = configUrl
      var arrExchange = [];
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url + 'ExchangeRateHeaderId=' + model.ExchangeRateHeaderId)
        for (var i = 0; i < response.data.GetExchangeRateDetail.length; i++) {
          arrExchange.push({  
            ExchangeRateDetailId: response.data.GetExchangeRateDetail[i].ExchangeRateDetailId,
            ExchangeRateHeaderId: response.data.GetExchangeRateDetail[i].ExchangeRateHeaderId,
            RateAmount: response.data.GetExchangeRateDetail[i].RateAmount,
            RateDate: moment(response.data.GetExchangeRateDetail[i].RateDate).format('DD-MM-YYYY'),
            ExpiredDate: moment(response.data.GetExchangeRateDetail[i].ExpiredDate).format('DD-MM-YYYY'),
            Status: response.data.GetExchangeRateDetail[i].Status
          })
        }
        if (response.status == 200) {
          response.data.GetExchangeRateDetail = arrExchange
          return response;
        }
    }
    catch (err) {
      console.log(err);
    }
  }
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
};


