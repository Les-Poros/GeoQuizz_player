Vue.component('navbar',{
  data: function () {
    return {
      serieFilter:'',
      niveauFilter:'',
      pseudo : '',
    }
  },
  methods: {
    getSerie(event){
      this.serieFilter = event.target.value;
      console.log(this.serieFilter);
    },
    getNiveau(event){
      this.niveauFilter = event.target.value;
      console.log(this.niveauFilter);
    },
  },
  template: `
  <nav class="navbar navbar-light bg-light d-flex flex-row">   
              <div class="input-group">
              <img src="images/logo.png"  style="width: 3%; height: 3%" >
              <div class="input-group-prepend mr-2">

            <select class="selectpicker ml-2 mr-2 bg-secondary text-white" @change="getSerie($event)" v-model="serieFilter">
                            <option value="" selected disabled hidden>Série</option>
                            <option v-for="serie in liste_serie" selected :value="serie.ville">{{serie.ville}}</option> 
                         </select>

           <select class="selectpicker ml-2 mr-2 bg-secondary text-white" @change="getNiveau($event)">
           <option value="" selected disabled hidden>Niveau</option>           
           <option value="normal">Normal</option>                      
           </select>
                 </div>

          <input type="text" class="form-control text-center" placeholder="Votre pseudo..." aria-label="pseudo" v-model="pseudo" aria-describedby="button-addon2" v-on:keyup.enter="getSeries()"/>
          <div class="input-group-append w-25">

          <button v-on:click="getSeries()" class="btn btn-secondary ml-2">
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
              console.log(response.data.content[0].ville);
             
            }

        
    });
    
  
    }
  });
  