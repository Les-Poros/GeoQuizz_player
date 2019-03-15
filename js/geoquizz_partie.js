// Vue.component('navbar',{

//     template: `
//     <nav class="navbar navbar-light bg-light d-flex flex-row nav-text">   
//                 <div class="input-group text-center">
//                 <img src="images/logo.png"  style="width: 3%; height: 3%" >
//                 <h2> Serie : Nancy - Photo(1/10)</h2>
//                 </div>
//             </nav> 
              
//      `,
   
  
//   });
  



// Vue.component('zone_jeu',{
//     data: function () {
//       return {
       
//       }
//     },
//     methods: {
      
//     },
//     template: `
    
//     <div class="row">
//     <div class="col-sm-5">
      
//       <img src="images/stan.jpg" style="width : 100%; height :100%" >
//     </div>
//     <div class="col-sm-7">
//       zone carte 
//     </div>
//     </div>
//      `,
//     props : [],
  
//   });


var content = new Vue({
    el: '#mapid',
    data: {     
      
    },
    methods: {
          
    },
    computed: {
     
    },
    created() {
        this.mymap = L.map('mapid').setView([48.6843900,  6.1849600], 13);
            this.tileStreets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoibGVvbGV6aWciLCJhIjoiY2p0NGk5bGhxMDN6MjN5bnc0dWo5M2w1YSJ9.Rp94LWSF0ljKG8zCV2MdBw'
                
                });
               
            this.tileStreets.addTo(this.mymap);
            // this.cible = L.marker([48.6939,6.182909999999993]).addTo(this.mymap);
           
           
      
    }
    });
      
    
