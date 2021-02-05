<template>
  <div id="z-zone">
    <z-zone-header></z-zone-header>
    <router-view class="z-content"></router-view>
  </div>
</template>

<script>
  export default {
    methods: {
      switchPage(val) {
        this.$router.push({path:val})
      },
    }
  }
</script>

<style>
  #z-zone {
    display: flex;
    flex-direction: column;
  }
  
  #z-zone .z-content {
    flex-grow: 1;
  }
</style>
