import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "GetProgressContainerRentalRequest?"

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
      label: 'Document No',
      key: 'DocumentNo',
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
      label: 'Status',
      key: 'Status',
      _classes: 'text-center',
      width: '200px',
      width: 100,
      filter_select: true,
      filter_select_options: [
        { key: 20, value: 'OPEN' },
        { key: 21, value: 'SUBMIT' },
        { key: 44, value: 'CANCEL' },
        { key: 210, value: 'COMPLETE'}
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
        for (var i = 0; i < response.data.ContainerRentalRequest.length; i++) {
          response.data.ContainerRentalRequest[i]['Status'] = util.docStatusCaption(response.data.ContainerRentalRequest[i].Status)
        }
      }
      commit("FETCH_DATA", response.data.ContainerRentalRequest);
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
        for (var i = 0; i < response.data.ContainerRentalRequestDetail.length; i++) {
          arrData.push({
            ContainerRentalRequestDetailId: response.data.ContainerRentalRequestDetail[i].ContainerRentalRequestDetailId,
            ContainerRentalRequestHeaderId: response.data.ContainerRentalRequestDetail[i].ContainerRentalRequestHeaderId,
            ContainerCode: response.data.ContainerRentalRequestDetail[i].ContainerCode,
            ContainerName: response.data.ContainerRentalRequestDetail[i].ContainerName,
            UomCode: response.data.ContainerRentalRequestDetail[i].UomCode,
            Remarks: response.data.ContainerRentalRequestDetail[i].Remarks,
            Quantity: response.data.ContainerRentalRequestDetail[i].Quantity
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
        .post('ContainerRentalRequest', {
            TransactionType: model.TransactionType,
            DocumentNo: model.DocumentNo,
            DocumentDate: model.DocumentDate,
            CustomerId: model.CustomerId,
            CustomerCode: model.CustomerCode,
            CustomerName: model.CustomerName,
            AddressCode: model.AddressCode,
            SalesCode: model.SalesCode,
            VendorId: model.VendorId,
            VendorName: model.VendorName,
            BillToAddressCode: model.BillToAddressCode,
            ShipToAddressCode: model.ShipToAddressCode,
            ContainerRentalRequestDetails: model.ContainerRentalRequestDetails
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
        .put('ContainerRentalRequest', {
            ContainerRentalRequestHeaderId: model.ContainerRentalRequestHeaderId,
            TransactionType: model.TransactionType,
            DocumentDate: model.DocumentDate,
            DocumentNo: model.DocumentNo,
            CustomerId: model.CustomerId,
            CustomerCode: model.CustomerCode,
            CustomerName: model.CustomerName,
            AddressCode: model.AddressCode,
            SalesCode: model.SalesCode,
            VendorId: model.VendorId,
            VendorName: model.VendorName,
            BillToAddressCode: model.BillToAddressCode,
            ShipToAddressCode: model.ShipToAddressCode,
            ContainerRentalRequestDetails: model.ContainerRentalRequestDetails
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
        .put('PutDeleteContainerRentalRequest', {
            ContainerRentalRequestHeaderId: model.ContainerRentalRequestHeaderId
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
        .put('PutStatusContainerRentalRequest', {
          ContainerRentalRequestHeaderId: model.ContainerRentalRequestHeaderId,
          Status: util.docStatus('Submit')
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
        .put('PutStatusContainerRentalRequest', {
          ContainerRentalRequestHeaderId: model.ContainerRentalRequestHeaderId,
          CanceledDate: model.CanceledDate,
          Status: util.docStatus('Cancel'),
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
};
