var QueryString = function () {

  // Utilizar no Google App Scrip iFrame
  //var loc = document.referrer;
  //var query = decodeURIComponent(loc.split('?')[2]);

  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();


//Checa a conexão com o servidor do google
function checkOnline(url, error, ok) {
    try {
        var scriptElem = document.createElement('script');
        scriptElem.type = 'text/javascript';
        scriptElem.onerror = function(){error();};
        scriptElem.onload = function(){ok();};
        scriptElem.src = url;
        document.getElementsByTagName("body")[0].appendChild(scriptElem);
    } catch(err) {
        error(err);
    }
};

function checaConexao(){
    if(navigator.onLine){
        return true;
    }else{
        return false;
    }
}

//Seta o status da conexão como false
function setConexaoFalse(){
    conexao = false;
}

