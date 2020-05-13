<template>
  <div id="app">
    <a-row>
      <a-col :span="6"></a-col>
      <a-col :span="12">
        <h1>DefinitelyTyped Search</h1>
        <div style="margin-top:30px">
          <a-input-search placeholder="input search text" v-model="searchStr" size="large" @input="searchInput">
            </a-input-search>
            <ul>
              <li v-for="d in searched" :key="d">
                <div class="wrap-list" @click="toGitHub(d)" @mouseenter="isActive = d" @mouseleave="isActive = null" v-bind:class="{active: isActive == d}">
                  <div>{{d}}</div>
                  <div class="icon-list">
                    <a title="访问github"  v-bind:ref="d" :href="gitHubAddress(d)" target="_blank" @click="cancelEvent($event)">
                    <svg t="1589360801896"  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2121" width="20" height="20"><path d="M512 0C229.283787 0 0.142041 234.942803 0.142041 524.867683c0 231.829001 146.647305 428.553077 350.068189 497.952484 25.592898 4.819996 34.976961-11.38884 34.976961-25.294314 0-12.45521-0.469203-45.470049-0.725133-89.276559-142.381822 31.735193-172.453477-70.380469-172.453477-70.380469-23.246882-60.569859-56.816233-76.693384-56.816234-76.693385-46.493765-32.58829 3.540351-31.948468 3.540351-31.948467 51.356415 3.71097 78.356923 54.086324 78.356923 54.086324 45.683323 80.19108 119.817417 57.072162 148.993321 43.593236 4.649376-33.91059 17.915029-57.029508 32.50298-70.167195-113.675122-13.222997-233.151301-58.223843-233.1513-259.341366 0-57.285437 19.919806-104.163095 52.678715-140.846248-5.246544-13.265652-22.820334-66.626844 4.990615-138.884127 0 0 42.996069-14.076094 140.760939 53.787741 40.863327-11.644769 84.627183-17.445825 128.177764-17.6591 43.465272 0.213274 87.271782 6.014331 128.135109 17.6591 97.679561-67.906489 140.59032-53.787741 140.59032-53.787741 27.938914 72.257282 10.407779 125.618474 5.118579 138.884127 32.844219 36.683154 52.593405 83.560812 52.593405 140.846248 0 201.586726-119.646798 245.990404-233.663158 258.957473 18.341577 16.208835 34.721032 48.199958 34.721032 97.210357 0 70.167195-0.639822 126.7275-0.639823 143.960051 0 14.033439 9.213443 30.370239 35.190235 25.209005 203.250265-69.527373 349.769606-266.123484 349.769605-497.867175C1023.857959 234.942803 794.673558 0 512 0" fill="#3E75C3" p-id="2122"></path></svg>
                    </a>
                    <a title="访问npm" :href="npmAddress(d)" target="_blank" @click="cancelEvent($event)">
                    <svg t="1589360828488"  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2850" width="20" height="20"><path d="M117.149737 906.850263V117.160081h789.690182v789.690182z m148.521374-641.706667v492.533657h248.873374V367.843556h145.025293v389.906101h98.735321V265.143596z" fill="#CB3837" p-id="2851"></path></svg>
                    </a>
                </div>
                </div>
              </li>
            </ul>
        </div>
      </a-col>
      <a-col :span="6"></a-col>
    </a-row>
  </div>
</template>

<script>
const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl;
const treeUrl = 'https://api.github.com/repos/DefinitelyTyped/DefinitelyTyped/git/trees';
const url = 'https://api.github.com/repos/DefinitelyTyped/DefinitelyTyped/contents';
const pathName = 'types';
const obj = new Object();
export default {
  name: 'app',
  data () {
    return {
      data: {},
      searched: [],
      searchStr: '',
      isInit: false,
      shaValue: null,
      isActive: null
    }
  },
  created() {
    console.log('created');
    this.getTypesPathShaValue();
  },
  methods: {
      getTypesPathShaValue: function() {
        let self = this;
        // 先从缓存获取sha值，如果没有，去请求github api
        const sha = localStorage.getItem(pathName);
        if (sha) {
          self.shaValue = sha;
           self.initData();
          return;
        }
        // 请求github api
        this.$http.get(url).then(resp => {
          console.log(resp);
          if (resp.ok && 200 === resp.status) {
            const info = resp.data.find(x => pathName === x.name);
            if (info) {
              localStorage.setItem(pathName, info.sha); // 将sha值，放入缓存
              self.shaValue = info.sha;
              self.initData();
            }
          }
        }, err => console.log(err));
      },
      search: function (value) {
        if (!value) {
          // hide list
          this.searched = [];
          retrun; 
        }
        console.log('search', value);
      },
      searchInput: function () {
        // console.log(value, this.isInit, Object.keys(this.data).length);
        if (!this.isInit || !this.searchStr || Object.keys(this.data).length === 0) {
          this.searched = [];
          return;
        }
        this.searched = Object.keys(this.data).filter(x => x.indexOf(this.searchStr) !== -1).slice(0,15);
        console.log(this.searched);
      },
      initData: function () {
        let self = this;
        // example: https://api.github.com/repos/DefinitelyTyped/DefinitelyTyped/git/trees/66d17df83d8c33e591b73885d00ee07b5186ef2f
        this.$http.get(`${treeUrl}/${self.shaValue}`).then(resp => {
            console.log(resp);
            if (resp.ok && 200 === resp.status) {
              resp.data.tree.forEach(x => this.data[x.path] = obj);
              self.isInit = true;
            }
          }, err => console.log(err));
      },
      gitHubAddress: function(name) {
        return sanitizeUrl(`https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/${name}`);
      },
      npmAddress: function(name) {
        return sanitizeUrl(`https://www.npmjs.com/package/@types/${name}`);
      },
      toGitHub(value) {
        console.log(value, this.$refs[value][0]);
        this.$refs[value][0].click();
      },
      cancelEvent(event) {
        console.log(event);
        event.stopPropagation();
      }
  },
  mounted() {
    console.log('mounted');
  },
  updated() {
    console.log('updated');
  },
  destroyed() {
    console.log('destroyed');
  },
  computed: {
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  text-align: left;
  margin: 0 10px;
}
.icon-list {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}

.wrap-list {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 -10px;
  padding: 10px 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}
.active {
  background: #e6f7ff;
}
.icon {
  width: 20;
  height: 20;
  margin-left: 10px;
  cursor: pointer;
}
a {
  color: #42b983;
}
</style>
