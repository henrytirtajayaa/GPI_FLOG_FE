<template>
  <div>
    <a
      @click="SmartviewSql(id, name)" 
      :class="classList" >
      <i :class="icon"/> {{ name }}
      <b-badge 
        v-if="badge && badge.text" 
        :variant="badge.variant" >
        {{ badge.text }}
      </b-badge>
    </a>
  </div>
</template>

<script>
export default {
  name: 'SidebarNavLink',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    sql: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    badge: {
      type: Object,
      default: () => {}
    },
    variant: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: ''
    },
    actSmartviewSql: { type: Function },
  },
  computed: {
    classList() {
      return ['nav-link', this.linkVariant, ...this.itemClasses]
    },
    linkVariant() {
      return this.variant ? `nav-link-${this.variant}` : ''
    },
    itemClasses() {
      return this.classes ? this.classes.split(' ') : []
    }
  },
  methods:{
    SmartviewSql(id, name) {
      this.actSmartviewSql(id, name)
      //localStorage.setItem( 'SmartView', id );
    }
  }
}
</script>
