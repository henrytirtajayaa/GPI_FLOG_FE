import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetHistoryPayable?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  dataInvoices: [],
  listInvoicesInfo: [],
  listInfo: [],
  baseUrl: configUrl,
  baseUrlInvoice: "GetPendingPayable?",
  headers: [
    {
      label: 'Doc. Type',
      key: 'DocumentType',
      classes: 'text-left',
      width: 120,
      filter_select: true,
      filter_select_options: [
        { key: 'INVOICE', value: 'INVOICE' },
        { key: 'DEBIT NOTE', value: 'DEBIT NOTE' },
        { key: 'CREDIT NOTE', value: 'CREDIT NOTE' }
      ]
    },
    {
      label: 'Doc. No',
      key: 'DocumentNo',
      classes: 'text-left',
      width: 150,
      filter: true,
    },
    {
      label: 'Trx. Type',
      key: 'TransactionType',
      classes: 'text-center',
      width: 150,
      filter_select: true,
      filter_select_options: [
        { key: "DOMESTIC", value: "DOMESTIC" },
        { key: 'EXPORT', value: 'EXPORT' },
        { key: 'IMPORT', value: 'IMPORT' },
        { key: 'OTHER', value: 'OTHER' }
      ]
    },
    {
      label: 'Trx. Date',
      key: 'TransactionDate',
      _classes: 'text-center',
      width: 110,
      filter_date: true,
    },
    {
      label: 'Vendor Name',
      key: 'VendorName',
      _classes: 'text-left',
      sort: true,
      width: 170,
    }, {
      label: 'Curr.',
      key: 'CurrencyCode',
      _classes: 'text-center',
      width: 80,
    }, {
      label: 'Vendor Doc. No',
      key: 'VendorDocumentNo',
      classes: 'text-center',
      width: 100,
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
      label: 'NS Doc. No',
      key: 'NsDocumentNo',
      _classes: 'text-center',
      width: 150,
    }, {
      label: 'Org. Ext. Amount',
      key: 'SubtotalAmount',
      width: 200,
      filter: false,
      _classes: 'text-right p-3',
      currency:true,
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
        for (var i = 0; i < response.data.PayableTransaction.length; i++) {
          response.data.PayableTransaction[i]['Status'] = util.docStatusCaption(response.data.PayableTransaction[i].Status)
          response.data.PayableTransaction[i]['PayableTransactionDetails'] = response.data.PayableTransaction[i].PayableTransactionDetails,
          response.data.PayableTransaction[i]['PayableTransactionTaxes'] = response.data.PayableTransaction[i].PayableTransactionTaxes
        }        
      }
      commit("FETCH_DATA", response.data.PayableTransaction);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
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
        .put('HistoryPayable', {
          PayableTransactionId: model.PayableTransactionId,
          DocumentType: model.DocumentType,
          DocumentNo: model.DocumentNo,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.RateAmount,
          IsMultiply: model.IsMultiply,
          VendorId: model.VendorId,
          PaymentTermCode: model.PaymentTermCode,
          VendorDocumentNo: model.VendorDocumentNo,
          VendorAddressCode: model.AddressCode,
          VendorDocumentNo: model.VendorDocumentNo,
          NSDocumentNo: model.NSDocumentNo,
          Description: model.Description,
          SubtotalAmount: model.SubTotalAmount1,
          DiscountAmount: model.SubDiscAmount1,
          TaxAmount: model.SubTaxAmount1,
          BillToAddressCode: model.BillToAddressCode,
          ShipToAddressCode: model.ShipToAddressCode,
          RequestPayableDetails: model.PayableDetails,
          RequestPayableTaxes: model.PayableTaxes,
          ModifiedDate: model.ModifiedDate,
          ModifiedBy: model.ModifiedBy
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
        .put('PutStatusPayable', {
          PayableTransactionId: model.PayableTransactionId,
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
        .put('PutStatusPayable', {
          PayableTransactionId: model.PayableTransactionId,
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

  async actDelete({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('VendorGroup', { data: { PayableTranasctionId: row.PayableTranasctionId } })
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
  async actGetPendingPayable({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = baseUrlInvoice
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)

      commit("FETCH_DATA_INVOICE", response.data.PayableTransaction);
      commit("FETCH_DATA_INVOICE_INFO", response.data.ListInfo);     
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


  }
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_DATA_INVOICE: (state, value) => (state.dataInvoices = value),
  FETCH_DATA_INVOICE_INFO: (state, value) => (state.listInvoicesInfo = value),
};
