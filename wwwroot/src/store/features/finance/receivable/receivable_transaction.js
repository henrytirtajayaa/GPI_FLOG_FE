import Axios from '../../../../plugins/axios';
import util from "../../../../helper/utils";

const configUrl = "GetProgressReceivable?"

export const state = () => ({
  TrxModule:2,
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  resultPosting: {},
  resultTrxDelete: {},
  resultDataPrint: [],
  listInfo: [],
  baseUrl: configUrl,
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
      width: 70
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
      width: 130
    },
    {
      label: "Org. Ext. Amount",
      key: "OriginatingExtendedAmount",
      width: 150,
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
        { key: util.docStatus('New'), value: 'NEW' },
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
        .post('ReceivableTransaction', {       
          DocumentType: model.DocumentType,
          DocumentNo: model.DocumentNo,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.RateAmount,
          IsMultiply: model.IsMultiply,
          CustomerId: model.CustomerId,
          PaymentTermCode: model.PaymentTermCode,
          CustomerAddressCode: model.AddressCode,
          SoDocumentNo: model.SoDocumentNo,
          NsDocumentNo: model.NsDocumentNo,
          MasterNo: model.MasterNo,
          AgreementNo: model.AgreementNo,
          Description: model.Description,
          SubtotalAmount: model.SubTotalAmount1,
          DiscountAmount: model.SubDiscAmount1,
          TaxAmount: model.SubTaxAmount1,
          BillToAddressCode: model.BillToAddressCode,
          ShipToAddressCode: model.ShipToAddressCode,
          RequestReceivableDetails: model.ReceivableDetails,
          RequestReceivableTaxes: model.ReceivableTaxes
        
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
        .put('ReceivableTransaction', {
          ReceiveTransactionId: model.ReceiveTransactionId,
          DocumentType: model.DocumentType,
          DocumentNo: model.DocumentNo,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.RateAmount,
          IsMultiply: model.IsMultiply,
          CustomerId: model.CustomerId,
          PaymentTermCode: model.PaymentTermCode,
          CustomerAddressCode: model.AddressCode,
          SoDocumentNo: model.SoDocumentNo,
          NsDocumentNo: model.NsDocumentNo,
          MasterNo: model.MasterNo,
          AgreementNo: model.AgreementNo,
          Description: model.Description,
          SubtotalAmount: model.SubTotalAmount1,
          DiscountAmount: model.SubDiscAmount1,
          TaxAmount: model.SubTaxAmount1,
          BillToAddressCode: model.BillToAddressCode,
          ShipToAddressCode: model.ShipToAddressCode,
          RequestReceivableDetails: model.ReceivableDetails,
          RequestReceivableTaxes: model.ReceivableTaxes
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
        .put('PutTrxDeleteReceivable', {
          ReceiveTransactionId: model.ReceiveTransactionId
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
        .put('PutStatusReceivable', {
          DocumentType: model.DocumentType,
          DocumentNo: model.DocumentNo,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          CurrencyCode: model.CurrencyCode,
          ExchangeRate: model.RateAmount,
          IsMultiply: model.IsMultiply,
          CustomerId: model.CustomerId,
          PaymentTermCode: model.PaymentTermCode,
          SoDocumentNo: model.SoDocumentNo,
          CustomerAddressCode: model.AddressCode,
          SoDocumentNo: model.SoDocumentNo,
          NsDocumentNo: model.NsDocumentNo,
          Description: model.Description,
          SubtotalAmount: model.SubTotalAmount1,
          DiscountAmount: model.SubDiscAmount1,
          TaxAmount: model.SubTaxAmount1,
          BillToAddressCode: model.BillToAddressCode,
          ShipToAddressCode: model.ShipToAddressCode,
          RequestReceivableDetails: model.ReceivableDetails,
          RequestReceivableTaxes: model.ReceivableTaxes,

          ReceiveTransactionId: model.ReceiveTransactionId,
          Status: util.docStatus('Posted'),
          Comments: model.Reason,
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
        .put('PutStatusReceivable', {
          ReceiveTransactionId: model.ReceiveTransactionId,
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
    console.log('[actGetDataPrint] ...' );  
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get("GetReceivableTransactionById?ReceiveTransactionId=" + model.ReceiveTransactionId + "&CompanyId=" + model.CompanyId)
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
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_POSTING: (state, value) => (state.resultPosting = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_RESULT_TRX_DELETE: (state, value) => (state.resultTrxDelete = value),
  FETCH_DATA_PRINT: (state, value) => (state.resultDataPrint = value),
};
