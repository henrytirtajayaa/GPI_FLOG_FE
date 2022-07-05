<template>
  <router-link 
    :to="url"
    tag="li" 
    class="nav-item nav-dropdown"
    disabled >
    <div 
      :class="classListNavLink" 
      @click="handleClick" >
      <i :class="icon"/> {{ name }}
    </div>
    <ul class="nav-dropdown-items">
      <slot/>
    </ul>
  </router-link>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    navLinkClasses: {
      type: String,
      default: ''
    }
  },
  computed:{
    classListNavLink() {
      return ['nav-link nav-dropdown-toggle ', ...this.itemClasses]
    },
    itemClasses() {
      return this.navLinkClasses ? this.navLinkClasses.split(' ') : ''
    }
  },
  methods: {
    handleClick(e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
      //e.classList.add("open");
    }
  }
}
</script>
