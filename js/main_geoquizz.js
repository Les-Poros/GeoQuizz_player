//Fichier Js de l'application Geoquizz : Contient les components et l'instance de Vue.


//-------------------------------------------------COMPONENTS-------------------------------------

//Component Accueil : Ecran d'accueil de la webapp : Permet de lancer la webapp.
Vue.component("accueil", {
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

//Component Finish : Ecran de fin de partie : On affiche le score et on peut retourner à l'accueil.
Vue.component("finish", {
  props : ["is_finish"],
  methods: {
    //Rafraîchir la page pour retourner à l'accueil
    reload(){
      location.reload();
    }
  },
  template: `
  <div class="d-flex justify-content-center app">
  <div class="centrage d-flex flex-column align-items-center ">
      <h2>Votre score est de {{is_finish}}</h2>
     <button v-on:click="reload()" type="button" class="btn btn-secondary btn-couleur btn-space">Accueil</button>
  </a>
  </div>
  </div>    
    `
});


//Component Start : Ecran de configuration de la partie: 
//On choisi la série à jouer
//On sélectionne un niveau de difficulté
//On saisi un pseudo et on lance la partie.
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
    //Récupère l'id de la série choisie
    //Params : event -> la valeur choisi dans le selectpicker
    getSerie(event) {
      this.idSerie = event.target.value;
      console.log(this.idSerie);
    },
    //Récupère le niveau de jeu choisi
    //Params : event -> la valeur choisi dans le selectpicker
    getNiveau(event) {
      this.niveauFilter = event.target.value;
      console.log(this.niveauFilter);
    },

    //Envoyer les données nécessaire pour créer une partie sur le backoffice
    sendData() {
      //Si l'utilisateur a saisi tous les champs :
      //On envoi le pseudo dans le body de la requête axios au backoffice
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
          //On récupère et on émet l'id généré, le token généré, et le niveau choisi
          .then(response => {
            this.$emit("startgame", [response.data.id, response.data.token,this.niveauFilter]);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  //Quand on arrive sur la component start, on lance une requête axios pour récupérer
  //la liste des séries disponibles sur le backoffice.
  created() {
    axios
      .get("http://192.168.99.100:8082/series", {

      })

      .then(response => {
        //On vérifie qu'il y a bien un résultat et on émet la latitude, et la longitude de la map qui
        //correspond à la série
        if (response.data.content.length > 0) {
          this.$emit("getserie",[response.data.content[0].map_lat, response.data.content[0].map_lon]);
          this.listeSeries = response.data.content;
         
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
  
            <button v-on:click="sendData()" class="btn btn-couleur ml-2 text-white">
            Lancer la partie
           </button>
            </div>
            
            </div>
            </nav> 
             `,
  props: ["liste_serie"]
});


//Component Game : On affiche la zone de jeu.
//On affiche la carte de jeu et les images de la série
//Quand on clique sur la carte, on calcule les points
//on passe ensuite à la photo suivante.
//Gestion d'un timer pour multiplier les points
//Affichage dynamique
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
      //data pour les photos
      index: 0,

      //Partie : la distance se configure au lancement de la partie
      distanceMax : 0,
      scoreTot : 0,
      timer: 0,
      time:'',
      valTime: '',
      
    };
  },
  methods: {

    //Calcul de la distance : On prend les coordonées de l'image et les coordonées de l'endroit cliqué
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
      //Si index est supérieur à 9, alors on a fini la partie donc on va à l'écrand de fin
      this.statusGame = true;
      this.$emit("isfinish",[this.statusGame,this.scoreTot]);
      console.log("finish");
    }
    },

    //On calcule le score pour la photo en cours
    //Params : le résultat de la distance.
    calculateScore(distanceClique){
      console.log("on a cliqué au bout de :"+this.valTime);
      console.log("max distance : "+1.75*this.distanceMax);
      //Multiplicateur pour le temps
      let multiplicateur = 1;
      if(this.valTime <= 5){
        multiplicateur = 4;
      }
      else if(this.valTime > 5 &&this.valTime <= 15 ){
        multiplicateur = 2;
      }
      if(distanceClique <= this.distanceMax ){
        this.scoreTot+= (5*multiplicateur);
        console.log(this.scoreTot);
      }
      else if(distanceClique <= 1.5*this.distanceMax){
        this.scoreTot += (2*multiplicateur);
        console.log(this.scoreTot);
      }
      else{
        this.score += 0;
      }
    },
    //Passer à la photo suivante
    next() {
      
        this.index++;
        console.log(this.index);
            
    },
    //Changer la distance acceptable pour une réponse en fonction du niveau
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
    //Etablir un timer pour le jeu
     setTimer(){
       let self=this;
      let sec = 0;
       this.timer = setInterval(function(){
          self.time='00:'+sec;
          sec++;
          self.valTime = sec;
          console.log(self.time);
      }, 1000);
  },
  //Ecouter les events sur la map (ici les cliques de sourris).
    clickMap(map){
      let self =this;
      
      this.map.on('click', function(e) {
        //On réinitialise le timer
        clearInterval(self.timer);
        //On enregistre les coordonnées cliquées
        self.pos=e.latlng;
        self.lat = self.pos['lat'];
        self.lon= self.pos['lng'];
        console.log(e);
        //On ajoute un marker à l'endroit du clique
        self.clique = L.marker([self.lat,self.lon]).addTo(map);
        //On récupère le distance acceptable lié au level
        self.getLevel()
        //on calcule la distance
        self.calculateDistance();
        //On relance un timer
        self.setTimer();
  });
}
      
},
  
  computed:{
    
  },
  //Quand on arrive sur le component Game, on affiche instantanément la carte et la première photo de la série
  mounted() {
    //On lance le timer
    this.setTimer();
    //On centre la map sur la ville de la série.
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

   

    //Une fois la map load, on écoute les actions sur la carte
    
      this.clickMap(this.map);
     
   
         
         
  },
  template: `
    <div>
    <nav class="navbar navbar-light bg-light d-flex flex-row">   
               
                <img src="images/logo.png"  style="width: 3%; height: 3%" >
                <h2 v-if="index >0"> Serie : Zone - Photo({{index}}/10) Votre Score : {{scoreTot}}</h2>
                <h2 v-else>Zone : Nancy - Photo(1/10)</h2>
                <p>{{time}}</p>
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



//----------------------------------------------------INSTANCE DE VUE----------------------------------

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
