 class Toolbox {
  
  static getFormattedDate() {
    let today = new Date();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];
    return today.getDate() + '-' + months[today.getMonth()] + '-' +
      today.getFullYear();
  }

  static getDateInMiliseconds() {
    let today = new Date();
    return today.getTime();
  }
  
  static assert(errMsg)  {
      //replace js alert with msgbox from a ui framework  
      alert(errMsg); throw(errMsg); 
  }

  static log(source, error) {
     //log error to db 
     console.log(` Error occured from ${source}, error is ${error}.`)

  }
  
  static getFromStorage(key, isSessionOnly, useBackend=false) {
      if (!useBackend) {
         if (isSessionOnly){ 
          return JSON.parse(sessionStorage.getItem(key));
        }else {
          return JSON.parse(localStorage.getItem(key));
        }
      } else 
        alert('no  backend available');
  }
  static store(key, value, isSessionOnly, useBackend=false) {
      if (!useBackend) {
         let val = JSON.stringify(value); 
         if (isSessionOnly) 
          sessionStorage.setItem(key,val);
        else 
          localStorage.setItem(key,val);
        
      } else 
        alert('no  backend available');
  } 
}