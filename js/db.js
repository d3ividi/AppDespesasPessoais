chavePlan = null;

successCreateTable = function(transaction, result){
   console.log("Tabela criada com sucesso ");
   return true;
};

successInsert = function(transaction, result){
    if (!result.rowsAffected) {
        console.log("Erro: Insert não executado.");
        return false;
    }else{
        console.log("Insert executado com sucess");
        return true;
    }
};

inicializaBanco = function(){
    var localDb = new Db();
    localDb.initDb("razoes",1,"Cadastro de Razões",65536);
    return localDb; 
};

criaTabela = function(localDb){
    localDb.execute("DROP TABLE razao");
    //Cria a tabela de Razões
    localDb.execute("CREATE TABLE IF NOT EXISTS razao (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, razao VARCHAR NOT NULL, tipo VARCHAR NOT NULL)",successCreateTable);
    //Cria a tabela de Registros
    localDb.execute("CREATE TABLE IF NOT EXISTS registro (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, dataEHora DATETIME  NOT NULL, tipoRegistro VARCHAR NOT NULL, valor REAL NOT NULL, detalhes VARCHAR NOT NULL, razao VAR CHAR NOT NULL )",successCreateTable);
    
    //Cria a tabela para configurações do aplicativo
    localDb.execute("CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, chavePlanilha VARCHAR NOT NULL)",successCreateTable);
};

getChavePlanilha = function(localDb){
    successSelectChave = function(transaction, result){
        if(result.rows.length){
            chavePlan = result.rows.item(0).chavePlanilha;
        }
    };
    
    localDb.execute("SELECT * FROM config",successSelectChave);
};