class TestadorDeAliquotas{
    constructor(fullAliquotArray=[]){
        this.setFullAliquota = this.setFullAliquota.bind(this);
        this.estrutura = {
            lastCenter: "",
            lastTube: "",
            lastCq: "",
            isStorage:false,
            lastAliquot: "",
            
            filteredExamArray: [],
            filteredStorageArray: [],
            aliquotArray: [],
            usuarioArray: [],
            cqArray:["CQ 1", "CQ 2", "CQ 3", "CQ 4"],
            cqDefault:["","CQ"],
            elementsArray: []
        };

        this._inicializeElementsArray();

        if(fullAliquotArray.length) {
            this.setFullAliquotaArray(fullAliquotArray);
            this._clearStatus();
        };
    }
    
    
    _inicializeElementsArray(){
        var elementsArray = this.estrutura.elementsArray;
    
        for(var i = 0; i<100;i++){
            var examElement = document.querySelector(`#EXAMAliquot${i}`);
            var storageElement = document.querySelector(`#STORAGEAliquot${i}`);
            
            if(!examElement && !storageElement) break;
    
            if(examElement){
                var beforeElement = examElement.previousElementSibling
                elementsArray.push({
                    id:examElement.id,
                    index: i,
                    isStorage:false,
                    label: beforeElement.innerText,
                    element:examElement,
                    beforeElement: beforeElement
                });
            }
    
            if(storageElement){
                var beforeElement = storageElement.previousElementSibling
                elementsArray.push({
                    id:storageElement.id,
                    index: i,
                    isStorage:true,
                    label: beforeElement.innerText,
                    element:storageElement,
                    beforeElement: beforeElement
                });
            }
        }

        return this;
    }
    
    _newStatus(elemento){
        elemento["verify"] = {
            verificado: false,
            erros: false,
            naoExiste: false,
            desordenado: false,
            caseSensitive: false,
            ordemCorreta: 0
        };

        return this;
    }
    _clearStatus(){
        this.estrutura.elementsArray.forEach(function(element) {
            this._newStatus(element);
            this._resetErrorInElement(element);
        }, this);

        this.estrutura.aliquotArray.forEach(function(aliquota) {
            this._newStatus(aliquota);
        }, this);

        return this;
    }

    _setInElement(element, msg="", color=""){
        element.beforeElement.innerText = element.label + msg;
        element.beforeElement.style.color = color;
        return this;
    }

    _setErrorInElement(element, error="", color="red"){
        this._setInElement(element,error,color);
        return this;
    }
    
    _resetErrorInElement(element){
        this._setInElement(element);
        return this;
    }

    setCentro(centro=""){
        this.estrutura.lastCenter = centro.toUpperCase();
        return this;
    }

    setTubo(tubo=""){
        this.estrutura.lastTube = tubo;
        return this;
    }

    setCq(cq=""){
        this.estrutura.lastCq = cq.toUpperCase();
        return this;
    }

    setArmazenamento(armazenamento=true){
        this.estrutura.isStorage = armazenamento;
        return this;
    }

    setExame(exame=true){
        this.estrutura.isStorage = !exame;
        return this;
    }

    _aliquotPush(){
        var estrutura = this.estrutura;
        estrutura.aliquotArray.push({
            centro: estrutura.lastCenter,
            tubo: estrutura.lastTube,
            cq: estrutura.lastCq,
            isStorage: estrutura.isStorage,
            aliquot: estrutura.lastAliquot
        });
    }
    
    _usuarioPush(codigo, cq, centro){
        var estrutura = this.estrutura;
        estrutura.usuarioArray.push({
            codigo: codigo,
            cq: cq,
            centro: centro
        });
    }
    
    setUsuario(codigo="", cq="", centro=""){
        this._usuarioPush(codigo, cq.toUpperCase(), centro.toUpperCase());
        return this;
    }
    
    setAliquota(aliquota=""){
        this.estrutura.lastAliquot = aliquota;
        this._aliquotPush();
        return this;
    }

