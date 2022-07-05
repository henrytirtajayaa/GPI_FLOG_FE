import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "GetProgressContainerRequestConfirm?"

export const state = () => ({
  data: [],
  dataDetail: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  resultPosting: {},
  resultPutDelete: {},
  resultApprove: {},
  resultDataPrint: [],
  resultRemaining: [],
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
        label: 'Transaction Type',
        key: 'TransactionType',
        classes: 'text-left',
        width: 150,
        sort: true,
        filter: true,
    },
    {
        label: 'Delivery Order No',
        key: 'DeliveryOrderNo',
        classes: 'text-left',
        width: 150,
        sort: true,
        filter: true,
    },
    {
      label: 'Document Date',
      key: 'DocumentDate',
      _classes: 'text-center',
      width: 110,
      filter_date: true,

    },
    {
      label: 'Sales Person',
      key: 'SalesCode',
      _classes: 'text-center',
      width: 110,
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
      label: 'Container Owner Name',
      key: 'VendorName',
      classes: 'text-left',
      width: 150,
      sort: true,
      filter: true,
    },
    {
        label: 'Request Document No',
        key: 'DocumentNo',
        classes: 'text-left',
        width: 150,
        sort: true,
        filter: true,
      },
    {
      label: 'Status',
      key: 'Status',
      _classes: 'text-center',
      width: '200px',
      width: 100,
      filter_select: true,
      filter: false,
      // filter_select_options: [
      //   { key: 1, value: 'NEW' },
      //   { key: 200, value: 'CONFIRM' },
      //   { key: 408, value: 'EXPIRE' },
      //   { key: 44, value: 'CANCEL' },
      //   { key: 210, value: 'COMPLETE'}
      // ]
    },
    {
      label: 'Info',
      key: 'CheckExpired',
      _classes: 'font-weight-bold text-center text-red',
      width: 70,
      sort: true,
      filter: false,
      filter_select: true,
      // filter_select_options: [
      //   { key: "", value: "" },
      //   { key: "EXPIRED", value: "EXPIRED" }
      // ]
    },
  ],
});

