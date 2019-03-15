Vue.component('accueil',{
    data: function () {
        return {
        
        }
      },
      methods: {
      
      },
    template:`
    <div class="d-flex justify-content-center app">
        <div class="centrage d-flex flex-column align-items-center ">
        <img src="images/logo.png" class="img-fluid">
           <button v-on:click="$emit('ready')" type="button" class="btn btn-secondary btn-couleur btn-space">Jouer à GeoQuizz</button>
        </a>
        </div>
        </div>
    `
})

Vue.component('start',{
    data: function () {
      return {
        niveauFilter:'',
        pseudo : '',
        idSerie:'',
        listeSeries:'',
        
      }
    },
    methods: {
      getSerie(event){
        
        this.idSerie = event.target.value;
        console.log(this.idSerie);
      },
      getNiveau(event){
        this.niveauFilter = event.target.value;
        console.log(this.niveauFilter);
      },
  
      sendData(){
        if(this.idSerie && this.niveauFilter && this.pseudo != null){
          this.postBody = {
              "joueur": this.pseudo,
          };
                
          axios
          .post('http://192.168.99.100:8082/parties/series/'+this.idSerie, this.postBody, {
            headers: {
              "Content-Type": "application/json"
            },
          })
          .then(response => {
           
            this.$emit('startgame',[response.data.id, response.data.token]);
           
            
          })
          .catch(error => {
            console.log(error);
          });
        
        }
      },
       
    },
    created(){
        axios.get('http://192.168.99.100:8083/series',{
        
        })
       
        .then(response => {
            //On vérifie qu'il y a bien un résultat
            if(response.data.content.length > 0){
              this.listeSeries = response.data.content;
              
                
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
    props : ['liste_serie'],
  
  });
  
  
  Vue.component('game',{

    template: `
    <nav class="navbar navbar-light bg-light d-flex flex-row nav-text">   
                <div class="input-group text-center">
                <img src="images/logo.png"  style="width: 3%; height: 3%" >
                <h2> Serie : Nancy - Photo(1/10)</h2>
                </div>
            </nav> 
              
     `,
   
  
  });
    



Vue.component('zone_jeu',{
    data: function () {
      return {
       
      }
    },
    methods: {
      
    },
    template: `
    
    <div class="row">
    <div class="col-sm-5">
      
      <img src="images/stan.jpg" style="width : 100%; height :100%" >
    </div>
    <div class="col-sm-7">
      zone carte 
    </div>
    </div>
     `,
    props : [],
  
  });


  var content = new Vue({
    el: '#main_page',
    data: {
        isAccueil : true,
        idPartie:'',
        token:'',
       
         
   },
    methods: {
       startGame(info){
           this.idPartie =info[0];
           this.token = info[1];
       }
    },
    computed: {
     
    },
    created() {
        
    }
    });
