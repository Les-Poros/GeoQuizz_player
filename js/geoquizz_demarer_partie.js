Vue.component('navbar',{
  data: function () {
    return {
     
      niveauFilter:'',
      pseudo : '',
      idSerie:'',
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
         console.log('succes');
        })
        .catch(error => {
          console.log(error);
        });
      
      }
    },
     
  },
  template: `
  <nav class="navbar navbar-light bg-light d-flex flex-row">   
              <div class="input-group">
              <img src="images/logo.png"  style="width: 3%; height: 3%" >
              <div class="input-group-prepend mr-2">

            <select class="selectpicker ml-2 mr-2 bg-secondary text-white" @change="getSerie($event)" v-model="idSerie">
                            <option value="" selected disabled hidden>Série</option>
                            <option v-for="serie in liste_serie" selected :value="serie.id">{{serie.ville}}</option> 
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


//----------------------------------------INSTANCE DE VUE---------------------------------------

var content = new Vue({
    el: '#main_page',
    data: {     
      listeSeries:'',
    },
    methods: {
          
    },
    computed: {
     
    },
    created() {
      
        axios.get('http://192.168.99.100:8083/series',{
        
        })
       
        .then(response => {
            //On vérifie qu'il y a bien un résultat
            if(response.data.content.length > 0){
              this.listeSeries = response.data.content;
              
             
            }
        
    });
      
    }
  });
  