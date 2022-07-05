<template>
  <ol class="breadcrumb">
    <li v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-item">
      <!--span 
        v-if="isLast(index)"
        class="active" >
        {{ showName(item.text) }}
      </span-->
      <!--router-link 
        v-else 
        :to="item.href" >
        {{ showName(item.text) }}
      </router-link-->
      <router-link v-if="item.href" :to="item.href">
        <b-icon :icon="item.icon">home</b-icon>
      </router-link>
      <span v-if="item.href!='dashboard'">{{ item.text }}</span>
    </li>
  </ol>
</template>

<script>
import util from "../helper/utils";

export default {
  data() {
    return {
      title: '',
      breadcrumbs: Array()
    }
  },
  watch: {
    $route(to, from) {
      this.doUpdate();
    }
  },
  mounted() {
    this.doUpdate();
  },
  methods: {
    /*
    isLast(index) {
      return index === this.breadcrumbs.length - 1
    },*/
    doUpdate() {
      this.breadcrumbs = [];

      this.breadcrumbs.push({
        text: 'Dashboard',
        href: '/dashboard',
        icon: 'house-fill'
      })
      let item = this.$store.state.menu

      if (this.$route.path != '/dashboard') {
        for (var row = 0; row < item.length; row++) {
          if (item[row].Items) {
            let child = item[row].Items.find(i => {
              return i.Href === this.$route.path
            })

            if (child) {
              this.breadcrumbs.pop({ text: 'Dashboard' });
              this.breadcrumbs.push({ href:'/dashboard', icon:'house-fill' });
              this.breadcrumbs.push({ text: util.toTitleCase(item[row].Title) });
              this.breadcrumbs.push({ text: util.toTitleCase(child.Title)})
              //this.title = child.Title
            } else {
              var child2 = ''
              if (item[row].Items.length > 0) {
                for (var col = 0; col < item[row].Items.length; col++) {
                  if (item[row].Items[col].Href == this.$route.path) {
                    child2 = item[row].Items[col].Href
                    this.breadcrumbs.pop({ text: 'Dashboard' });
                    this.breadcrumbs.push({ href:'/dashboard', icon:'house-fill' });
                    this.breadcrumbs.push({ text: util.toTitleCase(item[row].Title) })
                    this.breadcrumbs.push({ text: util.toTitleCase(child2) })
                    this.title = child
                  }
                  if (child2 == '') {
                    var child3 = ''
                    for (
                      var col2 = 0;
                      col2 < item[row].Items[col].Items.length;
                      col2++
                    ) {
                      if (
                        item[row].Items[col].Items[col2].Href ==
                        this.$route.path
                      ) {
                        child3 = item[row].Items[col].Items[col2].Title
                        this.breadcrumbs.pop({ text: 'Dashboard' });
                        this.breadcrumbs.push({ href:'/dashboard', icon:'house-fill' });
                        this.breadcrumbs.push({ text: util.toTitleCase(item[row].Title) })
                        this.breadcrumbs.push({
                          text: util.toTitleCase(item[row].Items[col].Title)
                        })
                        this.breadcrumbs.push({ text: util.toTitleCase(child3) })
                        this.title = child3
                      }
                    }
                  }
                }
              } else {
                if (item[row].Href === this.$route.path) {
                  this.breadcrumbs.push({ text: util.toTitleCase(item[row].Title) })
                }
              }
            }
          } else {
            if (item.Href === this.$route.path) {
              this.title = item.Title
              this.breadcrumbs.pop({ text: 'Dashboard' });
              this.breadcrumbs.push({ href:'/dashboard', icon:'house-fill' });
              this.breadcrumbs.push({ text: util.toTitleCase(item.Title) })
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.breadcrumb-item{
  font-family: sans-serif, Helvetica, Arial;
  font-size:12px;
  color: #29363d;
}

@media only screen and (max-width: 420px) {
  .breadcrumb-item{
    font-family: sans-serif, Helvetica, Arial;
    font-size:10px;
    color: #29363d;
  }
}

@media only screen and (max-width: 300px) {
  .breadcrumb-item{
    font-family: sans-serif, Helvetica, Arial;
    font-size:8px;
    color: #29363d;
  }
}
</style>