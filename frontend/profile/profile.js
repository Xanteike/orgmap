const app = Vue.createApp({
    computed:{
      checkLogin: function(){
        const token = localStorage.getItem("token");
        if (token) {
            return "Профиль";
        } else {
            return "Войти";
        }
      },
      user: async () =>{
        const response = await fetch("https://mvp.einsof.tech/api/mrp", {
          headers:{
            token: localStorage.getItem("auth")
          }
        })
        return response.json()
      }
    }
  }).mount('#app');