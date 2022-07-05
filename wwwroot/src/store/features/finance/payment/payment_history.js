import Axios from '../../../../plugins/axios';
const configUrl = "GetHistoryVendorPayment?"
import util from "../../../../helper/utils";
import moment from 'moment';

export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  dataComment: {},
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
      filter_date: true,

    },
    {
      label: 'Checkbook Code',
      key: 'CheckbookCode',
      _classes: 'text-center',
      width: 110,
      filter: true,

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
        { key: util.docStatus('Posted'), value: 'POSTED' },
        { key: util.docStatus('Void'), value: 'VOID' },
      ]
    }
  ],
});

export const actions = {
  async actGetData({ commit, rootState }, url) {
   
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
       
          for (var i = 0; i < response.data.PaymentHeader.length; i++) {
            response.data.PaymentHeader[i]['Status'] = util.docStatusCaption(response.data.PaymentHeader[i].Status)
          }
          commit("FETCH_DATA", response.data.PaymentHeader);
          commit("FETCH_DATA_INFO", response.data.ListInfo);
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
        .post('VendorGroup', {
          VendorGroupCode: model.VendorGroupCode,
          VendorGroupName: model.VendorGroupName,
          AddressCode: model.AddressCode,
          PaymentTermCode: model.PaymentTermCode,
          PayableAccountNo: model.PayableAccountNo,
          AccruedPayableAccountNo: model.AccruedPayableAccountNo,
          InActive: model.InActive
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
        .put('VendorGroup', {
          VendorGroupId: model.VendorGroupId,
          VendorGroupCode: model.VendorGroupCode,
          VendorGroupName: model.VendorGroupName,
          AddressCode: model.AddressCode,
          PaymentTermCode: model.PaymentTermCode,
          PayableAccountNo: model.PayableAccountNo,
          AccruedPayableAccountNo: model.AccruedPayableAccountNo,
          InActive: model.InActive
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
  async actGetApprovalComment({ commit, rootState }, url) {
   
    try {
      if (url == null || url == undefined) {
        url = "GetApprovalPaymnetComment"
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        for (var i = 0; i < response.data.ApprovalComments.length; i++) {
          response.data.ApprovalComments[i]['StatusColor'] = util.docStatusColor(response.data.ApprovalComments[i].Status),
            response.data.ApprovalComments[i]['Status'] = util.docStatusCaption(response.data.ApprovalComments[i].Status),
            response.data.ApprovalComments[i]['CommentDate'] = moment(response.data.ApprovalComments[i].CommentDate).format("YYYY-MM-DD HH:mm:ss")
        }
        commit("FETCH_DATA_COMMENT", response.data.ApprovalComments);
      }
    }
    catch (err) {
      console.log(err);
    }
  },


};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_DATA_COMMENT: (state, value) => (state.dataComment = value),
};
