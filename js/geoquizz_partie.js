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
      Zone photo

    </div>
    <div class="col-sm-7">
      zone carte 
    </div>
     `,
    props : [],
  
  });


// var content = new Vue({
//     el: '#main_page',
//     data: {     
//       listeSeries:'',
//     },
//     methods: {
          
//     },
//     computed: {
     
//     },
//     created() {
      
//         axios.get('http://192.168.99.100:8083/series',{
        
//         })
       
//         .then(response => {
//             //On vérifie qu'il y a bien un résultat
//             if(response.data.content.length > 0){
//               this.listeSeries = response.data.content;
              
             
//             }
        
//     });
      
//     }
//   });