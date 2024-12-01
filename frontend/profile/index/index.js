const app = Vue.createApp({
    computed:{
      checkLogin: function(){
        const token = localStorage.getItem("token");
        if (token) {
            return "Профиль";
        } else {
            return "Войти";
        }
      }
    }
  }).mount('#app');