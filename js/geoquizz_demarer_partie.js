Vue.component('serie',{
  template: `

  <select class="selectpicker ml-2 mr-2 bg-secondary text-white" @change="onChangeSerie($event)">
                            <option v-for="serie in liste_serie" selected value="">{{serie.ville}}</option> 
                         </select>
   `,
  props : ['liste_serie'],

});


var content = new Vue({
    el: '#main_page',
    data: {
      serie : '',
      difficulte : '',
      pseudo : '',
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
  