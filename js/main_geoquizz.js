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
            this.$emit("startgame", [response.data.id, response.data.token]);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  created() {
    axios
      .get("http://192.168.99.100:8083/series", {

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
  
              <select class="selectpicker ml-2 mr-2 bg-secondary text-white" @change="getSerie($event)" v-model="idSerie">
                              <option value="" selected disabled hidden>Série</option>
                              <option v-for="serie in listeSeries" selected :value="serie.id">{{serie.ville}}</option> 
                           </select>
  
             <select class="selectpicker ml-2 mr-2 bg-secondary text-white" @change="getNiveau($event)">
             <option value="" selected disabled hidden>Niveau</option>           
             <option value="normal">Normal</option>                      
             </select>
                   </div>
  
            <input type="text" class="form-control text-center" placeholder="Votre pseudo..." aria-label="pseudo" v-model="pseudo" aria-describedby="button-addon2" v-on:keyup.enter="sendData()"/>
            <div class="input-group-append w-25">
  
            <button v-on:click="sendData()" class="btn btn-secondary ml-2">
            Lancer la partie
           </button>
            </div>
            
            </div>
            </nav> 
             `,
  props: ["liste_serie"]
});

Vue.component("game", {
  props: ["liste_photo","liste_serie"],
  data: function() {
    return {
     
      pos: "",
      lat:'',
      lon: "",
      clique: "",
      res: "",  
      map: "",
      //photo
      index: 0
      
    };
  },
  methods: {
    next() {
      if (this.index < 10) {
        this.index++;
        console.log(this.index);
      }
    },
    clickMap(map){
      this.index++;
          console.log(this.index);
    
  }
  },
  computed:{
    
  },
  mounted() {
    
    this.map = L.map("mapid").setView([this.liste_serie[0], this.liste_serie[1]], 13);
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

    //place stanislas
    L.marker([48.6939, 6.182909999999993]).addTo(this.map);
    L.circle([48.68439, 6.18496], { radius: 2000 }).addTo(this.map);

    //Une fois load, on écoute les actions sur la carte
    this.map.on('click', function(e) {
          
      this.pos=e.latlng;
      this.lat = this.pos['lat'];
      this.lon= this.pos['lng'];
      console.log(this.pos);
      console.log(this.lat);
      console.log(this.lon);
      this.clique = L.marker([this.lat,this.lon]).addTo(this);
      
     
   
      //une fois le marker placé, on change de photo
          })
         
  },
  template: `
    <div>
    <nav class="navbar navbar-light bg-light d-flex flex-row nav-text">   
                <div class="input-group text-center">
                <img src="images/logo.png"  style="width: 3%; height: 3%" >
                <h2> Serie : Nancy - Photo({{index}}/10)</h2>
                </div>
            </nav> 
    <div class="row">
    <div class="col-lg-7">
              
    <div id="mapid" style="height: 500px">
    </div>

    </div>

    <div class="col-lg-5" >
    <div>
        
        <img  :src="liste_photo[index].url" style="width:100%; height :100%;margin-right: 10px;" >
        <button v-on:click=next()>next</button>
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
    idPartie: "",
    token: "",
    listePhoto: [],
    listeSerie:[],
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

     
    }
  },
  computed: {},
  created() {
  }
});
