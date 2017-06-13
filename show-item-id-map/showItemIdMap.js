function showItemIdMap() {
    var retorno = "";
    var sheet = document.querySelector('#sheet');

    for(var i = 0; i < sheet.children.length; i++){
        var nivelId = sheet.children[i].children[0];
        var nivelLabel = nivelId.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
        
        retorno = retorno + nivelId.id + ' - ' + nivelLabel.innerText + '\n';
    }

    console.log(retorno);
}