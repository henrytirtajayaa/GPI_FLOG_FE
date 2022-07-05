import Axios from '../../../plugins/axios';

const configUrl = "Container?"
export const state = () => ({
    data: [],
    resultCreate: {},
    resultUpdate: {},
    resultDelete: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            text: 'Container Code',
            value: 'ContainerCode',
            align: 'text-sm-center',
            width:100,
            sort: true,
            filter: true,
        },
        {
            text: 'Name',
            value: 'ContainerName',
            align: 'text-sm-left',
            sort: true,
            filter: true,
        },
        {
            text: 'Status',
            value: 'Inactive',
            align: 'text-sm-center',
            width:100,
            sort: true,
            filter: false,
        },
    ],
});

export const actions = {
  async actGetContainer({ commit, rootState }, url) {
    var arrContainers = [];
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

            for (var i = 0; i < response.data.Containers.length; i++) {
              arrContainers.push({
                ContainerId: response.data.Containers[i].ContainerId,
                ContainerCode: response.data.Containers[i].ContainerCode,
                ContainerName: response.data.Containers[i].ContainerName,
                ContainerSize: response.data.Containers[i].ContainerSize,
                ContainerType: response.data.Containers[i].ContainerType,
                ContainerTeus: response.data.Containers[i].ContainerTeus,
                Inactive: response.data.Containers[i].Inactive == true ? "Inactive " : "Active",
              });
            }
                commit("FETCH_DATA_CONTAINER", arrContainers);
                commit("FETCH_DATA_INFO", response.data.ListInfo);
            }
        }
        catch (err) {
            console.log(err);
        }
    },

    async actCreateContainer({ commit, rootState }, model) {
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('Container',{
                ContainerCode: model.ContainerCode,
                ContainerName: model.ContainerName,
                ContainerSize : model.ContainerSize,
                ContainerType: model.ContainerType,
                ContainerTeus: model.ContainerTeus,
                Inactive: model.InActive
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

    async actUpdateContainer({ commit, rootState }, model){
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .put('Container', {
                ContainerId: model.ContainerId,
                ContainerCode: model.ContainerCode,
                ContainerName: model.ContainerName,
                ContainerSize : model.ContainerSize,
                ContainerType: model.ContainerType,
                ContainerTeus: model.ContainerTeus,
                Inactive: model.InActive
            })
            .then(response => {
                commit("FETCH_RESULT_UPDATE", response);
            })
            .catch(e => {
                this.errors.push(e);
            })
        }
        catch (err){
            console.log(err);
        }
    },

    async actDeleteContainer({ commit, rootState }, row){
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
              .delete('Container', { data: { ContainerId: row.ContainerId } })
            .then(response => {
                commit("FETCH_RESULT_DELETE", response);
            })
            .catch (e => {
                this.errors.push(e);
                alert(this.errors);
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
        .delete('Container', { data: { CompanySetupId: row.CompanySetupeId } })
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
    FETCH_DATA_CONTAINER: (state, value) => (state.data = value),
    FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
    FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
    FETCH_RESULT_DELETE: (state,value) => (state.resultDelete = value)
};
