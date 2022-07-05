import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetHistoryReceivable?"

export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  dataInvoices: [],
  listInvoicesInfo: [],
  listInfo: [],
  baseUrl: configUrl,
  baseUrlInvoice:"GetPendingReceivable?",
  headers: [
    {
      label: "Doc. Type",
      key: "DocumentType",
      classes: "text-left",
      width: 120,
      filter_select: true,
      filter_select_options: [
        { key: "INVOICE", value: "INVOICE" },
        { key: "DEBIT NOTE", value: "DEBIT NOTE" },
        { key: "CREDIT NOTE", value: "CREDIT NOTE" }
      ]
    },
    {
      label: "Doc. No",
      key: "DocumentNo",
      classes: "text-left",
      width: 120,
      filter: true
    },
    {
      label: "Trx. Type",
      key: "TransactionType",
      classes: "text-center",
      width: 150,
      filter_select: true,
      filter_select_options: [
        { key: "DOMESTIC", value: "DOMESTIC" },
        { key: "EXPORT", value: "EXPORT" },
        { key: "IMPORT", value: "IMPORT" },
        { key: "OTHER", value: "OTHER" }
      ]
    },
    {
      label: "Trx. Date",
      key: "TransactionDate",
      _classes: "text-center",
      width: 110,
      filter_date: true
    },
    {
      label: "Customer Name",
      key: "CustomerName",
      _classes: "text-left",
      sort: true,
      width: 170
    },
    {
      label: "Curr.",
      key: "CurrencyCode",
      _classes: "text-center",
      width: 80
    },
    {
      label: "So Doc. No",
      key: "SoDocumentNo",
      classes: "text-center",
      width: 100
    },
    {
      label: 'Master No',
      key: 'MasterNo',
      _classes: 'text-center',
      width: 150,
      sort: true,
      filter: true,
    },
    {
      label: 'Agreement No',
      key: 'AgreementNo',
      _classes: 'text-center',
      width: 150,
      sort: true,
      filter: true,
    },
    {
      label: "Ns Doc. No",
      key: "NsDocumentNo",
      _classes: "text-center",
      width: 100
    },
    {
      label: "Org. Ext. Amount",
      key: "OriginatingExtendedAmount",
      width: 200,
      _classes: "text-right currency",
      filter: false,
      currency: true
    },
    {
      label: "Status",
      key: "Status",
      _classes: "text-center",
      width: "200px",
      width: 100,
      filter_select: true,
      filter_select_options: [
        { key: util.docStatus('Posted'), value: 'POSTED' },
        { key: util.docStatus('Void'), value: 'VOID' },
      ]
    }
  ]
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
        for (var i = 0; i < response.data.ReceiveTransaction.length; i++) {
          response.data.ReceiveTransaction[i]['Status'] = util.docStatusCaption(response.data.ReceiveTransaction[i].Status),
          response.data.ReceiveTransaction[i]['ReceiveTransactionDetails'] = response.data.ReceiveTransaction[i].ReceivableTransactionDetails,
          response.data.ReceiveTransaction[i]['ReceiveTransactionTaxes'] = response.data.ReceiveTransaction[i].ReceivableTransactionTaxes
        }
      }
      commit("FETCH_DATA", response.data.ReceiveTransaction);
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
  async actGetPendingReceivable({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = baseUrlInvoice
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)

      commit("FETCH_DATA_INVOICE", response.data.ReceivableTransaction);
      commit("FETCH_DATA_INVOICE_INFO", response.data.ListInfo);
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
  FETCH_DATA_INVOICE: (state, value) => (state.dataInvoices = value),
  FETCH_DATA_INVOICE_INFO: (state, value) => (state.listInfo = value),
};
