Db = function(){
    
    if(!window.openDatabase){
        return false;
    }
    
    //Inicializa a variável com nula
    localInstanceDb = null;
    
    //Função que inicializa o banco de dados local
    this.initDb = function(name,version,displayName,maxSize){
         localInstanceDb = window.openDatabase(name, version, displayName, maxSize);
         return localInstanceDb;
    };
    
    //Função que executa comando SQL
    this.execute = function(sql,successFunction,errorFunction){
        if(!successFunction){
            successFunction = successFunctionIn;
        }
        if(!errorFunction){
            errorFunction = errorFunctionIn;
        }
        localInstanceDb.transaction(function(transaction){
           transaction.executeSql(sql,[],successFunction, errorFunction); 
        });
    };
    
    //Função padrão que é executa quando um erro acontece ao executar um comando SQL
    errorFunctionIn = function(transaction, result){
        console.log("Erro ao executar sql "+result.rows);
    };
    
    //Função padrão que é executa quando um comando SQL é executado com sucesso
    successFunctionIn = function(transaction, result){
        console.log("Sql executado com sucesso "+result);
    };
    
};