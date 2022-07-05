<template>
  <div class="animated fadeIn">
    <b-row>
      <!-- BEGIN TASKS -->
      <b-col sm="12" md="6" lg="6" xl="4">
        <b-card v-if="Array.isArray(DashboardTasks)">
          <template v-slot:header>
            <h5>My Tasks</h5>
          </template>
          <b-row>
            <b-col 
              sm="12" 
              lg="12">
              <ul class="icons-list">
                <template v-for="(task,index) in DashboardTasks">
                  <li v-bind:key="index">
                    <i :class="task.IconClasses"/>
                    <div class="desc">
                      <div class="title">{{task.Title}}</div>
                      <small>{{task.Description}}</small>
                    </div>
                    <div class="value" id="hideText">
                      <div class="small text-muted"><small>how many ?</small></div>
                      <strong>{{task.TaskCount}}</strong>
                    </div>
                    <div class="actions">
                      <!--a :href="task.TaskUrl"
                        variant="link" 
                        class="text-muted"><i class="icon-settings"/></a-->
                      <router-link variant="link" class="text-muted" 
                        :to="task.TaskUrl" >
                        <i class="icon-location-pin text-red font-weight-bold" style="margin-left:10px;margin-top:10px;"/>
                      </router-link>
                    </div>
                  </li>
                </template>                  
                <!--li class="divider text-center">
                  <b-button 
                    size="sm" 
                    variant="link" 
                    class="text-muted"><i class="icon-options"/></b-button>
                </li-->
              </ul>
            </b-col>
          </b-row>         
        </b-card>
      </b-col>
      <!-- END TASKS -->

      <!-- BEGIN APPROVALS -->
      <b-col md="4">
        <b-card v-if="Array.isArray(DashboardApprovals) && DashboardApprovals.length" header-bg-variant="dark" header-text-variant="warning" body-bg-variant="secondary">
          <template v-slot:header >
            <h5 >Need Approval</h5>
          </template>
          <b-row>
            <b-col 
              sm="12" 
              lg="12">
              <ul class="icons-list">
                <template v-for="(task,index) in DashboardApprovals">
                  <li v-bind:key="index" size="lg">
                    <i :class="task.IconClasses"/>
                    <div class="desc">
                      <div class="title font-weight-bold">{{task.Title}}</div>
                      <small>{{task.Description}}</small>
                    </div>
                    <div class="value">
                      <div class="small text-muted"><b-badge>#</b-badge></div>
                      <strong>{{task.TaskCount}}</strong>
                    </div>
                    <div class="actions">
                      <!--a :href="task.TaskUrl"
                        variant="link" 
                        class="text-muted"><i class="icon-settings"/></a-->
                      <router-link variant="link" class="text-muted " 
                        :to="task.TaskUrl" >
                        <i size="lg" class="icon-location-pin text-red font-weight-bold pulse ml-4 mt-2 mb-3" />
                      </router-link>
                    </div>
                  </li>
                </template>                  
                <!--li class="divider text-center">
                  <b-button 
                    size="sm" 
                    variant="link" 
                    class="text-muted"><i class="icon-options"/></b-button>
                </li-->
              </ul>
            </b-col>
          </b-row>         
        </b-card>
      </b-col>
      <!-- END APPROVALS -->
    </b-row>
  </div>  
</template>

<script>
  export default {
    layout: "dashboard",
    data() {
      return {
        DashboardTasks: [],
        DashboardApprovals: [],            
      };
    },
    computed: {
      userLogin () {
        return this.$store.state.name;
      }
    },
    async created(){
      let mytasks = await this.$store.dispatch(
        "features/report/dashboard/actGetMyTask"
      );
      
      this.DashboardTasks = mytasks;

      let myapprovals = await this.$store.dispatch(
        "features/report/dashboard/actGetMyApprovals"
      );

      this.DashboardApprovals = myapprovals;
    },
    async mounted(){
      
    }
  }
</script>

<style scoped>
@media only screen and (max-width: 350px) {
  #hideText{
    display:none;
  }
}
</style>