    setAliquotaCqAutomatico(aliquota=""){
        var cqAtual = "";
        
        this.estrutura.cqArray.forEach(function(cq) {
            if(aliquota.toUpperCase().includes(cq.toUpperCase())){
                cqAtual = cq.toUpperCase();
            }
        });

        this.setCq(cqAtual);
        this.setAliquota(aliquota);
        return this;
    }
    

    setFullAliquotaArray(fullAliquotArray=[]){
        var self = this;

        fullAliquotArray.forEach(function(fullAliquot) {
            self.setFullAliquota(fullAliquot.centro, fullAliquot.tubo, fullAliquot.cq, fullAliquot.exame, fullAliquot.aliquota);
        });
    }
    
    setFullAliquota(centro="",tubo="", cq="", exame=true, aliquota=""){
        this.setCentro(centro);
        this.setTubo(tubo);
        this.setCq(cq);
        this.setExame(exame);
        this.setAliquota(aliquota);
        return this;
    }

    setFullAliquotaCqAutomatico(centro="",tubo="", exame=true, aliquotaComCq=""){
        this.setCentro(centro);
        this.setTubo(tubo);
        this.setExame(exame);
        this.setAliquotaCqAutomatico(aliquotaComCq);
        return this;
    }

    _filterAliquotsByCenter(aliquotsArray, centro){
        return this._filterArray(aliquotsArray,"centro",centro);
    }

    _filterAliquotsByTube(aliquotsArray, tubo){
        return this._filterArray(aliquotsArray,"tubo",tubo);
    }

    _filterAliquotsByExam(aliquotsArray, exam=true){
        return this._filterArray(aliquotsArray,"isStorage",!exam);
    }

    _filterAliquotsByStorage(aliquotsArray, storage=true){
        return this._filterArray(aliquotsArray,"isStorage",storage);
    }

    _filterAliquotsByCq(aliquotsArray, cq){
        var validCqArray = this.estrutura.cqDefault.slice();

        if(this.estrutura.cqArray.includes(cq)) validCqArray.push(cq);

        return aliquotsArray.filter(function(aliquot){
            return validCqArray.includes(aliquot.cq);
        });
    }

    _filterArray(array=[], parm="", value=""){
        return array.filter(function(element){
            return element[parm] === value;
        });
    }

    _filterAliquot(centro="", tubo="", cq=""){
        var array = this.estrutura.aliquotArray.slice();

        array = this._filterAliquotsByCenter(array,centro);
        array = this._filterAliquotsByTube(array, tubo);
        array = this._filterAliquotsByCq(array, cq);

        this.estrutura.filteredExamArray = this._filterAliquotsByExam(array);
        this.estrutura.filteredStorageArray = this._filterAliquotsByStorage(array);

        return array;
    }

    verificaErros(centro="", tubo="", cq=""){
        this._filterAliquot(centro, tubo, cq);
        this._clearStatus();
        
        var aliquotasExame = this.estrutura.filteredExamArray;
        var aliquotasArmazenamento = this.estrutura.filteredStorageArray;

        var elementosExame = this._filterArray(this.estrutura.elementsArray, "isStorage", false);
        var elementosArmazenamento = this._filterArray(this.estrutura.elementsArray, "isStorage", true);

        var errosAliquotasExame = [];
        var errosElementosExame = [];
        var errosAliquotasArmazenamento = [];
        var errosElementosArmazenamento = [];

        this._compare(aliquotasExame, elementosExame, errosAliquotasExame, errosElementosExame);
        this._compare(aliquotasArmazenamento, elementosArmazenamento, errosAliquotasArmazenamento, errosElementosArmazenamento);

        if(errosAliquotasExame.length || errosElementosExame.length || errosAliquotasArmazenamento.length || errosElementosArmazenamento.length){
            console.group("Confira os erros encontrados:");
            
            if(errosAliquotasExame.length || errosElementosExame.length){
                console.group("Aliquotas de Exame");
                
                this._showArrayErrorsConsole("Aliquotas do Documento:",errosAliquotasExame);
                this._showArrayErrorsConsole("Aliquotas da Tela:",errosElementosExame);

                console.groupEnd();
            }

            if(errosAliquotasArmazenamento.length || errosElementosArmazenamento.length){
                console.group("Aliquotas de Armazenamento");
                
                this._showArrayErrorsConsole("Aliquotas do Documento:", errosAliquotasArmazenamento);
                this._showArrayErrorsConsole("Aliquotas da Tela:", errosElementosArmazenamento);

                console.groupEnd();
            }

            console.groupEnd();
        } else {
            console.log("Não foram encontrados Erros");
        }
    }

