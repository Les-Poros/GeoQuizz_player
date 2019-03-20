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
          </div>
          </div>
      `
});

//Component Finish : Ecran de fin de partie : On affiche le score et on peut retourner à l'accueil.
Vue.component("finish", {
  props: ["score", "idpartie"],
  methods: {
    //Envoie les données de la partie et retour a l'acceuil
    finGame() {
      axios
        .put(
          conf.apiUrl + "/parties/" + this.idpartie,
          {
            score: this.score,
            status: "finit"
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(response => {
          this.$emit("refresh");
        });
    }
  },
  template: `
    <div class="d-flex justify-content-center app">
    <div class="centrage d-flex flex-column align-items-center ">
        <h2>Votre score est de {{score}}</h2>
       <button v-on:click="finGame()" type="button" class="btn btn-secondary btn-couleur btn-space">Accueil</button>
    </div>
    </div>    
      `
});

//Component Start : Ecran de configuration de la partie:
//On choisi la série à jouer
//On sélectionne un niveau de difficulté
//On saisi un pseudo et on lance la partie.
Vue.component("start", {
  props: ["load"],
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
        axios
          .post(
            conf.apiUrl + "/parties/series/" + this.idSerie,
            {
              joueur: this.pseudo,
              difficulte: this.niveauFilter,
              nbphotos: this.nbPhoto
            },
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
          //On récupère et on émet l'id généré, le token généré, et le niveau choisi
          .then(response => {
            this.$emit("startgame", [response.data.id, response.data.token]);
          });
      }
    },
    getSeries() {
      axios
        .get(conf.apiUrl + "/series", {
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
    <div  class="container">
      <img src="images/logo.png" class="rounded mx-auto my-2 d-block" style="width:200px;height:200px">
  
      <div class="jeu">
      <h1 class="bg-orango m-0 text-dark p-2 text-center">Choisir une zone de jeu</h1>
      <div class="bg-blanco p-2">
      <div v-if="load" class="d-flex justify-content-center">
          <div class="spinner-border text-warning" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else class="row m-0 justify-content-md-center">
          <div
            class="card p-3 text-white text-center border-white col-lg-3 col-sm-6 col-12"
            :class=" {'bg-bleuco text-dark' : idSerie==serie.id,'bg-secondary' : idSerie!=serie.id}"
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
        <div v-if="pagination" class="justify-content-center my-2">
     
          <nav v-if="!load" aria-label="Page navigation  border-white example">
            <ul class="pagination justify-content-center rounded-0 m-0 mb-2 app">
              <li class="page-item">
                <p
                  class="page-link border-white text-white bg-secondary"
                  @click="pageSuivant(pagination.prev)"
                >Precedent</p>
              </li>
              <li class="page-item" v-if="pagination.first<=pagination.self-2">
                <p
                  class="page-link border-white bg-secondary text-white"
                  @click="pageSuivant(pagination.first)"
                >{{pagination.first}}</p>
              </li>
              <li class="page-item" v-if="pagination.first<=pagination.self-3">
                <p class="page-link border-white bg-secondary text-white">...</p>
              </li>
  
              <li class="page-item" v-if="pagination.prev!=pagination.self">
                <p
                  class="page-link border-white bg-secondary text-white"
                  @click="pageSuivant(pagination.prev)"
                >{{pagination.prev}}</p>
              </li>
  
              <li class="page-item">
                <p class="page-link border-white text-white bg-secondary active">{{pagination.self}}</p>
              </li>
  
              <li class="page-item" v-if="pagination.next!=pagination.self">
                <p
                  class="page-link border-white text-white bg-secondary"
                  @click="pageSuivant(pagination.next)"
                >{{pagination.next}}</p>
              </li>
  
              <li class="page-item" v-if="pagination.last-3>=pagination.self">
                <p class="page-link border-white bg-secondary text-white">...</p>
              </li>
              <li class="page-item" v-if="pagination.last-2>=pagination.self">
                <p
                  class="page-link border-white text-white bg-secondary"
                  @click="pageSuivant(pagination.last)"
                >{{pagination.last}}</p>
              </li>
              <li class="page-item">
                <p
                  class="page-link border-white text-white bg-secondary"
                  @click="pageSuivant(pagination.next)"
                >Suivant</p>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  
      <h1 class="bg-orango m-0 p-2 text-dark text-center">Choisir les options de la partie</h1>
      <div class="bg-blanco p-3 justify-content-center">
        <div class="justify-content-center mx-auto mb-3">
          <label class="text-center text-dark" id="basic-addon1">Difficultés de la partie :</label>
          <select
            class="custom-select bg-white text-center text-dark justify-content-center mx-auto"
            v-model="niveauFilter"
          >
            <option text-center selected value="1">Normal</option>
            <option value="2">Difficile</option>
            <option value="3">Géographe</option>
          </select>
        </div>
        <div class="justify-content-center mx-auto mb-3">
          <label class="text-left text-dark" id="basic-addon1">Nombres de photos<br/>(si trop elevé pour la zone, la partie comportera le nombre maximum possible de photos) :</label>
          <input
            type="number"
            class="form-control text-dark bg-white text-center"
            aria-describedby="basic-addon1"
            min="10" max="25"
            v-model="nbPhoto"
          >
        </div>
      </div>
      <h1 class="bg-orango   m-0 text-dark p-2 text-center">Lancer la partie</h1>
      <div class="bg-blanco p-3 justify-content-center">
        <label class="text-center text-dark" id="basic-addon1">Pseudo :</label>
        <input
          type="text"
          class="form-control text-dark bg-white text-center"
          aria-describedby="basic-addon1"
          v-model="pseudo"
          placeholder="pseudo"
        >
        <div class="mt-3 text-center">
          <button
            class="btn px-3 py-2 btn-primary text-center"
            @click="sendGame()"
            v-bind:disabled="!pseudo || !idSerie"
          >JOUER</button>
        </div>
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
  props: ["token", "idpartie", "load"],
  data: function() {
    return {
      pos: "",
      map: "",
      cliquable: true,
      index: 0,
      partie: "",
      distanceMax: 0,
      timer: "",
      score: 0,
      valTime: "",
      //Marker
      orangeIcon: "",
      click: "",
      cible: ""
    };
  },
  methods: {
    //Calcul de la distance : On prend les coordonées de l'image et les coordonées de l'endroit cliqué
    calculateDistance() {
      //on récupère les coordonnées de la photo
      this.cible = L.marker(
        [
          this.partie.photo[this.index].latitude,
          this.partie.photo[this.index].longitude
        ],
        { icon: this.orangeIcon }
      ).addTo(this.map);

      //On calcule la distance entre l'endroit cliqué et la photo
      let res = L.GeometryUtil.length([this.pos, this.cible["_latlng"]]);
      this.calculateScore(res);

      //On passe à la photo suivante
      this.next();
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
    //Si plus de photo alors on va a la fin du jeu
    //3 secondes pour voir la reponse avant la prochaine photo
    next() {
      var self = this;
      setTimeout(function() {
        if (self.index < self.partie.photo.length - 1) {
          if (self.click && self.cible) {
            self.map.removeLayer(self.click);
            self.map.removeLayer(self.cible);
          }
          self.setTimer();
          self.index++;
        } else {
          self.$emit("isfinish", [self.score]);
        }
      }, 3000);
    },
    //Changer la distance acceptable pour une réponse en fonction du niveau
    getLevel() {
      if (this.partie.difficulte == 1) {
        this.distanceMax = 200;
      } else if (this.partie.difficulte == 2) {
        this.distanceMax = 150;
      } else if (this.partie.difficulte == 3) {
        this.distanceMax = 100;
      }
    },
    //Etablir un timer pour le jeu
    setTimer() {
      let self = this;
      this.timer = setInterval(function() {
        self.valTime++;
        self.cliquable = true;
      }, 1000);
    },
    //Ecouter les events sur la map (ici les cliques de sourris).
    clickMap() {
      let self = this;

      this.map.on("click", function(e) {
        if (self.cliquable) {
          //On réinitialise le timer
          clearInterval(self.timer);
          self.valTime = 0;
          //On enregistre les coordonnées cliquées
          self.pos = e.latlng;
          //On ajoute un marker à l'endroit du clique
          self.click = L.marker([self.pos["lat"], self.pos["lng"]]).addTo(
            self.map
          );
          //on calcule la distance
          self.calculateDistance();
          self.cliquable = false;
        }
      });
    },
    startGame() {
      axios
        .get(conf.apiUrl + "parties/" + this.idpartie, {
          headers: {
            "x-lbs-token": this.token
          }
        })
        .then(response => {
          //On vérifie qu'il y a bien un résultat

          this.partie = response.data;
          var j, x, i;
          for (i = this.partie.photo.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.partie.photo[i];
            this.partie.photo[i] = this.partie.photo[j];
            this.partie.photo[j] = x;
          }
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

          //creation de marker de reponse
          this.orangeIcon = new L.Icon({
            iconUrl: "./images/marker-orange.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          //Une fois la map load, on écoute les actions sur la carte
          this.clickMap();
          //On récupère le distance acceptable lié au level
          this.getLevel();
        });
    },
  //change les secondes en minutes+secondes
    secondeToMinute(value) {
      var minutes = Math.floor(value / 60);
      var seconds = (value % 60).toFixed(0);
      return minutes + ":" + (value < 10 ? "0" : "") + seconds;
    }
  },
  //Quand on arrive sur le component Game, on affiche instantanément la carte et la première photo de la série
  created() {
    this.startGame();
  },
  template: `
      <div class=bg-blanco>
      <nav class="navbar navbar-light text-center bg-light d-flex flex-row">   
                 
      <img src="images/logo.png" class="mx-auto" style="width: 50px; height:50px" >
      <div class="mx-auto"><h2 v-if="partie"> Zone : {{partie.serie.ville}} - Photo({{index +1}}/{{partie.photo.length}})</h2> <h2>Votre Score : {{score}}</h2></div>
      <div class="time mx-auto">temps : {{secondeToMinute(valTime)}}</div>
      </nav> 
      <div v-if="load" class="d-flex justify-content-center">
          <div class="spinner-border text-warning" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      <div v-else class="row m-0">
      <div class="col-lg-7 m-0 p-0 col-sm-12">
                
      <div id="mapid" style="height: 500px">
  
      </div>
  
      </div>
  
      <div class="col-lg-5 m-0 p-0" >
    
          
          <img v-if="partie" :src="partie.photo[index].url" class="m-0" style="width: 100%;height:500px;
          max-height: 500px;margin-right: 5px;" >
         
      </div>
      </div>
      </div>
      
       `
});
