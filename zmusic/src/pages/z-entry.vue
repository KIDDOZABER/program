<template>
  <div id="entry">
    <z-header ref="header"></z-header>
    <router-view class="z-content" ref="content"></router-view>

  </div>
</template>

<script>
  export default {
    data() {

      return {

      };
    },
    methods: {
      
      switchPage(val) {
        this.$router.push({
          path: val
        })
      },

      setSearchText() {
        this.$refs.header.searchText = this.$store.getters.getSearchText
        if(this.$refs.content.$el.id == 'search') {
          this.$refs.content.searchText = this.$store.getters.getSearchText
        }
      },
      search() {
        if(this.$refs.content.$el.id == 'search') {
          this.$refs.content.changePage(1)
        }
      },
      searchKeyWords(val) {
        this._axios({
          url: `/cloudsearch?keywords=${val}`
        }).then(res => {
          console.log(res.data)
          this.$store.commit('setSearchResult', res.data.result)
        })
      },
      openLoginBox() {
        this.$parent.openLoginBox()
      }
    }
  }
</script>

<style>
  #entry {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  #entry .z-content {
    flex-grow: 1;
  }
</style>
