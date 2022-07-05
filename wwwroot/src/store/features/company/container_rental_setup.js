import Axios from '../../../plugins/axios';

const configUrl = "SetupContainerRental?"
export const state = () => ({
    data: [],
    resultUpdate: {},
    resultCreate: {},
    resultDelete: {},
    listInfo: [],
    baseUrl: configUrl
});

export const actions = {
    async actGet({ commit, rootState }, url) {
        try {
            if(url == null || url == undefined){
                url = configUrl
            }

            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .get(url)
            if(response.status == 200){
                for (var i = 0; i < response.data.SetupContainerRentals.length; i++) {
                    response.data.SetupContainerRentals[i]['TransactionType'] = (response.data.SetupContainerRentals[i].TransactionType);
                    response.data.SetupContainerRentals[i]['InActive'] = (response.data.SetupContainerRentals[i].InActive == true ? "Inactive " : "Active");
                }
                commit("FETCH_DATA", response.data.SetupContainerRentals);
                commit("FETCH_INFO", response.data.ListInfo);
            }
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
            .put('SetupContainerRental', {
                SetupContainerRentalId : model.SetupContainerRentalId,
                TransactionType : model.TransactionType,
                RequestDocNo : model.RequestDocNo,
                DeliveryDocNo : model.DeliveryDocNo,
                ClosingDocNo : model.ClosingDocNo,
                UomScheduleCode : model.UomScheduleCode,
                CustomerFreeUsageDays : model.CustomerFreeUsageDays,
                ShippingLineFreeUsageDays : model.ShippingLineFreeUsageDays,
                CntOwnerFreeUsageDays : model.CntOwnerFreeUsageDays,
                // InActive : model.InActive
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
    async actCreate({ commit, rootState }, model) {
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('SetupContainerRental', {
                TransactionType : model.TransactionType,
                RequestDocNo : model.RequestDocNo,
                DeliveryDocNo : model.DeliveryDocNo,
                ClosingDocNo : model.ClosingDocNo,
                UomScheduleCode : model.UomScheduleCode,
                CustomerFreeUsageDays : model.CustomerFreeUsageDays,
                ShippingLineFreeUsageDays : model.ShippingLineFreeUsageDays,
                CntOwnerFreeUsageDays : model.CntOwnerFreeUsageDays,
                // InActive : model.InActive
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
    async actDelete({ commit, rootState }, row) {
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
          .delete('SetupContainerRental', { data: { SetupContainerRentalId: row.SetupContainerRentalId } })
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
    FETCH_INFO: (state, value) => (state.listInfo = value),
    FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
    FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value)
};