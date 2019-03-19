Vue.component("accueil", {
  data: function() {
    return {};
  },
  methods: {},
  template: `
    <div class="d-flex justify-content-center app">
        <div class="centrage d-flex flex-column align-items-center ">
        <img src="images/logo.png" class="img-fluid">
           <button v-on:click="$emit('ready')" type="button" class="btn btn-secondary btn-couleur btn-space">Jouer à GeoQuizz</button>
        </a>
        </div>
        </div>
    `
});

Vue.component("finish", {
  props : ["is_finish"],
  data: function() {
    return {

    };
  },
  methods: {
    reload(){
      location.reload();
    }
  },
  template: `
    <div class="d-flex justify-content-center app">
    <nav class="navbar navbar-light bg-light d-flex flex-row">   
                <div class="input-group">
                <img src="images/logo.png"  style="width: 3%; height: 3%" >
          <h2>Votre score est de {{is_finish}} points</h2>
          <button  v-on:click="reload()" class="btn btn-couleur">Rejouer !</button>
          </div>
          </nav>
          </div>
          
    `
});

Vue.component("start", {
  data: function() {
    return {
      niveauFilter: "",
      pseudo: "",
      idSerie: "",
      listeSeries: ""
    };
  },
  methods: {
    getSerie(event) {
      this.idSerie = event.target.value;
      console.log(this.idSerie);
    },
    getNiveau(event) {
      this.niveauFilter = event.target.value;
      console.log(this.niveauFilter);
    },

    sendData() {
      if (this.idSerie && this.niveauFilter && this.pseudo != null) {
        this.postBody = {
          joueur: this.pseudo
        };

        axios
          .post(
            "http://192.168.99.100:8082/parties/series/" + this.idSerie,
            this.postBody,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
          .then(response => {
            this.$emit("startgame", [response.data.id, response.data.token,this.niveauFilter]);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  created() {
    axios
      .get("http://192.168.99.100:8082/series", {

      })

      .then(response => {
        //On vérifie qu'il y a bien un résultat
        if (response.data.content.length > 0) {
          this.$emit("getserie",[response.data.content[0].map_lat, response.data.content[0].map_lon]);
          this.listeSeries = response.data.content;
          console.log(this.listeSeries);
        }

      });
  },
  template: `
    
    <nav class="navbar navbar-light bg-light d-flex flex-row">   
                <div class="input-group">
                <img src="images/logo.png"  style="width: 3%; height: 3%" >
                <div class="input-group-prepend mr-2">
  
              <select class="selectpicker ml-2 mr-2 btn-couleur text-white" @change="getSerie($event)" v-model="idSerie">
                              <option value="" selected disabled hidden>Série</option>
                              <option v-for="serie in listeSeries" selected :value="serie.id">{{serie.ville}}</option> 
                           </select>
  
             <select class="selectpicker ml-2 mr-2 btn-couleur text-white" @change="getNiveau($event)">
             <option value="" selected disabled hidden>Niveau</option>           
             <option value="1">Normal</option>
             <option value="2">Difficile</option>                      
             <option value="3">Géographe</option>                      

             </select>
                   </div>
  
            <input type="text" class="form-control text-center" placeholder="Votre pseudo..." aria-label="pseudo" v-model="pseudo" aria-describedby="button-addon2" v-on:keyup.enter="sendData()"/>
            <div class="input-group-append w-25">
  
            <button v-on:click="sendData()" class="btn btn-couleur ml-2">
            Lancer la partie
           </button>
            </div>
            
            </div>
            </nav> 
             `,
  props: ["liste_serie"]
});

Vue.component("game", {
  props: ["liste_photo","liste_serie","level"],
  data: function() {
    return {
     
      pos: "",
      lat:'',
      lon: "",
      clique: "",
      cible:"",
      res: "",  
      map: "",
      statusGame : false,
      //photo
      index: 0,

      //Partie : la distance se configure au lancement de la partie
      distanceMax : 0,
      scoreTot : 0,
      
    };
  },
  methods: {

    calculateDistance(){
    if(this.index < 9){
    //on récupère les coordonnées de la photo
    this.cible = L.marker([this.liste_photo[this.index].latitude, this.liste_photo[this.index].longitude]);

      console.log(this.pos +"cible : "+ this.cible["_latlng"]);
      //On calcule la distance entre l'endroit cliqué et la photo
      this.res= L.GeometryUtil.length([this.pos,this.cible["_latlng"]]);
      this.calculateScore(this.res);
      console.log(this.res);
      
      //On passe à la photo suivante
      this.next();
    }
    else{
      this.statusGame = true;
      this.$emit("isfinish",[this.statusGame,this.scoreTot]);
      console.log("finish");
    }
    },
    calculateScore(distanceClique){
      console.log("max distance : "+1.75*this.distanceMax);
      if(distanceClique <= this.distanceMax ){
        this.scoreTot+= 5;
        console.log(this.scoreTot);
      }
      else if(distanceClique <= 1.5*this.distanceMax){
        this.scoreTot += 2;
        console.log(this.scoreTot);
      }
      else{
        this.score += 0;
      }
    },
    next() {
      
        this.index++;
        console.log(this.index);
        if(this.index == 9){
          console.log ("finish");
        }
    
    },
    getLevel(){
      if(this.level == 1){
        this.distanceMax = 100;
      }
      else if(this.level == 2){
        this.distanceMax = 75;

      }
      else if(this.level == 3){
        this.distanceMax = 50;
      }
    },
    clickMap(map){
      let self =this;
      
      this.map.on('click', function(e) {
          
        self.pos=e.latlng;
        self.lat = self.pos['lat'];
        self.lon= self.pos['lng'];
        console.log(e);
        self.clique = L.marker([self.lat,self.lon]).addTo(map);
        self.getLevel()
        self.calculateDistance();
      
  });
}
      
},
  
  computed:{
    
  },
  mounted() {
    
    this.map = L.map("mapid").setView([this.liste_serie[0], this.liste_serie[1]], 10);
    
    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom : 18,
          minZoom : 12,
        id: "mapbox.streets",
        accessToken:
          "pk.eyJ1IjoibGVvbGV6aWciLCJhIjoiY2p0NGk5bGhxMDN6MjN5bnc0dWo5M2w1YSJ9.Rp94LWSF0ljKG8zCV2MdBw"
      }
    ).addTo(this.map);

   

    //Une fois load, on écoute les actions sur la carte
    
      this.clickMap(this.map);
     
   
      //une fois le marker placé, on change de photo
         
         
  },
  template: `
    <div>
    <nav class="navbar navbar-light bg-light d-flex flex-row nav-text">   
                <div class="input-group text-center">
                <img src="images/logo.png"  style="width: 3%; height: 3%" >
                <h2 v-if="index >0"> Serie : Nancy - Photo({{index}}/10) Votre Score : {{scoreTot}}</h2>
                <h2 v-else>Serie : Nancy - Photo(1/10)</h2>
                </div>
            </nav> 
    <div class="row">
    <div class="col-lg-7 col-sm-12">
              
    <div id="mapid" style="height: 500px">

    </div>

    </div>

    <div class="col-lg-5" >
    <div>
        
        <img  :src="liste_photo[index].url" style="max-width: 100%;
        max-height: 500px;margin-right: 5px;" >
        
    </div>
    </div>
    </div>
    </div>
    
     `
});

var content = new Vue({
  el: "#main_page",
  data: {
    isAccueil: true,
    isFinish: false,
    scoreTot : 0,
    idPartie: "",
    token: "",
    listePhoto: [],
    listeSerie:[],
    niveau : "",
  },
  methods: {

    getSerie(info){
      this.listeSerie = [info[0],info[1]];
      console.log('liste : ' + this.listeSerie);
    },
    startGame(info) {
      axios
        .get("http://192.168.99.100:8082/parties/" + info[0], {
          headers: {
            "x-lbs-token": info[1]
          }
        })
        .then(response => {
          //On vérifie qu'il y a bien un résultat
          if (
            response.data.photo.length > 0 &&
            response.data.photo.length <= 10
          ) {
            this.idPartie = info[0];
            this.token = info[1];
            this.listePhoto = response.data.photo;

            console.log(this.listePhoto);
            console.log("token : " + this.token + "idPartie : " + this.idPartie);
          } else {
            //CAS ou plus de 10 photos
          }
        });

        this.niveau = info[2];
        console.log("niveau: " +this.niveau)
    },
    getFinish(finish){
      this.isFinish = finish[0];
      this.scoreTot = finish[1];
      console.log("score de fin :" + this.scoreTot)
    }
  },
  computed: {},
  created() {
  }
});
