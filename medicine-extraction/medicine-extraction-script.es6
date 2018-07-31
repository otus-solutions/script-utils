import fs from "fs";
const https = require("https");
const DomParser = require('dom-parser');
const stringify = require('csv-stringify');
let parser = new DomParser();
let letters = ["0-9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
let medicines  = [];
let csvObj = {
    "rows": []
};

function getMedicines(letter,page){
    https.get('https://consultaremedios.com.br/medicamentos/'+letter+'?pagina='+page, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end',() => {
            var dom = parser.parseFromString(data);
            if(dom.getElementsByClassName("product-block__title").length > 1){
                dom.getElementsByClassName("product-block__title").forEach((medicine) => {
                    var exists = medicines.find(function (save) {
                        return save === medicine.textContent
                    });
                    if(!exists) {
                        medicines.push(medicine.textContent);
                    }
                });
                getMedicines(letter,page+1)
            } else {
                csvObj.rows=[];
                medicines.sort().forEach((medicine) => {
                    var aux=[];
                    aux.push(medicine);
                    csvObj.rows.push(aux)
                });
                stringify(csvObj.rows, (err, output) => {
                    fs.writeFile('medicamentos.csv', output, 'utf8', (err) => {
                        if (err) {
                            console.log('Some error occured - file either not saved or corrupted file saved.');
                        } else {
                            console.log('It\'s saved!');
                        }
                    });
                });
            }

        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

letters.forEach( (letter) => {
    getMedicines(letter,1)
});
