import Axios from '@/plugins/axios';
import util from "@/helper/utils";

const configUrl = "GetNegotiationSheetAll?"

export const state = () => ({
  TrxModule:20,
  DocFeatureId:62,
  data: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [
            {
                label: 'Doc. No',
                key: 'DocumentNo',
                _classes: 'text-left',
                width:150,  
                filter:true,
                sort:true,
            },
            {
                label: 'SO Doc. No',
                key: 'SoDocumentNo',
                _classes: 'text-left',
                width:150, 
            },
            {
                label: 'Customer Name',
                key: 'CustomerName',
                _classes: 'text-left'
            },
            {
                label: 'Master No',
                key: 'MasterNo',
                _classes: 'text-left'
            },
            {
                label: 'Agreement No',
                key: 'AgreementNo',
                _classes: 'text-left'
            },
            {
                label: 'Booking No',
                key: 'BookingNo',
                _classes: 'text-left'
            },
            {
                label: 'Type',
                key: 'TransactionType',
                _classes: 'text-left',
                filter: false
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
        }
      }
      commit("FETCH_DATA", response.data.NegotiationSheetHeaders);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
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
