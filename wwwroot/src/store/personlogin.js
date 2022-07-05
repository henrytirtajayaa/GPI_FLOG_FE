import * as cookie from 'js-cookie'
import config from '../static/config'

export const getter = {
  user(state){
    return state;
  }
}

export const actions = {
  actSignIn (context, value) {
    cookie.set(config.CACHESINGIN, JSON.stringify(value));
  },
  actSignOut (context, value) {
    cookie.remove(config.CACHESINGIN);
    this.$router.go('/dashboard');
  },
}
