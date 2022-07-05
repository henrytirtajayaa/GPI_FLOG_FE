<template>
  <div class="sidebar">
    <SidebarHeader />
    <SidebarForm />
    <nav class="sidebar-nav">
      <div slot="header" />
      <ul class="nav" style="width:300px;">
        <template v-for="(item) in navItems">
          <template>
            <template>
              <SidebarNavItem :classes="item.class" :key="item.key">
                <SidebarNavLinkSmartView
                  :name="item.name"
                  :id="item.id"
                  :sql="item.sql"
                  :icon="item.icon"
                  :badge="item.badge"
                  :variant="item.variant"
                  :actSmartviewSql="SmartviewSql"
                />
              </SidebarNavItem>
            </template>
          </template>
        </template>
      </ul>
      <slot />
    </nav>
    <SidebarFooter />
    <SidebarMinimizer />
  </div>
</template>
<script>
import SidebarFooter from './SidebarFooter'
import SidebarForm from './SidebarForm'
import SidebarHeader from './SidebarHeader'
import SidebarMinimizer from './SidebarMinimizer'
import SidebarNavDivider from './SidebarNavDivider'
import SidebarNavDropdown from './SidebarNavDropdown'
import SidebarNavLinkSmartView from './SidebarNavLinkSmartView'
import SidebarNavTitle from './SidebarNavTitle'
import SidebarNavItem from './SidebarNavItem'
import SidebarNavLabel from './SidebarNavLabel'

export default {
  name: 'Sidebar',
  components: {
    SidebarFooter,
    SidebarForm,
    SidebarHeader,
    SidebarMinimizer,
    SidebarNavDivider,
    SidebarNavDropdown,
    SidebarNavLinkSmartView,
    SidebarNavTitle,
    SidebarNavItem,
    SidebarNavLabel
  },
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    },
    fixed: {
      type: Boolean,
      default: false
    },
    actSmartview: { type: Function }
  },
  mounted: function() {
    this.isFixed(this.fixed)
  },
  methods: {
    isFixed() {
      this.fixed
        ? document.body.classList.add('sidebar-fixed')
        : document.body.classList.remove('sidebar-fixed')
      return this.fixed
    },
    SmartviewSql(id, name){
      this.actSmartview(id, name)
    }
  }
}
</script>

<style lang="css">
.nav-link {
  cursor: pointer;
}

#second-level {
  padding-left:5px;
  background-color: rgba(0, 0, 0, 0.5);
}

#third-level {
  /* padding-left:5px; */
  background-color: rgba(0, 0, 0, 0.2);
}

</style>
