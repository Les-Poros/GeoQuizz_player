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
  props: ["score"],
  methods: {
    //Rafraîchir la page pour retourner à l'accueil
    reload() {
      location.reload();
    }
  },
  template: `
  <div class="d-flex justify-content-center app">
  <div class="centrage d-flex flex-column align-items-center ">
      <h2>Votre score est de {{score}}</h2>
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
      niveauFilter: "1",
      pseudo: "",
      idSerie: "",
      listeSeries: "",
      size: "6",
      page: "0",
      nbPhoto: "10",
      pagination: []
    };
  },
  methods: {
    pageSuivant: function(page) {
      this.page = page;
      this.getSeries();
    },
    //Envoyer les données nécessaire pour créer une partie sur le backoffice
    sendGame() {
      //Si l'utilisateur a saisi tous les champs :
      //On envoi le pseudo dans le body de la requête axios au backoffice
      if (this.idSerie && this.niveauFilter && this.pseudo != null) {
        this.postBody = {
          joueur: this.pseudo,
          difficulte: this.niveauFilter,
          nbphotos: this.nbPhoto
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
            this.$emit("startgame", [response.data.id, response.data.token]);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getSeries() {
      axios
        .get("http://192.168.99.100:8082/series", {
          params: {
            page: this.page,
            size: this.size
          }
        })
        .then(response => {
          //On vérifie qu'il y a bien un résultat et on émet la latitude, et la longitude de la map qui
          //correspond à la série
          if (response.data) {
            this.listeSeries = response.data.content;
            console.log(response);
            response["data"]["links"].forEach(element => {
              this.$set(
                this.pagination,
                element.rel.split(" - page:")[0],
                element.rel.split(" - page:")[1]
              );
            });
          }
        });
    }
  },
  //Quand on arrive sur la component start, on lance une requête axios pour récupérer
  //la liste des séries disponibles sur le backoffice.
  created() {
    this.getSeries();
  },
  template: `
  <div>
    <img src="images/logo.png" class="rounded mx-auto my-2 d-block" style="width:200px;height:200">

    <h1 class="bg-primary m-0 text-dark p-2 text-center">Choisir une zone de jeu</h1>
    <div class="bg-dark p-2">
      <div class="row m-0 justify-content-md-center">
        <div
          class="card p-3 text-white text-center border-warning col-lg-3 col-sm-6 col-12"
          :class=" {'bg-warning' : idSerie==serie.id,'bg-dark' : idSerie!=serie.id}"
          v-for="(serie,index) in listeSeries"
          :key="index"
          style="width: 18rem;cursor:pointer"
          @click="idSerie=serie.id"
        >
          <img :src="serie.photo[0].url" class="card-img-top photo petite-img" alt>
          <div class="card-body">
            <h5 class="card-title">{{serie.ville}}</h5>
          </div>
        </div>
      </div>
      <div v-if="pagination" class="justify-content-center">
        <div class="input-group justify-content-center mx-auto my-2 w-75">
          <div class="input-group-prepend">
            <span class="input-group-text bg-warning border-warning" id="basic-addon1">Nb élements</span>
          </div>
          <input
            type="number"
            class="form-control border-warning text-white bg-dark text-center"
            aria-describedby="basic-addon1"
            v-model="size"
            value="10"
          >
          <div class="input-group-append">
            <button
              class="btn btn-warning"
              type="button"
              id="button-addon2 "
              @click="pageSuivant(pagination.self)"
            >Valider</button>
          </div>
        </div>
        <nav aria-label="Page navigation m-2 border-warning example">
          <ul class="pagination justify-content-center rounded-0 m-0 mb-2 app">
            <li class="page-item">
              <p
                class="page-link border-warning text-warning bg-dark"
                @click="pageSuivant(pagination.prev)"
              >Precedent</p>
            </li>
            <li class="page-item" v-if="pagination.first<=pagination.self-2">
              <p
                class="page-link border-warning bg-dark text-warning"
                @click="pageSuivant(pagination.first)"
              >{{pagination.first}}</p>
            </li>
            <li class="page-item" v-if="pagination.first<=pagination.self-3">
              <p class="page-link border-warning bg-dark text-warning">...</p>
            </li>

            <li class="page-item" v-if="pagination.prev!=pagination.self">
              <p
                class="page-link border-warning bg-dark text-warning"
                @click="pageSuivant(pagination.prev)"
              >{{pagination.prev}}</p>
            </li>

            <li class="page-item">
              <p class="page-link border-warning text-warning bg-dark active">{{pagination.self}}</p>
            </li>

            <li class="page-item" v-if="pagination.next!=pagination.self">
              <p
                class="page-link border-warning text-warning bg-dark"
                @click="pageSuivant(pagination.next)"
              >{{pagination.next}}</p>
            </li>

            <li class="page-item" v-if="pagination.last-3>=pagination.self">
              <p class="page-link border-warning bg-dark text-warning">...</p>
            </li>
            <li class="page-item" v-if="pagination.last-2>=pagination.self">
              <p
                class="page-link border-warning text-warning bg-dark"
                @click="pageSuivant(pagination.last)"
              >{{pagination.last}}</p>
            </li>
            <li class="page-item">
              <p
                class="page-link border-warning text-warning bg-dark"
                @click="pageSuivant(pagination.next)"
              >Suivant</p>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <h1 class="bg-primary m-0 p-2 text-dark text-center">Choisir les options de la partie</h1>
    <div class="bg-dark p-3 justify-content-center">
      <div class="justify-content-center mx-auto mb-3">
        <label class="text-center text-white" id="basic-addon1">Difficultés de la partie :</label>
        <select
          class="custom-select border-warning bg-dark text-center text-white justify-content-center mx-auto"
          v-model="niveauFilter"
        >
          <option text-center selected value="1">Normal</option>
          <option value="2">Difficile</option>
          <option value="3">Géographe</option>
        </select>
      </div>
      <div class="justify-content-center mx-auto mb-3">
        <label class="text-center text-white" id="basic-addon1">Nombres de photos<br/>(si trop elevé pour la zone, la partie comportera le nombre maximum possible de photos) :</label>
        <input
          type="number"
          class="form-control border-warning text-white bg-dark text-center"
          aria-describedby="basic-addon1"
          v-model="nbPhoto"
        >
      </div>
    </div>
    <h1 class="bg-primary m-0 text-dark p-2 text-center">Lancer la partie</h1>
    <div class="bg-dark mb-5 p-3 justify-content-center">
      <label class="text-center text-white" id="basic-addon1">Pseudo :</label>
      <input
        type="text"
        class="form-control border-warning text-white bg-dark text-center"
        aria-describedby="basic-addon1"
        v-model="pseudo"
        placeholder="pseudo"
      >
      <div class="mt-3 text-center">
        <button
          class="btn btn-primary text-center"
          @click="sendGame()"
          v-bind:disabled="!pseudo || !idSerie"
        >Jouer !!!</button>
      </div>
    </div>
  </div>
  `
});

//Component Game : On affiche la zone de jeu.
//On affiche la carte de jeu et les images de la série
//Quand on clique sur la carte, on calcule les points
//on passe ensuite à la photo suivante.
//Gestion d'un timer pour multiplier les points
//Affichage dynamique
Vue.component("game", {
  props: ["token", "idpartie"],
  data: function() {
    return {
      pos: "",
      map: "",
      //data pour les photos
      index: 0,
      partie: "",
      //Partie : la distance se configure au lancement de la partie
      distanceMax: 0,
      timer: "",
      score: 0,
      valTime: ""
    };
  },
  methods: {
    //Calcul de la distance : On prend les coordonées de l'image et les coordonées de l'endroit cliqué
    calculateDistance() {
      //on récupère les coordonnées de la photo
      let cible = L.marker([
        this.partie.photo[this.index].latitude,
        this.partie.photo[this.index].longitude
      ]);

      //On calcule la distance entre l'endroit cliqué et la photo
      let res = L.GeometryUtil.length([this.pos, cible["_latlng"]]);
      this.calculateScore(res);
      if (this.index < this.partie.photo.length-1) {
        //On passe à la photo suivante
        this.next();
      } else {
        this.statusGame = true;
        this.$emit("isfinish", [this.score]);
      }
    },

    //On calcule le score pour la photo en cours
    //Params : le résultat de la distance.
    calculateScore(distanceClique) {
      //Multiplicateur pour le temps
      let multiplicateur = 1;
      if (this.valTime <= 5) {
        multiplicateur = 4;
      } else if (this.valTime > 5 && this.valTime <= 15) {
        multiplicateur = 2;
      }
      if (distanceClique <= this.distanceMax) {
        this.score += 5 * multiplicateur;
      } else if (distanceClique <= 1.5 * this.distanceMax) {
        this.score += 2 * multiplicateur;
      }
    },
    //Passer à la photo suivante
    next() {
      this.index++;
    },
    //Changer la distance acceptable pour une réponse en fonction du niveau
    getLevel() {
      if (this.partie.difficulte == 1) {
        this.distanceMax = 100;
      } else if (this.partie.difficulte == 2) {
        this.distanceMax = 75;
      } else if (this.partie.difficulte == 3) {
        this.distanceMax = 50;
      }
    },
    //Etablir un timer pour le jeu
    setTimer() {
      let self = this;
      self.valTime = 0;
      this.timer = setInterval(function() {
        self.valTime++;
      }, 1000);
    },
    //Ecouter les events sur la map (ici les cliques de sourris).
    clickMap(map) {
      let self = this;

      this.map.on("click", function(e) {
        //On réinitialise le timer
        clearInterval(self.timer);
        //On enregistre les coordonnées cliquées
        self.pos = e.latlng;
        //On ajoute un marker à l'endroit du clique
        L.marker([self.pos["lat"], self.pos["lng"]]).addTo(map);
        //On récupère le distance acceptable lié au level
        self.getLevel();
        //on calcule la distance
        self.calculateDistance();
        //On relance un timer
        self.setTimer();
      });
    },
    startGame() {
      axios
        .get("http://192.168.99.100:8082/parties/" + this.idpartie, {
          headers: {
            "x-lbs-token": this.token
          }
        })
        .then(response => {
          //On vérifie qu'il y a bien un résultat

          this.partie = response.data;
          this.partie.photo.sort(() => Math.random() - 0.5);

          //On lance le timer
          this.setTimer();
          //On centre la map sur la ville de la série.
          this.map = L.map("mapid").setView(
            [this.partie.serie.map_lat, this.partie.serie.map_lon],
            10
          );

          L.tileLayer(
            "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
            {
              attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
              maxZoom: 18,
              minZoom: 12,
              id: "mapbox.streets",
              accessToken:
                "pk.eyJ1IjoibGVvbGV6aWciLCJhIjoiY2p0NGk5bGhxMDN6MjN5bnc0dWo5M2w1YSJ9.Rp94LWSF0ljKG8zCV2MdBw"
            }
          ).addTo(this.map);

          //Une fois la map load, on écoute les actions sur la carte

          this.clickMap(this.map);
        });
    }
  },

  computed: {},
  //Quand on arrive sur le component Game, on affiche instantanément la carte et la première photo de la série
  created() {
    this.startGame();
  },
  template: `
    <div>
    <nav class="navbar navbar-light bg-light d-flex flex-row">   
                <img src="images/logo.png"  style="width: 3%; height: 3%" >
                <h2 v-if="partie"> Serie : Zone - Photo({{index}}/{{partie.photo.length}}) Votre Score : {{score}}</h2>
                <p>{{valTime}}</p>
            </nav> 
    <div class="row">
    <div class="col-lg-7 col-sm-12">
              
    <div id="mapid" style="height: 500px">

    </div>

    </div>

    <div class="col-lg-5" >
    <div>
        
        <img v-if="partie" :src="partie.photo[index].url" style="max-width: 100%;
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
    idPartie: "",
    score:"",
    token: ""
  },
  methods: {
    getFinish(finish) {
      this.isFinish = finish[0];
      this.scoreTot = finish[1];
    }
  }
});
