import Axios from '../../../../plugins/axios';
import moment from 'moment'
import util from "../../../../helper/utils";

const configUrl = "GetHistoryCheckbook?"
export const state = () => ({
  data: [],
  listInfo: [],
  dataComment: [],
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
        { key: util.docStatus('Posted'), value: 'POSTED' },
        { key: util.docStatus('Void'), value: 'VOID' },
      ]
    }
  ]
});

export const actions = {

  async actGetHistory({ commit, rootState }, url) {
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
                Status: util.docStatusCaption(response.data.Checkbooks[i].Status),
                StatusComment: response.data.Checkbooks[i].StatusComment,
                ApprovalCode: response.data.Checkbooks[i].ApprovalCode
            });
        }
        commit("FETCH_DATA_HISTORY", arrResult);
        commit("FETCH_DATA_INFO_HISTORY", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actGetApprovalComment({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = "GetApprovalComment"
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        for (var i = 0; i < response.data.ApprovalComments.length; i++) {
          response.data.ApprovalComments[i]['StatusColor'] = util.docStatusColor(response.data.ApprovalComments[i].Status),
          response.data.ApprovalComments[i]['Status'] = util.docStatusCaption(response.data.ApprovalComments[i].Status)
          response.data.ApprovalComments[i]['CommentDate'] = response.data.ApprovalComments[i].CommentDate;
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
  FETCH_DATA_HISTORY: (state, value) => (state.data = value),
  FETCH_DATA_INFO_HISTORY: (state, value) => (state.listInfo = value),
  FETCH_DATA_COMMENT: (state, value) => (state.dataComment = value),
};
