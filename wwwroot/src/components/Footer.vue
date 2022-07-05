<template>
  <footer class="app-footer">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css"/>
    <!-- <span><a href="https://gpi-g.com/">FLOG</a> &copy; Global Putra International - 2020</span> -->
    <!--span class="ml-auto">Powered by <a href="https://gpi-g.com/">Global Putra International Group</a></span-->
    
    <img src="../static/img/logo2.png" style="width:20px; height:20px; margin: 0 10px 0 0;">
    <span> Copyright &copy; 2020 </span>

          <span style="float:right; font-size:10px; margin-left:5px;" id="resolution-show">
          | 
          For Better Experience, Please Use Landscape Orientation! 
          <font-awesome-icon :icon="['fas', 'image']" class="landscape animate__animated animate__infinite" /> 
          </span>
    
  </footer>
</template>
<script>
export default {
  name: 'CFooter'
}
</script>

<style scoped>
  #resolution-show{
    display:none;
  }

@media only screen and (max-width: 520px) {
    #resolution-show{
      display:inline-block;
    }

    .landscape{
      animation:rotateInDownLeft; 
      animation-duration: 2s;
    }
}
</style>
