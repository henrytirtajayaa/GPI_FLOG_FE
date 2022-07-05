export const setUser = (state, payload) => state.user = payload
export const setName = (state, payload) => state.name = payload
export const setEmail = (state, payload) => state.email = payload
export const setToken = (state, payload) => state.token = payload
export const setMenu = (state, payload) => state.menu = payload
export const setCompanyName = (state, payload) => state.companyName = payload
export const setCompanySecurity = (state, payload) => state.companySecurity = payload
export const setCompId = (state, payload) => state.companyId = payload
export const setListCompany = (state, payload) => state.listcompany = payload
export const setRoleAccess = (state, payload) => state.roleaccess = payload
export const setSessionId = (state, payload) => state.sessionid = payload

export const setHeaders = (state, payload) => {
  state.headers = {
    headers: {
      'Authorization': payload
    }
  }
}
