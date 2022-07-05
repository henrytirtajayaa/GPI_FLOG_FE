import Axios from '../../../plugins/axios';

const configUrl = "Checkbook?"
export const state = () => ({
    data: [],
    resultDelete: {},
    resultUpdate: {},
    resultCreate: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            label: 'Checkbook Code',
            key: 'CheckbookCode',
            align: 'text-left',
            width: 150,
            sort: true,
            filter: true,
        },
        {
            label: 'Checkbook Name',
            key: 'CheckbookName',
            sort: true,
            filter: true,
        },
        {
            label: 'Bank Account No.',
            key: 'BankAccountCode',
            sort: true,
            filter: true,
        },
        {
            label: 'Currency Code',
            key: 'CurrencyCode',
            width: 150,
            sort: true,
            filter: true,
        },
        {
            label: 'Bank Code',
            key: 'BankCode',
            width: 150,
            sort: true,
            filter: true,
        }
    ],
});

export const actions = {
    async actGetCheckbook({ commit, rootState }, url) {
        try {
            if(url == null || url == undefined){
                url = configUrl
            }

            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .get(url)
            if(response.status == 200) {
                commit("FETCH_DATA", response.data.Checkbooks);
                commit("FETCH_DATA_INFO", response.data.ListInfo);
            }
        }
        catch (err) {
            console.log(err);
        }
    },

    async actCreateCheckbook({ commit, rootState }, model) {
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('Checkbook', {
                CheckbookId : model.CheckbookId,
                CheckbookCode : model.CheckbookCode,
                CheckbookName : model.CheckbookName,
                BankAccountCode : model.BankAccountCode,
                CurrencyCode : model.CurrencyCode,
                BankCode : model.BankCode,
                BankName : model.BankName,
                CheckbookAccountNo : model.CheckbookAccountNo,
                CheckbookInDocNo : model.CheckbookInDocNo,
                CheckbookOutDocNo : model.CheckbookOutDocNo,
                ReceiptDocNo : model.ReceiptDocNo,
                PaymentDocNo : model.PaymentDocNo,
                ReconcileDocNo : model.ReconcileDocNo,
                HasCheckoutApproval : model.HasCheckoutApproval,
                IsCash : model.IsCash,
                ApprovalCode:model.ApprovalCode,
                InActive : model.InActive,
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

    async actUpdateCheckbook({ commit, rootState }, model){
        try {
            console.log(model);
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .put('Checkbook', {
                CheckbookId : model.CheckbookId,
                CheckbookCode : model.CheckbookCode,
                CheckbookName : model.CheckbookName,
                BankAccountCode : model.BankAccountCode,
                CurrencyCode : model.CurrencyCode,
                BankCode : model.BankCode,
                BankName : model.BankName,
                CheckbookAccountNo : model.CheckbookAccountNo,
                CheckbookInDocNo : model.CheckbookInDocNo,
                CheckbookOutDocNo : model.CheckbookOutDocNo,
                ReceiptDocNo : model.ReceiptDocNo,
                PaymentDocNo : model.PaymentDocNo,
                ReconcileDocNo : model.ReconcileDocNo,
                HasCheckoutApproval : model.HasCheckoutApproval,
                IsCash : model.IsCash,
                ApprovalCode:model.ApprovalCode,
                InActive : model.InActive,
            })
            .then(response => {
                commit("FETCH_RESULT_UPDATE", response);
            })
            .catch(e => {
                this.errors.push(e);
            })
        }
        catch (err) {
            console.log(err);
        }
    },

    async actDeleteCheckbook({ commit, rootState }, row){
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .delete('Checkbook', { data: { CheckbookId: row.CheckbookId } })
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
    }
};

export const mutations = {
    FETCH_DATA: (state, value) => (state.data = value),
    FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
    FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
    FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};