export const actions = {
  async actGetData({ commit, rootState }, url) {
    //GET TODAY DATE
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    ////////////////////////////////////////////////

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
        for (var i = 0; i < response.data.ContainerRequestConfirm.length; i++) {
          response.data.ContainerRequestConfirm[i]['Status'] = util.docStatusCaption(response.data.ContainerRequestConfirm[i].Status)
          response.data.ContainerRequestConfirm[i]['CheckExpired'] = (response.data.ContainerRequestConfirm[i].ExpiredDate < today ? "EXPIRED" : "");
        }

        commit("FETCH_DATA", response.data.ContainerRequestConfirm);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }else{
        commit("FETCH_DATA", []);
      }
    }
    catch (err) {
      commit("FETCH_DATA", []);
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
        for (var i = 0; i < response.data.ContainerRentalRequestDetail.length; i++) {
          arrData.push({
            ContainerRentalRequestDetailId: response.data.ContainerRentalRequestDetail[i].ContainerRentalRequestDetailId,
            ContainerRentalRequestHeaderId: response.data.ContainerRentalRequestDetail[i].ContainerRentalRequestHeaderId,
            ContainerCode: response.data.ContainerRentalRequestDetail[i].ContainerCode,
            ContainerName: response.data.ContainerRentalRequestDetail[i].ContainerName,
            UomCode: response.data.ContainerRentalRequestDetail[i].UomCode,
            Remarks: response.data.ContainerRentalRequestDetail[i].Remarks,
            Quantity: response.data.ContainerRentalRequestDetail[i].Quantity,
            QuantityToConfirm: response.data.ContainerRentalRequestDetail[i].QuantityToConfirm,
            QuantityRemaining: response.data.ContainerRentalRequestDetail[i].QuantityRemaining
          });
        }
        commit("FETCH_DATA_DETAIL", arrData);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }else{
        commit("FETCH_DATA_DETAIL", []);
      }
    }
    catch (err) {
      commit("FETCH_DATA_DETAIL", []);
      console.log(err);
    }
  },
 
  async actGetRemaining({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = "GetQuantityRemaining?"
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        for (var i = 0; i < response.data.ContainerRentalRequest.length; i++) {
          response.data.ContainerRentalRequest[i]['Status'] = util.docStatusCaption(response.data.ContainerRentalRequest[i].Status)
        }
        commit("FETCH_DATA_REMAINING", response.data.ContainerRentalRequest);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }else{
        commit("FETCH_DATA_REMAINING", []);
      }
    }
    catch (err) {
      commit("FETCH_DATA_REMAINING", []);
      console.log(err);
    }
  },

  async actCreate({ commit, rootState }, model) {
    
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('ContainerRequestConfirm', {
            ContainerRentalRequestHeaderId: model.ContainerRentalRequestHeaderId,
            DocumentDate: model.DocumentDate,
            DeliveryOrderNo: model.DeliveryOrderNo,
            IssueDate: model.IssueDate,
            ExpiredDate: model.ExpiredDate,
            ContainerRequestConfirmDetails: model.ContainerRequestConfirmDetails
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
        .put('ContainerRequestConfirm', {
          ContainerRequestConfirmHeaderId: model.ContainerRequestConfirmHeaderId,
          ContainerRentalRequestHeaderId: model.ContainerRentalRequestHeaderId,
          DocumentDate: model.DocumentDate,
          DeliveryOrderNo: model.DeliveryOrderNo,
          IssueDate: model.IssueDate,
          ExpiredDate: model.ExpiredDate,
          ContainerRequestConfirmDetails: model.ContainerRequestConfirmDetails
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
  async actPutDelete({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutDeleteContainerRequestConfirm', {
            ContainerRequestConfirmHeaderId: model.ContainerRequestConfirmHeaderId
        })
        .then(response => {
          commit("FETCH_RESULT_PUT_DELETE", response);
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
        .put('PutStatusContainerRequestConfirm', {
          ContainerRequestConfirmHeaderId: model.ContainerRequestConfirmHeaderId,
          Status: util.docStatus('Confirm')
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

  async actCancelStatus({ commit, rootState }, model) {
   
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusContainerRequestConfirm', {
          ContainerRequestConfirmHeaderId: model.ContainerRequestConfirmHeaderId,
          Status: util.docStatus('Cancel')
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

  async actExtend({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutStatusContainerRequestConfirm', {
          ContainerRequestConfirmHeaderId: model.ContainerRequestConfirmHeaderId,
          ExpiredDate: model.ExpiredDate,
          Status: util.docStatus('Confirm'),
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

  async actCloseRequest({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutCloseRequestStatus', {
          ContainerRentalRequestHeaderId: model.ContainerRentalRequestHeaderId,
          Status: util.docStatus('Complete'),
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
      .get("GetContainerRentalRequestById?ReceiptHeaderId=" + model.ReceiptHeaderId + "&CompanyId=" + model.CompanyId)
      if (response.status == 200) {
        commit("FETCH_DATA_PRINT", response.data); 
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  // async actGetDataPrint({ commit, rootState }, model) {
  //   try {
  //     var response = await new Axios({
  //       'Content-Type': 'application/json',
  //       'Authorization': rootState.token
  //     })
  //       .post('ReceiptTransactionApproval', {
  //         ReceiptHeaderId: model.ReceiptHeaderId,
  //         CheckbookCode: model.CheckbookCode
  //       })
  //       .then(response => {
  //         commit("FETCH_RESULT_CREATE", response);
  //       })
  //       .catch(e => {
  //         this.errors.push(e);
  //       })
  //   }
  //   catch (err) {
  //     console.log(err);
  //   }
  // },

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
          ReceiptHeaderId: model.ReceiptHeaderId,
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
          ReceiptHeaderId: model.ReceiptHeaderId,
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
          ReceiptHeaderId: model.ReceiptHeaderId,
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
          ReceiptHeaderId: model.ReceiptHeaderId,
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
  FETCH_RESULT_PUT_DELETE: (state, value) => (state.resultPutDelete = value),
  FETCH_DATA_USER_APPROVE: (state, value) => (state.resultApprove = value),
  FETCH_DATA_PRINT: (state, value) => (state.resultDataPrint = value),
  FETCH_DATA_REMAINING: (state, value) => (state.resultRemaining = value),
};
