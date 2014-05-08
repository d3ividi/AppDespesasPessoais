function gravaChavePlanilha(){
    var localDb = inicializaBanco();//inicializa o banco de dados local
    var chavePlanilha = $('input[name=chavePlanilha]').val();
    var id = $('input[name=idUnico]').val();
    
    if(id){
        localDb.execute("UPDATE config SET chavePlanilha='"+chavePlanilha+"' WHERE id="+id,successInsert);
    }else{
        localDb.execute("INSERT INTO config (chavePlanilha) VALUES ('"+chavePlanilha+"')",successInsert);
    }
    
    //Mostra o ícone de loading
    $.mobile.loading( 'show', {
            text: 'Salvando',
            textVisible: true,
            theme: 'z',
            html: ""
    });

    //Limpa o formulário
    $('#formChavePlanilha').each (function(){
        this.reset();
    });

    $.mobile.loading( 'hide' );//esconde o ícone de loading 
    $('#statusMessage').css("display","block")//Mostra uma mesagem de sucesso por um tempo determinado
    .fadeOut(8000, function() { $(this).css("display","none"); });


    return false;
    
}

function configuraChavePlanilha(){
    var localDb = inicializaBanco();//inicializa o banco de dados local
    
    successSelectChavePlanilha = function(transaction, result){
        var chavePlanilha = result.rows;
        console.log(chavePlanilha.item(0));
        if(chavePlanilha.item(0)){
            $('input[name=chavePlanilha]').val(chavePlanilha.item(0).chavePlanilha);
            $("#formChavePlanilha").append("<input type='hidden' name='idUnico' value='"+chavePlanilha.item(0).id+"'>");
        }
    };
    
    localDb.execute("SELECT * FROM config",successSelectChavePlanilha);
}

