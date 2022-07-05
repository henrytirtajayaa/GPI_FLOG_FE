import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetProgressVendorPayment?"

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
      filter: true,
      filter_date: true,
    },
    {
      label: 'Checkbook Code',
      key: 'CheckbookCode',
      _classes: 'text-center',
      width: 110,

    },
    {
      label: 'Vendor Name',
      key: 'VendorName',
      classes: 'text-left',
      sort: true,
      width: 170,
      filter: true,
    },
    {
      label: 'Currency Code',
      key: 'CurrencyCode',
      classes: 'text-left',
      width: 150,
      sort: true,
      filter: true,
    },
    {
      label: 'Org.Paid Amount',
      key: 'OriginatingTotalPaid',
      width: 250,
      _classes: 'text-right currency',
      sort: true,
      filter: false,
      currency: true
    },
    {
      label: 'Applied Paid Amount',
      key: 'AppliedTotalPaid',
      width: 250,
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
        { key: 10, value: 'PROCESS' },
        { key: 31, value: 'APPROVED' },
        { key: 33, value: 'DISAPPROVED' }
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
        for (var i = 0; i < response.data.PaymentHeader.length; i++) {
          response.data.PaymentHeader[i]['Status'] = util.docStatusCaption(response.data.PaymentHeader[i].Status)
        }
      }
      commit("FETCH_DATA", response.data.PaymentHeader);
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
        for (var i = 0; i < response.data.PaymentDetail.length; i++) {
          arrData.push({
            PaymentHeaderId: response.data.PaymentDetail[i].PaymentHeaderId,
            PayableTransactionId: response.data.PaymentDetail[i].PayableTransactionId,
            OriginatingBalance: response.data.PaymentDetail[i].OriginatingBalance,
            OrgPaidAmount: response.data.PaymentDetail[i].OriginatingPaid,
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
     
        .post('PostVendorPayment', {
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.ExchangeRate,
          IsMultiply: model.IsMultiply,
          CheckbookCode: model.CheckbookCode,
          VendorId: model.VendorId,
          NsDocumentNo: model.NsDocumentNo,
          Description: model.Description,
          OriginatingTotalPaid: model.OriginatingTotalPaid,
          FunctionalTotalPaid: model.IsMultiply ? (model.OriginatingTotalPaid * model.ExchangeRate) : (model.OriginatingTotalPaid/model.ExchangeRate),
          ApPaymentDetails: model.PaymentDetails        
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
        .put('PutVendorPayment', {
          PaymentHeaderId: model.PaymentHeaderId,
          DocumentNo: model.DocumentNo,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.ExchangeRate,
          IsMultiply: model.IsMultiply,
          CheckbookCode: model.CheckbookCode,
          VendorId: model.VendorId,
          NsDocumentNo: model.NsDocumentNo,
          Description: model.Description,
          OriginatingTotalPaid: model.OriginatingTotalPaid,
          FunctionalTotalPaid: model.IsMultiply ? (model.OriginatingTotalPaid * model.ExchangeRate) : (model.OriginatingTotalPaid/model.ExchangeRate),
          ApPaymentDetails: model.PaymentDetails
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
        .put('DeleteVendorPayment', {
          PaymentHeaderId: model.PaymentHeaderId
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
        .delete('VendorGroup', { data: { VendorGroupId: row.VendorGroupId } })
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
        .put('PutStatusPaymentApproval', {
          PaymentHeaderId: model.PaymentHeaderId,
          ActionDocStatus: util.docStatus('Posted'),
          Comments: model.Reason,
          PersonId: model.PersonId
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
        .put('PutStatusPaymentApproval', {
          PaymentHeaderId: model.PaymentHeaderId,
          ActionDate: model.VoidDate,
          ActionDocStatus: util.docStatus('void'),
          Comments: model.Reason,
          PersonId: model.PersonId
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
  async actSubmitApproval({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('PaymentTransactionApproval', {
          PaymentHeaderId: model.PaymentHeaderId,
          CheckbookCode: model.CheckbookCode
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
  async actGetUserApproval({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = "GetUserApprovalPayment"
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
        .put('PutStatusPaymentApproval', {
          PaymentHeaderId: model.PaymentHeaderId,
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
        .put('PutStatusPaymentApproval', {
          PaymentHeaderId: model.PaymentHeaderId,
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
        .put('PutStatusPaymentApproval', {
         
          PaymentHeaderId: model.PaymentHeaderId,
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
        .put('PutStatusPaymentApproval', {
          PaymentHeaderId: model.PaymentHeaderId,
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
  async actGetDataPrint({ commit, rootState }, model) {
  
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get("GetVendorPaymentById?PaymentHeaderId=" + model.PaymentHeaderId + "&CompanyId=" + model.CompanyId)
      if (response.status == 200) {
        commit("FETCH_DATA_PRINT", response.data);  
      }
    }
    catch (err) {
      console.log(err);
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
