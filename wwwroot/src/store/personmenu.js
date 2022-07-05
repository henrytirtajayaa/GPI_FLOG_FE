import * as cookie from 'js-cookie'
import config from '../static/config'

export const state = () => ({
  menus: cookie.get(config.CACHEUSERMENU) != null ? JSON.parse(cookie.get(config.CACHEUSERMENU)) : []
})

export const actions = {
  actSetMenu (context, value) {
    cookie.set(config.CACHEUSERMENU, JSON.stringify(value));
  },
}