import services from '../services/loginServices';
import menu from '@/api/menu';

const cookieparser = process.server ? require('cookieparser') : undefined
const cookie = process.client ? require('js-cookie') : undefined
export default async function ({ app, redirect, req }) {
  let token = null
  let userName = null
  if (process.server) {
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        token = parsed.authToken
      } catch (e) {
        console.log(e)
      }
    }
  } else if (process.client) {
    token = cookie.get('authToken')
  }

  let routeName = app.context.route.name;

  if (token && token !== false && routeName != '' && routeName != undefined && routeName != null) {

    let routePath = app.context.route.path;
    //console.log("AUTH ... route path : " + app.context.route.path);

    if (!routePath.includes('nofpage')) {
      if (routeName == 'login')
        routePath = '/dashboard';

      var res = await services.doGetDetailToken(token, routePath);

      //when token still active
      if (res.status == 200) {
        app.store.commit('setToken', token)
        app.store.commit('setHeaders', token)
        //set detail user
        if (res.data.DetailUser != undefined || res.data.DetailUser != null) {
          app.store.commit('setUser', res.data.DetailUser.UserId)
          app.store.commit('setName', res.data.DetailUser.UserName)
          app.store.commit('setEmail', res.data.DetailUser.EmailAddress)
          app.store.commit('setCompId', res.data.Company.Id)
          app.store.commit('setListCompany', res.data.ListRole)
          app.store.commit('setRoleAccess', res.data.RoleAccess)
          app.store.commit('setCompanySecurity', res.data.CompanySecurityId)
          app.store.commit('setSessionId', res.data.SessionId)
        }
        else {
          if (cookie.get('authUser')) {
            app.store.commit('setUser', cookie.get('authUser'))
          }
          if (cookie.get('authName')) {
            app.store.commit('setName', cookie.get('authName'))
          }
          if (cookie.get('authEmail')) {
            app.store.commit('setEmail', cookie.get('authEmail'))
          }
        }

        //set company name
        if (res.data.Company != undefined || res.data.Company != null) {
          app.store.commit('setCompanyName', res.data.Company.Name)
          app.store.commit('setCompId', res.data.Company.Id)
        } else {
          if (cookie.get('authCompId')) {
            app.store.commit('setCompId', cookie.get('authCompId'))
          }
        }

        //set menus
        if (res.data.Menus != undefined) {
          var objmenu = res.data.Menus
          objmenu.unshift({ Header: 'Menu', Items: [] });
          app.store.commit('setMenu', res.data.Menus)
        } else {
          app.store.commit('setMenu', menu)
        }

        if (routeName == 'login') {
          return redirect({
            name: 'dashboard',
          })
        }
      }
      else if (res.status == 404 && routeName != 'dashboard') {
        return redirect({
          name: 'dashboard',
          query: { msg: 404 }
        })
      }
      else if (res.status == 406 && routeName != 'dashboard') {
        return redirect({
          name: 'dashboard',
          query: { msg: 406 }
        })
      }
      //when token is in active
      else if (res.status == 401) {
        //remove all cookie
        cookie.remove('authToken')
        cookie.remove('authUser')
        cookie.remove('authCompId')
        cookie.remove('authCompSec')
        cookie.remove('authName')
        cookie.remove('authEmail')
        cookie.remove('authMenus')

        return redirect({
          name: 'login',
        })
      } else {
        cookie.remove('authToken')
        cookie.remove('authUser')
        cookie.remove('authCompId')
        cookie.remove('authCompSec')
        cookie.remove('authName')
        cookie.remove('authEmail')
        cookie.remove('authMenus')

        return redirect({
          name: 'login',
        })
      }
    } else {
      if (cookie.get('authToken')) {
        app.store.commit('setToken', cookie.get('authToken'))
        app.store.commit('setHeaders', cookie.get('authToken'))
      }
      if (cookie.get('authCompId')) {
        app.store.commit('setCompId', cookie.get('authCompId'))
      }
      if (cookie.get('authCompSec')) {
        app.store.commit('setCompanySecurity', cookie.get('authCompSec'))
      }
      if (cookie.get('authUser')) {
        app.store.commit('setUser', cookie.get('authUser'))
      }
      if (cookie.get('authName')) {
        app.store.commit('setName', cookie.get('authName'))
      }
      if (cookie.get('authEmail')) {
        app.store.commit('setEmail', cookie.get('authEmail'))
      }
    }

  } else {
    cookie.remove('authToken')
    cookie.remove('authUser')
    cookie.remove('authCompId')
    cookie.remove('authCompSec')
    cookie.remove('authName')
    cookie.remove('authEmail')
    cookie.remove('authMenus')

    if (routeName != 'login' && routeName != 'forgotPassword') {

      return redirect({
        name: 'login',
      })
    }
  }
}
