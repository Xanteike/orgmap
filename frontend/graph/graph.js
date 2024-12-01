const app = Vue.createApp({
    computed:{
      checkLogin: function(){
        const token = localStorage.getItem("token");
        if (token) {
            return "Выйти";
        } else {
            return "Войти";
        }
      }
    }
  }).mount('#app');