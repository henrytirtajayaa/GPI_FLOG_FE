import Axios from '../../../../plugins/axios';
import moment from 'moment'
import util from "../../../../helper/utils";

const configUrl = "GetProgressCheckbook?"
export const state = () => ({
  data: [],
  listInfo: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  resultApprove: {},
  baseUrl: configUrl,
  headers: [
    {
      key: "DocumentType",
      label: "Type",
      _classes: "text-center",
      width: 70,
      filter_select: true,
      filter_select_options: [
        { key: 'IN', value: "IN" },
        { key: 'OUT', value: "OUT" }
      ]
    },
    {
      key: "DocumentNo",
      label: "Doc. No",
      _classes: "text-center",
      width: 130
    },
    {
      key: "TransactionDate",
      label: "Doc. Date",
      width: 60,
      _classes: "text-center",
      filter_date: true
    },
    {
      key: "TransactionType",
      label: "Trx. Type",
      classes: "text-center",
      width: 140,
      filter_select: true,
      filter_select_options: [
        { key: 'NORMAL', value: "NORMAL" },
        { key: 'ADVANCE PAYMENT', value: "ADVANCE PAYMENT" },
        { key: 'ADVANCE RECEIPT', value: "ADVANCE RECEIPT" }
      ]
    },
    {
      key: "CheckbookCode",
      label: "Checkbook",
      width: 120
    },
    {
      key: "CurrencyCode",
      label: "Currency",
      _classes: "text-center",
      width: 100,
      filter: true
    },
    {
      key: "OriginatingTotalAmount",
      label: "Org. Amount",
      _classes: "text-right",
      filter: false,
      currency: true
    },
    {
      label: "Status",
      key: "Status",
      _classes: "text-center",
      width: "150px",
      filter_select: true,
      filter_select_options: [
        { key: 1, value: "NEW" },
        { key: 10, value: "PROCESS" },
        { key: 31, value: "APPROVE" },
        { key: 33, value: "DISAPPROVE" }
      ]
    }
  ]
});

export const actions = {
  async actGetProgress({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        let arrResult = [];
        for (var i = 0; i < response.data.Checkbooks.length; i++) {
            arrResult.push({
                CheckbookTransactionId: response.data.Checkbooks[i].CheckbookTransactionId,
                DocumentType: response.data.Checkbooks[i].DocumentType,
                DocumentNo: response.data.Checkbooks[i].DocumentNo,
                TransactionDate: response.data.Checkbooks[i].TransactionDate,
                TransactionType: response.data.Checkbooks[i].TransactionType,
                CurrencyCode: response.data.Checkbooks[i].CurrencyCode,
                ExchangeRate: response.data.Checkbooks[i].ExchangeRate,
                CheckbookCode: response.data.Checkbooks[i].CheckbookCode,
                IsVoid: (response.data.Checkbooks[i].IsVoid ? 'NO' : 'YES'),
                VoidDocumentNo: response.data.Checkbooks[i].VoidDocumentNo,
                PaidSubject: response.data.Checkbooks[i].PaidSubject,
                SubjectCode: response.data.Checkbooks[i].SubjectCode,
                Description: response.data.Checkbooks[i].Description,
                OriginatingTotalAmount: response.data.Checkbooks[i].OriginatingTotalAmount,
                FunctionalTotalAmount: response.data.Checkbooks[i].FunctionalTotalAmount,
                CreatedBy: response.data.Checkbooks[i].CreatedBy,
                CreatedDate: response.data.Checkbooks[i].CreatedDate,
                ModifiedBy: response.data.Checkbooks[i].ModifiedBy,
                ModifiedDate: response.data.Checkbooks[i].ModifiedDate,
                CreatedName: response.data.Checkbooks[i].CreatedName,
                VoidByName: response.data.Checkbooks[i].VoidByName,
                VoidBy: response.data.Checkbooks[i].VoidBy,
                VoidDate: response.data.Checkbooks[i].VoidDate,
                BankAccountCode: response.data.Checkbooks[i].BankAccountCode,
                Status: util.docStatusCaption(response.data.Checkbooks[i].Status),
                StatusComment: response.data.Checkbooks[i].StatusComment,
                ApprovalCode: response.data.Checkbooks[i].ApprovalCode
            });
        }
        commit("FETCH_DATA_PROGRESS", arrResult);
        commit("FETCH_DATA_INFO_PROGRESS", response.data.ListInfo);
      }
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
        .post('CheckbookTransaction', {
          DocumentType: model.DocumentType,
          DocumentNo: model.DocumentNo,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.ExchangeRate,
          CheckbookCode: model.CheckbookCode,
          IsVoid: model.IsVoid,
          VoidDocumentNo: model.VoidDocumentNo,
          PaidSubject: model.PaidSubject,
          SubjectCode: model.SubjectCode,
          Description: model.Description,
          OriginatingTotalAmount: model.OriginatingTotalAmount,
          FunctionalTotalAmount: model.FunctionalTotalAmount,
          Status: model.Status,
          RequestCheckbookDetails: model.RequestCheckbookDetails,
          IsMultiply : true
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
        .put('CheckbookTransaction', {
          CheckbookTransactionId: model.CheckbookTransactionId,
          DocumentType: model.DocumentType,
          DocumentNo: model.DocumentNo,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.ExchangeRate,
          CheckbookCode: model.CheckbookCode,
          IsVoid: model.IsVoid,
          VoidDocumentNo: model.VoidDocumentNo,
          PaidSubject: model.PaidSubject,
          SubjectCode: model.SubjectCode,
          Description: model.Description,
          OriginatingTotalAmount: model.OriginatingTotalAmount,
          FunctionalTotalAmount: model.FunctionalTotalAmount,
          Status: model.Status,
          RequestCheckbookDetails: model.RequestCheckbookDetails,
          IsMultiply : true
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
  async actPosting({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusCheckbookTransaction', {
          CheckbookTransactionId: model.CheckbookTransactionId,
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
        .put('PutStatusCheckbookTransaction', {
          CheckbookTransactionId: model.CheckbookTransactionId,
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
  async actSubmitApproval({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('CheckbookTransactionApproval', {
          CheckbookTransactionId: model.CheckbookTransactionId,
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
        url = "GetUserApproval"
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
        .put('PutStatusCheckbookApproval', {
          CheckbookTransactionId: model.CheckbookTransactionId,
          ActionDocStatus: util.docStatus('approved'),
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
  async actDisApprove({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusCheckbookApproval', {
          CheckbookTransactionId: model.CheckbookTransactionId,
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
  async actApprovePost({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusCheckbookApproval', {
          CheckbookTransactionId: model.CheckbookTransactionId,
          ActionDocStatus: util.docStatus('Posted'),
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
        .put('PutStatusCheckbookApproval', {
          CheckbookTransactionId: model.CheckbookTransactionId,
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
  async actDelete({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('DeleteCheckbookTransaction', { data: { CheckbookTransactionId: model.CheckbookTransactionId } })
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
};

export const mutations = {
  FETCH_DATA_PROGRESS: (state, value) => (state.data = value),
  FETCH_DATA_INFO_PROGRESS: (state, value) => (state.listInfo = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_DATA_USER_APPROVE: (state, value) => (state.resultApprove = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};
