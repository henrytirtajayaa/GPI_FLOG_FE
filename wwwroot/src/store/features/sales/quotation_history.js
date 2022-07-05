import Axios from '../../../plugins/axios';
import util from "../../../helper/utils";

const configUrl = "GetSalesQuotationHistory?"

export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  resultCancel: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Trx Type',
      key: 'TransactionType',
      _classes: 'text-left',
      width:130,
    },
    {
      label: 'Document No',
      key: 'DocumentNo',
      _classes: 'text-left',
      width:150,  
    },
    {
      label: 'Document Date',
      key: 'TransactionDate',
      _classes: 'text-center',
      filter_date: true,
      width:110,
    },
    {
      label: 'Customer',
      key: 'CustomerName',
      _classes: 'text-left',
    },
    {
      label: 'Sales Person',
      key: 'SalesPerson',
      _classes: 'text-left',
      width:150,
    },   
    {
      label: 'Shipping Line',
      key: 'ShippingLineName',
      _classes: 'text-left',
      width: 150,
    },
    {
      label: 'Total Container',
      key: 'TotalContainer',
      _classes: 'text-center',
      width: 80,
      filter: false,
    },
    {
      label: 'Status',
      key: 'Status',
      _classes: 'text-center',
      width: 100,
      filter_select: true,
      filter_select_options: [{ key: 44, value: 'Cancel' }, { key: 21, value: 'Submit' },{ key: 80, value: 'Closed' }]
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
        for (var i = 0; i < response.data.SalesQuotationHeader.length; i++) {
          response.data.SalesQuotationHeader[i]['Status'] = util.docStatusCaption(response.data.SalesQuotationHeader[i].Status)
        }
      }
      commit("FETCH_DATA", response.data.SalesQuotationHeader);
      commit("FETCH_DATA_INFO", response.data.ListInfo);
    }
    catch (err) {
      console.log(err);
    }
  },
  
  async actCreate({ commit, rootState }, model) {
    console.log(model);
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('PostSalesQuotation', {
          
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          DocumentNo: model.DocumentNo,
          CustomerCode: model.CustomerCode,
          CustomerId: model.CustomerId,
          CustomerName: model.CustomerName,
          CustomerAddressCode: model.AddressCode,
          SalesCode: model.SalesCode,
          SalesName: model.SalesName,
          ShipperId: model.ShipperId == "" ? "00000000-0000-0000-0000-000000000000" : model.ShipperId ,
          ShipperCode: model.ShipperCode,
          ShipperAddressCode: model.ShipperAddressCode,
          ShipperName: model.ShipperName,
          ConsigneeId: model.ConsigneeId == "" ? "00000000-0000-0000-0000-000000000000" : model.ConsigneeId,
          ConsigneeCode: model.ConsigneeCode,
          ConsigneeAddressCode: model.ConsigneeAddressCode,
          ConsigneeName: model.TransactionDate,
          IsDifferentNotifyPartner: model.IsDifferentNotifyPartner,
          NotifyPartnerId: model.NotifyPartnerId == "" ? "00000000-0000-0000-0000-000000000000" : model.NotifyPartnerId,
          NotifyPartyCode: model.NotifyPartyCode,
          NotifyPartyName: model.NotifyPartyName,
          NotifyPartnerAddressCode: model.NotifyPartnerAddressCode,

          ShippingLineId: model.ShippingLineId,
          ShippingLineName: model.ShippingLineName,
          ShippingLineOwner: model.ShippingLineOwner,
          ShippingLineType: model.ShippingLineType,
          ShippingLineShippingNo: model.ShippingLineShippingNo,
          ShippingLineDelivery: model.ShippingLineDelivery == "" ? null : model.ShippingLineDelivery,
          ShippingLineArrival: model.ShippingLineArrival == "" ? null : model.ShippingLineArrival,
          FeederLineId: model.FeederLineId == "" ? "00000000-0000-0000-0000-000000000000" : model.FeederLineId,
          FeederLineName: model.FeederLineName,
          FeederLineOwner: model.FeederLineOwner,
          FeederLineType: model.FeederLineType,
          FeederLineShippingNo: model.FeederLineShippingNo,
          FeederLineDelivery: model.FeederLineDelivery == "" ? null : model.FeederLineDelivery,
          FeederLineArrival: model.FeederLineDelivery == "" ? null : model.FeederLineDelivery,
          TermOfShipment: model.TermOfShipment,
          FinalDestination: model.FinalDestination,

          PortOfLoading: model.PortOfLoading,
          PortOfDischarge: model.PortOfDischarge,
          Commodity: model.Commodity,
          CargoGrossWeight: model.CargoGrossWeight,
          CargoNetWeight: model.CargoNetWeight,
          CargoDescription: model.CargoDescription,
          Remark: model.Remark,
          Status: 1,
          StatusComment: model.StatusComment,
          SalesQuotationDetails: model.SalesQuotationDetail
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
        .put('PutSalesQuotation', {
          SalesQuotationId: model.SalesQuotationId,
          TransactionDate: model.TransactionDate,
          TransactionType: model.TransactionType,
          DocumentNo: model.DocumentNo,
          CustomerCode: model.CustomerCode,
          CustomerId: model.CustomerId,
          CustomerName: model.CustomerName,
          CustomerAddressCode: model.AddressCode,
          SalesCode: model.SalesCode,
          SalesName: model.SalesName,
          ShipperId: model.ShipperId == "" ? "00000000-0000-0000-0000-000000000000" : model.ShipperId,
          ShipperCode: model.ShipperCode,
          ShipperAddressCode: model.ShipperAddressCode,
          ShipperName: model.ShipperName,
          ConsigneeId: model.ConsigneeId == "" ? "00000000-0000-0000-0000-000000000000" : model.ConsigneeId,
          ConsigneeCode: model.ConsigneeCode,
          ConsigneeAddressCode: model.ConsigneeAddressCode,
          ConsigneeName: model.TransactionDate,
          IsDifferentNotifyPartner: model.IsDifferentNotifyPartner,
          NotifyPartnerId: model.NotifyPartnerId == "" ? "00000000-0000-0000-0000-000000000000" : model.NotifyPartnerId,
          NotifyPartyCode: model.NotifyPartyCode,
          NotifyPartyName: model.NotifyPartyName,
          NotifyPartnerAddressCode: model.NotifyPartnerAddressCode,

          ShippingLineId: model.ShippingLineId,
          ShippingLineName: model.ShippingLineName,
          ShippingLineOwner: model.ShippingLineOwner,
          ShippingLineType: model.ShippingLineType,
          ShippingLineShippingNo: model.ShippingLineShippingNo,
          ShippingLineDelivery: model.ShippingLineDelivery == "" ? null : model.ShippingLineDelivery,
          ShippingLineArrival: model.ShippingLineArrival == "" ? null : model.ShippingLineArrival,
          FeederLineId: model.FeederLineId == "" ? "00000000-0000-0000-0000-000000000000" : model.FeederLineId,
          FeederLineName: model.FeederLineName,
          FeederLineOwner: model.FeederLineOwner,
          FeederLineType: model.FeederLineType,
          FeederLineShippingNo: model.FeederLineShippingNo,
          FeederLineDelivery: model.FeederLineDelivery == "" ? null : model.FeederLineDelivery,
          FeederLineArrival: model.FeederLineDelivery == "" ? null : model.FeederLineDelivery,
          TermOfShipment: model.TermOfShipment,
          FinalDestination: model.FinalDestination,

          PortOfLoading: model.PortOfLoading,
          PortOfDischarge: model.PortOfDischarge,
          Commodity: model.Commodity,
          CargoGrossWeight: model.CargoGrossWeight,
          CargoNetWeight: model.CargoNetWeight,
          CargoDescription: model.CargoDescription,
          Remark: model.Remark,
          Status: 1,
          StatusComment: model.StatusComment,
          SalesQuotationDetails: model.SalesQuotationDetail
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
  async actCancel({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('PutCancelSalesQuotation', {
          SalesQuotationId: model.SalesQuotationId,
          Status: util.docStatus('Cancel'),
          StatusComment: model.StatusComment
        })
        .then(response => {
          commit("FETCH_RESULT_CANCEL", response);
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
        .delete('DeleteSalesQuotation', { data: { SalesQuotationId: model.SalesQuotationId } })
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
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_RESULT_CANCEL: (state, value) => (state.resultCancel = value)
 
};
