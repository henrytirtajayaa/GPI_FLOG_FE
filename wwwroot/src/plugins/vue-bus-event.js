import Vue from 'vue'

const eventBus = new Vue();
//this helps WebStorm with autocompletion, otherwise it's not needed
Vue.prototype.$eventBus = eventBus;

export default ({app}, inject) => {
    inject('eventBus', eventBus);
}