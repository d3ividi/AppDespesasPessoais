URL_API = "https://script.google.com/macros/s/AKfycbxKLOZRvIvs1l2tHeAouV8yzSrKsPdfs8bjTR_Y0S0Q6zh4eCNw/exec";

$(document).ready(function(){
    
    if(window.openDatabase){
        localDb = inicializaBanco();//Inicializa o banco de dados local
        criaTabela(localDb);//Cria as tabelas dos banco se elas não existirem
        getChavePlanilha(localDb);
        sincronizaRazoes(localDb); //Sincroniza as razões 
    }
    
    //Checa a conexão com o script do Google
    //checkOnline(URL_API+"?funcao=testeConexao", setConexaoFalse, checaRegistrosLocais);
    if(checaConexao()){
        checaRegistrosLocais();
    }
    
    //
    //Executa essa função quando é clicado no radio buttom tipo de registro
    $('input[name=tipoRegistro]').click(function(){
        
        //Função executada quando o select das razões é executado
        carregaRazoes = function(transaction, result){

            $('select[name=classificacao]').empty();//limpa o select de razões
            $('select[name=classificacao]').append("<option></option>"); //insere um elemento option vazio
            var razoes = result.rows;
            for(var i=0; i<razoes.length;i++){
                //insere elementos option no select com as razoes
                $('select[name=classificacao]').append("<option value='"+razoes.item(i).razao+"'>"+razoes.item(i).razao+"</option>");
            };
            //Atualiza o select com options inseridos
            $('select[name=classificacao]').selectmenu("refresh");
            
        };
        //Executa um select no banco de dados
        localDb.execute("SELECT * FROM razao WHERE tipo='"+$(this).val()+"'",carregaRazoes);
        
    });   
});


//Busca as razẽos já cadastradas na planilha do Google docs
function sincronizaRazoes(localDb){
    successSelectRazao = function(transaction, result){
        console.log(result.rows.length);
        if(result.rows.length === 0){
            $.ajax({
            url: URL_API+"?callback=?",
            dataType: 'jsonp',
            timeout: 120000, 
            data:{funcao:"selecionaRazao",chavePlanilha:chavePlan},
            type:'POST',
            //Função que é executada caso a requisição ajax seja executada com sucesso
            success: function(retorno){
                               
                for(var i=0; i<retorno.length; i++){
                    localDb.execute("INSERT INTO razao (razao, tipo) VALUES ('"+retorno[i][1]+"','"+retorno[i][0]+"')",successInsert);
                }
                $.mobile.loading( 'hide' ); 
                return true;
            },
            error: function(retorno){
                $.mobile.loading( 'hide' );
                $('#statusMessage').css("display","block")
                .css("background","red")
                .html("Erro ao sincronizar razões! <br> Para executar este programa você deve autorizar\n\
                 o script clicando <a href='"+URL_API+"' target='_blank'> AQUI.</a><br>\n\
                 Você também deve ter uma planilha do Google pronta para receber os dados e configurar a chave acessando o ícone de configuração.");
                console.log(retorno);
            }

            });
            $.mobile.loading( 'show', {
                text: 'Sincronizando Razões',
                textVisible: true,
                theme: 'c',
                html: ""
            });
            
 
        }
        return false;
    };
    //Faz um select na tabela de razões do banco de dados local
    razoes = localDb.execute("SELECT * FROM razao",successSelectRazao);   
}


//Verifica se existem registros locais a serem enviados para planilha do Google docs 
function checaRegistrosLocais(){
    if(window.openDatabase){
        console.log("Verificando se existem registros para sincronizar");
        successSelectRegistro = function(transaction,result){
            var registros = result.rows;
            if(registros.length>0){
                $.mobile.loading( 'show', {
                    text: 'Sincronizando Registros',
                    textVisible: true,
                    theme: 'z',
                    html: ""
                });
                enviaRegistros(registros);
            }
        };
        //Faz um select na tabela registro do banco de dados local
        localDb.execute("SELECT * FROM registro",successSelectRegistro);
    }else{
        console.log("Este Browser não suporta WebSql");
    }
}


//Envia os registros locais para a planilha do Google Docs
function enviaRegistros(registros,dados,i){
    
    //Controla o contador de registros
    var i = !i ? 0 : i;
    
    //Monta o registro no objeto dados
    var dados = {};
    for (var item in registros.item(i)){
        dados[item] = registros.item(i)[item];
    }
    
    //Seta a função indicando para o script do Google que irá sincronizar um registro
    dados.funcao = "sincronizarRegistros";
    dados.chavePlan = chavePlan;

    //Sincronizando os dados via Ajax   
    $.ajax({
    url: URL_API+"?callback=?",
    dataType: 'json',
    timeout: 120000,
    async: false,
    data:dados,
    type:'POST',
    //Função que é executada caso a requisição ajax seja executada com sucesso
        success: function(retorno){
            if(retorno){
                //deleta do banco de dados local o registro que foi enviado para a planilha do Google
                localDb.execute("DELETE FROM registro WHERE id='"+registros.item(i).id+"'");

            }else{//Se der erro mostra mensagem de erro
                 $.mobile.loading( 'hide' );
                 $('#statusMessage').css("display","block")
                 .css("background","red")
                 .html("Erro ao sincronizar registros locais "+retorno);
            }
        }

    }).done(function(data) {//Executa quando a requisição ajax e terminada
        if(i< registros.length-1){
            i++;//Incrementa o contatod de registros
            enviaRegistros(registros,dados,i);
        }else{
            $.mobile.loading( 'hide' ); 
            $('#statusMessage').css("display","block")
            .html("Registros sincronizados com sucesso")
            .fadeOut(4000, function() { $(this).css("display","none"); });
        }
    });
    
}

