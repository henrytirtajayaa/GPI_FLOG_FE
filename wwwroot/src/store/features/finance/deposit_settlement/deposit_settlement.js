import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetProgressDepositSettlement?"

export const state = () => ({
  data: [],
  dataDetail: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  resultPosting: {},
  resultTrxDelete: {},
  resultApprove: {},
  resultDataPrint: [],
  listInfo: [],
  baseUrlInvoice: "GetPendingDeposit?",
  baseUrl: configUrl,
  headers: [
    {
      label: 'Document No',
      key: 'DocumentNo',
      classes: 'text-left',
      width: 150,
      sort: true,
      filter: true,
    },
    {
      label: 'Document Date',
      key: 'TransactionDate',
      _classes: 'text-center',
      width: 110,
      filter_date: true,
    },
    {
      label: 'Doc. Type',
      key: 'DocumentType',
      _classes: 'text-left',
      width: 150,
      filter: true,
    },
    {
      label: 'Customer Name',
      key: 'CustomerName',
      classes: 'text-left',
      sort: true,
      width: 170,
      filter: true,
    },
    {
      label: 'Currency Code',
      key: 'CurrencyCode',
      _classes: 'text-center',
      width: 100,
      sort: true,
      filter: true,
    },
    // {
    //   label: 'Org. Payable Doc. Amount',
    //   key: 'OriginatingTotalInvoice',
    //   width: 250,
    //   _classes: 'text-right currency',
    //   currency: true,
    //   sort: true,
    //   filter: false,
    // },
    {
      label: 'Org.Deposit Amount',
      key: 'OriginatingTotalPaid',
      width: 150,
      _classes: 'text-right currency',
      sort: true,
      filter: false,
      currency: true
    },
    {
      label: 'Deposit Amount',
      key: 'AppliedTotalPaid',
      width: 150,
      _classes: 'text-right currency',
      currency: true,
      sort: true,
      filter: false,
    },
    {
      label: 'Status',
      key: 'Status',
      _classes: 'text-center',
      width: '200px',
      width: 100,
      filter_select: true,
      filter_select_options: [
        { key: 1, value: 'NEW' },
        { key: 21, value: 'SUBMIT' },
        { key: 8, value: 'POSTED' },
        { key: 55, value: 'VOID' }
      ]
    }
  ],
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
        for (var i = 0; i < response.data.DepositSettlement.length; i++) {
          response.data.DepositSettlement[i]['Status'] = util.docStatusCaption(response.data.DepositSettlement[i].Status)
        }
      }
      commit("FETCH_DATA", response.data.DepositSettlement);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
    }
    catch (err) {
      console.log(err);
    }
  },

  async actGetDataDetail({ commit, rootState }, url) {
  
    var arrData = [];
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
        for (var i = 0; i < response.data.DepositSettlement.length; i++) {
          arrData.push({
            SettlementHeaderId: response.data.DepositSettlement[i].SettlementHeaderId,
            ReceiveTransactionId: response.data.DepositSettlement[i].ReceiveTransactionId,
            OriginatingBalance: response.data.DepositSettlement[i].OriginatingBalance,
            OrgPaidAmount: response.data.DepositSettlement[i].OriginatingPaid,
          });
        }
      }
      commit("FETCH_DATA_DETAIL", arrData);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
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
        .post('DepositSettlement', {
          TransactionDate: model.TransactionDate,
          DocumentType: model.DocumentType,
          DocumentNo: model.DocumentNo,
          ReceiveTransactionId: model.ReceiveTransactionId,
          DepositNo: model.DepositNo,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.ExchangeRate,
          IsMultiply: model.IsMultiply,
          CheckbookCode: model.CheckbookCode,
          CustomerId: model.CustomerId,
          NsDocumentNo: model.NsDocumentNo,
          Description: model.Description,
          OriginatingTotalPaid: model.OriginatingTotalPaid,
          FunctionalTotalPaid: model.IsMultiply ? (model.OriginatingTotalPaid * model.ExchangeRate) : (model.OriginatingTotalPaid/model.ExchangeRate),
          DepositSettlementDetails: model.DepositSettlementDetails
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
        .put('DepositSettlement', {
          SettlementHeaderId: model.SettlementHeaderId,
          DocumentNo: model.DocumentNo,
          ReceiveTransactionId: model.ReceiveTransactionId,
          DepositNo: model.DepositNo,
          ApplyDocumentNo: model.ApplyDocumentNo,
          CheckbookDocumentNo: model.CheckbookDocumentNo,
          TransactionDate: model.TransactionDate,
          DocumentType: model.DocumentType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.ExchangeRate,
          IsMultiply: model.IsMultiply,
          CheckbookCode: model.CheckbookCode,
          CustomerId: model.CustomerId,
          NsDocumentNo: model.NsDocumentNo,
          Description: model.Description,
          OriginatingTotalPaid: model.OriginatingTotalPaid,
          FunctionalTotalPaid: model.IsMultiply ? (model.OriginatingTotalPaid * model.ExchangeRate) : (model.OriginatingTotalPaid/model.ExchangeRate),
          DepositSettlementDetails: model.DepositSettlementDetails
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
  async actPutTrxDelete({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('DeleteDepositSettlement', {
          SettlementHeaderId: model.SettlementHeaderId
        })
        .then(response => {
          commit("FETCH_RESULT_TRX_DELETE", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  },

  async actDelete({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('DepositSettlement', { data: { SettlementHeaderId: row.SettlementHeaderId } })
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
  async StatusString(value) {
    switch (value) {
      case 1:
        return ""
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }
  },

  async actPosting({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusDepositSettlement', {
          SettlementHeaderId: model.SettlementHeaderId,
          Status: util.docStatus('Posted'),
          StatusComment: model.Reason
        })
        .then(response => {
          commit("FETCH_RESULT_POSTING", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  },
  async actSubmit({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusDepositSettlement', {
          SettlementHeaderId: model.SettlementHeaderId,
          Status: util.docStatus('Submit'),
          StatusComment: model.Reason
        })
        .then(response => {
          commit("FETCH_RESULT_POSTING", response);
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
        .put('PutStatusDepositSettlement', {
          SettlementHeaderId: model.SettlementHeaderId,
          ActionDate: model.VoidDate,
          Status: util.docStatus('Void'),
          StatusComment: model.Reason,
         
        })
        .then(response => {
          commit("FETCH_RESULT_POSTING", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  },
  
  async actGetDataPrint({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get("GetDepositSettlementById?SettlementHeaderId=" + model.SettlementHeaderId)
      if (response.status == 200) {
        commit("FETCH_DATA_PRINT", response.data); 
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actGetUserApproval({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = "GetUserApprovalReceipt"
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA_USER_APPROVE", response.data.UserApproval);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actApprove({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusReceiptApproval', {
          SettlementHeaderId: model.SettlementHeaderId,
          ActionDocStatus: util.docStatus('approved'),
          Comments: model.Reason,
          PersonId: model.PersonId,
          CurrentIndex: model.CurrentIndex,
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
  async actApprovePost({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusReceiptApproval', {
          SettlementHeaderId: model.SettlementHeaderId,
          ActionDocStatus: util.docStatus('Posted'),
          Comments: model.Reason,
          PersonId: model.PersonId
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
  async actDisApprove({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusReceiptApproval', {
         
          SettlementHeaderId: model.SettlementHeaderId,
          ActionDocStatus: util.docStatus('disapproved'),
          Comments: model.Reason,
          PersonId: model.PersonId,
          CurrentIndex: model.CurrentIndex
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
  async actRevise({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusReceiptApproval', {
          SettlementHeaderId: model.SettlementHeaderId,
          ActionDocStatus: util.docStatus('New'),
          Comments: model.Reason,
          PersonId: model.PersonId,
          CurrentIndex: model.CurrentIndex
         
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
  FETCH_DATA_DETAIL: (state, value) => (state.dataDetail = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_POSTING: (state, value) => (state.resultPosting = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_RESULT_TRX_DELETE: (state, value) => (state.resultTrxDelete = value),
  FETCH_DATA_USER_APPROVE: (state, value) => (state.resultApprove = value),
  FETCH_DATA_PRINT: (state, value) => (state.resultDataPrint = value),
};
