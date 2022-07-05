import config from '~/static/config'
import { async } from 'q';

const cookieparser = process.server ? require('cookieparser') : undefined
const cookie = process.client ? require('js-cookie') : undefined
// importing server based cookie library

export async function nuxtServerInit ({ commit }, { req, res }) {

  // If we have any axios requests we need to add async/await
  // And since this works on server mode, we don't need to check is it server

  let token = null
  if (req.headers.cookie) {
    const parsed = cookieparser.parse(req.headers.cookie)
    try {
      token = parsed.authToken
    } catch (e) {
      console.log(e)
    }
  }
  // If we have token within cookies we get user data from api and we pass Autorization headers with token
  if (token !== null && token !== false) {
    await axios.get(config.API+'/token-detail', {
      headers: {
        'Authorization': token
      }
    }).then((response) => {
      // If  we get user data we set it to store
      commit('setUser', response.data.data)
      commit('setToken', token)
      commit('setHeaders', token)
    }).catch((error) => {
      // If we get error, we should logout user by removing data within cookies and store
      // Additionally you can create specific code error on backend to check if token is expired or invalid
      // and then check for status code and then remove data
      commit('setUser', null)
      commit('setToken', null)
      res.setHeader('Set-Cookie', [`authToken=false; expires=Thu, 01 Jan 1970 00:00:00 GMT`])
      // This is only way I found useful for removing cookies from node server
      console.warn(error)
    })
  }
}

export async function actSignIn(context, value) {
 
  let expiredTime = 365
  context.commit('setUser', value.userId)
  context.commit('setCompanySecurity', value.companySecurity)
  context.commit('setCompId', value.companyId)
  context.commit('setName', value.name)
  context.commit('setEmail', value.email)
  context.commit('setToken', 'Bearer ' + value.token)
  context.commit('setHeaders', 'Bearer ' + value.token)
  context.commit('setMenu', value.email)

  cookie.set('authToken', 'Bearer ' + value.token, { expires: expiredTime })
  cookie.set('authUser', value.userId, { expires: expiredTime })
  cookie.set('authCompId', value.companyId, { expires: expiredTime })
  cookie.set('authCompSec', value.companySecurity, { expires: expiredTime })
  cookie.set('authName', value.name, { expires: expiredTime })
  cookie.set('authEmail', value.email, { expires: expiredTime })
  cookie.set('authMenus', value.menus, { expires: expiredTime })
}

export async function actSignOut(context){
  cookie.remove('authToken')
  cookie.remove('authUser')
  cookie.remove('authCompId')
  cookie.remove('authCompSec')
  cookie.remove('authName')
  cookie.remove('authEmail')
  cookie.remove('authMenus')
}
