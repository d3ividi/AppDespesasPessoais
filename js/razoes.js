//Função utilizada para cadastrar razões no banco de dados local
function cadastraRazao(){
 
        var localDb = inicializaBanco();//inicializa o banco de dados local
        

        var id = $('input[name=idUnico]').val();//Captura o id da razão
        var tipoRazao = $("input[name='tipoRegistro']:checked").val();//Captura o tipo da razão
        var valor = $('input[name=razao]').val();//Captura a razão
        
        if(id){
            localDb.execute("UPDATE razao SET razao='"+valor+"',tipo='"+tipoRazao+"' WHERE id="+id,successInsert);
        }else{
            localDb.execute("INSERT INTO razao (razao, tipo) VALUES ('"+valor+"','"+tipoRazao+"')",successInsert);
        }
        
       
        //Mostra o ícone de loading
        $.mobile.loading( 'show', {
                text: 'Enviando',
                textVisible: true,
                theme: 'z',
                html: ""
        });
        
        //Limpa o formulário
        limpaFormRazao();
        
        $.mobile.loading( 'hide' );//esconde o ícone de loading 
        $('#statusMessage').css("display","block")//Mostra uma mesagem de sucesso por um tempo determinado
        .fadeOut(8000, function() { $(this).css("display","none"); });


        return false;
}



//Função que carrega no formulário uma razão para ser editada
function editaRazao(){
    
    if(QueryString.id){
        //Pega e decodigica os valores vindos pela URL
        var id = decodeURI(QueryString.id);
        var razao = decodeURI(QueryString.razao);
        var tipo = decodeURI(QueryString.tipo);
        
        //Carrega os valores nos inputs
        $("#razao").val(razao);
        $("input[name=tipoRegistro][value="+tipo+"]").prop("checked","true");
        $("#formRazoes").append("<input type='hidden' name='idUnico' value='"+id+"'>");
        //$("input[name=id]").val(id);
        $("input[name=enviar]").val("Salvar");
        $("input[name=cancelar]").val("Deletar");
        $("input[name=cancelar]").attr("data-icon","delete");
    }
    
}

//Função que lista todas as razẽos cadastradas no banco de dados local
function listaRazao(){
    
    var localDb = inicializaBanco();
    
    //Função que é executada quando o select das razões é exectado com sucesso
    successSelect = function(transaction, result){
        var razoes = result.rows;
        console.log(result.rows.length);
        //Adiciona um elemento divisor na lista HTML
        $('#razoes').append("<li data-role=\"list-divider\">"+razoes.item(0).tipo+"</li>");
        for(var i=0; i<razoes.length;i++){
            //adiciona um elemento filho na lista
            $('#razoes').append("<li data-icon=\"edit\"><a data-ajax=\"false\" href=\"cadastraRazoes.html?id="+razoes.item(i).id+"&razao="+razoes.item(i).razao+"&tipo="+razoes.item(i).tipo+"\">"+razoes.item(i).razao+"</a></li>");
        };
        //Atualiza a lista com os elementos filhos adicionados
        $('#razoes').trigger('create');    
        $('#razoes').listview('refresh');
    };
    
    //Seleciona as razões do tipo Saída
    localDb.execute("SELECT * FROM razao WHERE tipo='Saída'",successSelect);
    //Seleciona as razões do tipo Entrada 
    localDb.execute("SELECT * FROM razao WHERE tipo='Entrada'",successSelect);
}


$(document).ready(function(){
    $('input[name=cancelar]').click(function(){
        $( "#popupDialog" ).popup( "open" );
    });
    
    $('#dialog-confirm-true').click(function(){
        
        successDeleteRazao = function(){
            $(location).attr('href',"listaRazoes.html");
        };
        var id = $('input[name=idUnico]').val();
        console.log("Vou excluir esse id "+id);
        var localDb = inicializaBanco();
        localDb.execute("DELETE FROM razao WHERE id='"+id+"'",successDeleteRazao);
        
    });
    
    $('#dialog-confirm-false').click(function(){
        console.log("Não exclui nada");
    });
    
});

function limpaFormRazao(){
    //Limpa os campo do formulário
    $('#formRazoes').each (function(){
        this.reset();
    });
}

