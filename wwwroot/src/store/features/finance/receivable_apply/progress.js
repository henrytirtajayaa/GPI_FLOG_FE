import Axios from '@/plugins/axios';
import util from "@/helper/utils";

const configUrl = "GetProgressApplyReceivable?"

export const state = () => ({
  data: [],
  dataCN: [],
  dataADV: [],
  dataUnapply: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},  
  listInfo: [],
  listInfoCN: [],
  listInfoADV: [],
  listInfoUnapply: [],
  baseUrl: configUrl,
  baseUrlADV: "GetPendingAdvanceReceipt?",
  baseUrlCN: "GetPendingARCreditNote?",
  baseUrlUnapply: "GetPendingARUnapply?",
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
      label: 'Customer Code',
      key: 'CustomerCode',
      _classes: 'text-center',
      width: 100,
    },
    {
      label: 'Customer Name',
      key: 'CustomerName',
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
        for (var i = 0; i < response.data.ReceivableApplies.length; i++) {
          response.data.ReceivableApplies[i]['Status'] = util.docStatusCaption(response.data.ReceivableApplies[i].Status)
        }

        commit("FETCH_DATA", response.data.ReceivableApplies);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }      
    }
    catch (err) {
      console.log(err);
    }
  },

  async actGetAdvancePayment({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = baseUrlADV
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)

      commit("FETCH_DATA_ADV", response.data.Advances);
      commit("FETCH_DATA_ADV_INFO", response.data.ListInfo);     
    }
    catch (err) {
      console.log(err);
    }
  },
  async actGetCreditNote({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = baseUrlUnapply
      }
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)

      commit("FETCH_DATA_CN", response.data.CreditNotes);
      commit("FETCH_DATA_CN_INFO", response.data.ListInfo);     
    }
    catch (err) {
      console.log(err);
    }
  },
  async actGetUnapply({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = baseUrlCN
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      commit("FETCH_DATA_UNAPPLY", response.data.Unapplies);
      commit("FETCH_DATA_UNAPPLY_INFO", response.data.ListInfo);     
    }
    catch (err) {
      console.log(err);
    }
  },
  async actCreate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('ApplyReceivable', {
          TransactionDate: model.TransactionDate,
          DocumentType: model.DocumentType,
          CheckbookTransactionId: model.CheckbookTransactionId,
          ReceiveTransactionId: model.ReceiveTransactionId,
          ReceiptHeaderId: model.ReceiptHeaderId,
          CustomerId: model.CustomerId,
          Description: model.Description,
          OriginatingTotalPaid: model.OriginatingTotalPaid,
          FunctionalTotalPaid : model.FunctionalTotalPaid,
          ARApplyDetails : model.ARApplyDetails
        })
        .then(response => {
          commit("FETCH_RESULT_CREATE", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('ApplyReceivable', {
          ReceivableApplyId : model.ReceivableApplyId,
          TransactionDate: model.TransactionDate,
          DocumentType: model.DocumentType,
          CheckbookTransactionId: model.CheckbookTransactionId,
          ReceiveTransactionId: model.ReceiveTransactionId,
          ReceiptHeaderId: model.ReceiptHeaderId,
          CustomerId: model.CustomerId,
          Description: model.Description,
          OriginatingTotalPaid: model.OriginatingTotalPaid,
          FunctionalTotalPaid : model.FunctionalTotalPaid,
          ARApplyDetails : model.ARApplyDetails
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

  async actDelete({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('ApplyReceivable', { data: { ReceivableApplyId: model.ReceivableApplyId } })
        .then(response => {
          commit("FETCH_RESULT_DELETE", response);
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
    }
    catch (err) {
      console.log(err);
    }
  },
  async actPosting({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusApplyReceivable', {
          ReceivableApplyId: model.ReceivableApplyId,
          ActionDocStatus: util.docStatus('Posted'),
          Comments: model.Reason,
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
  async actVoid({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusApplyReceivable', {
          ReceivableApplyId: model.ReceivableApplyId,
          ActionDate : model.VoidDate,
          ActionDocStatus: util.docStatus('Void'),
          Comments: model.Reason,
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
  FETCH_DATA_ADV: (state, value) => (state.dataADV = value),
  FETCH_DATA_ADV_INFO: (state, value) => (state.listInfoADV = value),
  FETCH_DATA_CN: (state, value) => (state.dataCN = value),
  FETCH_DATA_CN_INFO: (state, value) => (state.listInfoCN = value),
  FETCH_DATA_UNAPPLY: (state, value) => (state.dataUnapply = value),
  FETCH_DATA_UNAPPLY_INFO: (state, value) => (state.listInfoUnapply = value),
};
