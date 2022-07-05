<template>
  <div class="sidebar">
    <SidebarHeader />
    <SidebarForm />
    <nav class="sidebar-nav">
      <div slot="header" />
      <ul class="nav" style="width:300px;">
        <template v-for="(item) in navItems">
          <template v-if="item.title">
            <SidebarNavTitle
              :name="item.name"
              :classes="item.class"
              :wrapper="item.wrapper"
              :key="item.key"
            />
          </template>
          <template v-else-if="item.divider">
            <SidebarNavDivider :classes="item.class" :key="item.key" />
          </template>
          <template v-else-if="item.label">
            <SidebarNavLabel
              :name="item.name"
              :url="item.url"
              :icon="item.icon"
              :label="item.label"
              :classes="item.class"
              :key="item.key"
            />
          </template>
          <template v-else>
            <template v-if="item.children">
              <!-- First level dropdown -->
              <SidebarNavDropdown 
                :name="item.name"
                :url="item.url"
                :icon="item.icon"
                :key="item.key"
              >
                <template v-for="(childL1) in item.children">
                  <template v-if="childL1.children">
                    <!-- Second level dropdown -->
                    <SidebarNavDropdown
                      :name="childL1.name"
                      :url="childL1.url"
                      :icon="childL1.icon"
                      :key="childL1.key"
                      navLinkClasses=""
                      id="second-level"
                    >
                      <template v-for="(child2) in childL1.children">
                        <template v-if="child2.children">
                          <!-- Third level dropdown -->
                          <SidebarNavDropdown 
                            :name="child2.name"
                            :url="child2.url"
                            :icon="child2.icon"
                            :key="child2.key"
                            navLinkClasses=""
                            id="third-level"
                          >
                            <li v-for="(child3) in child2.children" :key="child3.key" class="nav-item">
                              {{child3.name}}
                              <SidebarNavLink
                                :name="child3.name"
                                :url="child3.url"
                                :icon="child3.icon"
                                :badge="child3.badge"
                                :variant="item.variant"
                                id="third-level"
                              />
                            </li>
                          </SidebarNavDropdown>
                        </template> 
                        <template v-else>
                          <li :key="child2.key" class="nav-item">
                            <SidebarNavLink
                              :name="child2.name"
                              :url="child2.url"
                              :icon="child2.icon"
                              :badge="child2.badge"
                              :variant="item.variant"
                              id="second-level"
                            />
                          </li>
                        </template>
                      </template>  
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <!-- eslint-disable -->
                    <SidebarNavItem :classes="item.class">
                      <SidebarNavLink
                        :name="childL1.name"
                        :url="childL1.url"
                        :icon="childL1.icon"
                        :badge="childL1.badge"
                        :variant="item.variant"
                      />
                    </SidebarNavItem>
                    <!-- eslint-enable -->
                  </template>
                </template>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <SidebarNavItem :classes="item.class" :key="item.key">
                <SidebarNavLink
                  :name="item.name"
                  :url="item.url"
                  :icon="item.icon"
                  :badge="item.badge"
                  :variant="item.variant"
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
import SidebarNavLink from './SidebarNavLink'
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
    SidebarNavLink,
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
    }
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


@media only screen and (max-width: 1000px) {
  #second-level {
    padding-left:5px;
    background-color: rgba(0, 0, 0, 0.5);
    font-size:12px;
  }

#third-level {
    /* padding-left:5px; */
    background-color: rgba(0, 0, 0, 0.2);
    font-size:10px;
  }
}

</style>