    _showArrayErrorsConsole(msg, array){
        if(array.length){
            console.group(msg)
                array.forEach(function(item){
                    console.log(item);
                },this);
            console.groupEnd()
        }
    }

    _compare(aliquots, elements, errosAliquotas, errosElementos){
        aliquots.forEach(function(aliquota,index) {
            aliquota["index"] = index;
            
            var elemento = elements.find(function(elemento){
                return (!elemento.verify.verificado
                    && elemento.label.trim() === aliquota.aliquot.trim());
            });

            if(elemento){
                this._setStatusVerificado(elemento);
                this._setStatusVerificado(aliquota);
            } else {
                this._setStatusNaoExiste(aliquota);
            }

            if(index < elements.length){
                var elementoAtual = elements[index];
                if(aliquota.verify.verificado && !elementoAtual.verify.erros){
                    if(aliquota.aliquot !== elementoAtual.label){
                        this._setStatusDesordenado(elementoAtual);
                    }
                }
            }
        }, this);

        aliquots.forEach(function(aliquota){
            if(aliquota.verify.erros){
                var tmpMsg = this._getMsgError(aliquota, aliquota.aliquot, "na tela");
                if(tmpMsg) errosAliquotas.push(tmpMsg);
            }
        },this);

        elements.forEach(function(elemento){
            if(!elemento.verify.verificado){
                this._newStatus(elemento);
                this._setStatusNaoExiste(elemento);
            }
            if(elemento.verify.erros){
                var tmpMsg = this._getMsgError(elemento, elemento.label, "no arquivo");
                if(tmpMsg) errosElementos.push(tmpMsg);
            }
        }, this);
    }

    _getMsgError(element, aliquota="", complemento=""){
        var msg = "";

        if(element.verify.erros){
            msg = `Erro(s) na Aliquota (${aliquota} - Posição ${element.index+1}): \n`
            if(element.verify.naoExiste){ 
                msg = `${msg}  - Não foi encontrada ${complemento} \n`;
            } else {
                if(element.verify.desordenado) msg = `${msg}  - Está na Posição Errada \n`;
                if(element.verify.caseSensitive) msg = `${msg}  - Verifique os caracteres maísculos e minusculos, pois são divergentes \n`;
            }
        }

        return msg;
    }

    _setStatusVerificado(elemento, value=true){
        this._setStatus(elemento, "verificado", value);
        return this;
    }
    
    _setStatusErros(elemento, value=true){
        this._setStatus(elemento, "erros", value);
        return this;
    }

    _setStatusNaoExiste(elemento, value=true){
        this._setStatus(elemento, "naoExiste", value);
        this._setStatusErros(elemento);
        if(elemento.beforeElement) this._setInElement(elemento,"", "red");
        return this;
    }
    
    _setStatusDesordenado(elemento, value=true){
        this._setStatus(elemento, "desordenado", value);
        this._setStatusErros(elemento);
        if(elemento.beforeElement) this._setInElement(elemento,"", "#6E141B");
        return this;
    }
    
    _setStatusCase(elemento, value=true){
        this._setStatus(elemento, "caseSensitive", value);
        this._setStatusErros(elemento);
        return this;
    }

    _setStatus(elemento, parametro, valor){
        elemento["verify"][parametro] = valor;
        return this;
    }
}