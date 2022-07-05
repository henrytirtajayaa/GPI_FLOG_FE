import Axios from '../plugins/axios';

export default {
    async doLogin(username, password){
        return await new Axios({'Content-Type': 'application/json',})
        .get('login?email='+username+'&password='+password);
    },
  async doLoginCompany(userid, roleid, token, CompanyId) {
   
        return await new Axios({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })
          .get('CompanyLogin?userid=' + userid + '&roleid=' + roleid + '&companyid=' + CompanyId )
    },
  async doGetDetailToken(token, route) {
   
        return await new Axios({
            'Content-Type': 'application/json',
            'Authorization': token
        })
        .get('token-detail?route='+route)
  },
  async doGetDetailSession(PersonId, token) {
        return await new Axios({
            'Content-Type': 'application/json',
            'Authorization': token
        })
        .get('SessionState?personid='+PersonId)
    }
}
