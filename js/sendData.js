
//Função que envia os registros para a planilha do Google
function insereRegistro(){
    
    
    //Captura os dados do formulário
    var data = $(':input');
    var dados = new Object();
    for (var item in data){
        var t = data[item];
        if(t.type!=="radio"){
          dados[t.name] = t.value;
        }else if(t.checked){
          dados[t.name] = t.value;   
        }
    }
    //Indica qual a função deve ser executada no script do servidor
    dados.funcao = "inserirRegistro"; 
    dados.chavePlanilha = chavePlan;
    $.mobile.loading( 'show', {
            text: 'Enviando',
            textVisible: true,
            theme: 'z',
            html: ""
    });
    
    //Verifica a conexão com o script do Google
    //checkOnline(URL_API+"?funcao=testeConexao", insereLocal, insereOnline);
    if(checaConexao()){
        insereOnline();
    }else{
        insereLocal();
    }
    
    //Envia o registro para a planilha do Google
    function insereOnline(){  

        //Envia os dados via Ajax   
        $.ajax({
        url: URL_API+"?callback=?",
        dataType: 'jsonp',
        timeout: 120000, 
        data:dados,
        type:'POST',
        //Função que é executada caso a requisição ajax seja executada com sucesso
            success: function(retorno){

                console.log(retorno.status);
                if(retorno.status){//Se inserir o registro com sucesso mostra mensagem de sucesso
                    $.mobile.loading( 'hide' ); 
                    $('#statusMessage').css("display","none");
                    $('#statusMessage').css("display","block")
                    .fadeOut(4000, function() { $(this).css("display","none"); });

                    //Limpa os campo do formulário
                    $('#formRegistros').each (function(){
                        this.reset();
                    });
                }else{//Se der erro mostra mensagem de erro
                     $.mobile.loading( 'hide' );
                     $('#statusMessage').css("display","block")
                     .css("background","red")
                     .html("Erro ao inserir registo "+retorno.mensagem);
                }
            },
            error: function(j, t, e) {  alert(t);}

        });
    }
    
    //Insere o registro no banco de dados local
    function insereLocal(){
        
        successInsertRegistro = function(transaction,result){
            $.mobile.loading( 'hide' );
            if(result.rowsAffected){
                $('#statusMessage').css("display","none");
                $('#statusMessage').css("display","block")
                .css("background","orange")
                .html("Erro ao conectar-se com o servidor, o registro será sincronizado na próxima vez que você entrar no programa e a conexão estiver OK! ")
                .fadeOut(20000, function() { $(this).css("display","none"); });
        
                //Limpa os campo do formulário
                $('#formRegistros').each (function(){
                    this.reset();
                });
                    
            }else{
                 $('#statusMessage').css("display","block")
                .css("background","red")
                .html("Erro ao conectar-se com o servidor, erro ao inserir registro no banco de dados local ");
            }
        };
        if(window.openDatabase){
            //Executa sql para inserir registro
            localDb.execute("INSERT INTO registro (dataEHora, tipoRegistro, valor, detalhes, razao) VALUES ('"+new Date()+"','"+dados.tipoRegistro+"','"+dados.valor+"','"+dados.detalhes+"','"+dados.classificacao+"')",successInsertRegistro);
        }else{
             $('#statusMessage').css("display","block")
                .css("background","red")
                .html("Erro ao lançar despesa, você esta offline e seu Browser não suporta WebSql");
        }
    }


    
return false;
}
