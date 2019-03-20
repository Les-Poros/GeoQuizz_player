

//----------------------------------------------------INSTANCE DE VUE----------------------------------

var content = new Vue({
  el: "#main_page",
  data: {
    isAccueil: true,
    isFinish: false,
    idPartie: "",
    score:"",
    token: "",
    load:false
  },
  methods: {
    refresh(){
      this.isFinish=false;
      this.idPartie="";
      this.token="";
      this.score="";
    }
  },
  created() {
    //On set des parametres par defauts de nos requetes axios
    axios.interceptors.request.use((config) => {
      this.load = true;
      return config;
    }, (error) => {
      this.load = false;
      return Promise.reject(error);
    });

    axios.interceptors.response.use((response) => {
      this.load = false;
      return response;
    }, (error) => {
      this.load = false;
      return Promise.reject(error);
    });
  }
});
