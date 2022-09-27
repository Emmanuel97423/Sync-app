
const Gammes = require("../models/gamme.model");

class ConvertGamme {
    constructor(product) {

        this._product = product;
        this._stock = product.stock;
        this._gamme = product.gamme;
        this._gammesValue = product.gammesValue;
        this._gammeLibelle = null;
        this._gammeValue = null;

    }

    get getGammes() { return this.convertGammesMethod() }

    convertGammesMethod() {
        if (this._gamme) {
            const gammesConvert = this._gamme.replace('¤', ' ').split(' ');
            gammesConvert.map((gamme) => {
                try {
                    Gammes.find({ gammeCode: gamme }, (err, result) => {

                        if (err) { return err; }
                        else {

                            return result
                        }
                    })
                } catch (error) {
                    console.log('error:', error)

                }
            })
        }



    }
    // get gammes() {
    //     return this._gammes;
    // }
    // get getGamme() { return this.gammesMethod() };
    // // set gamme(gamme) { this.gamme = gamme };

    // get getSplitGammes() { return this.splitGamme() };
    // get getSplitGammesValue() { return this.splitGammesValue() };
    // get getCombineGammes() { return this.combineGammes() };
    // get getFinalProduct() { return this.finalProduct() };



    // gammesMethod() {

    //     async function gammeValue(codeGamme) {
    //         try {
    //             await Gammes.find({ gammeCode: codeGamme }, (err, result) => {
    //                 if (err) {
    //                     console.error(err);
    //                 } else {
    //                     console.log('libelle:', result.libelle);
    //                     console.log('elementsGammeLibelle:', result.elementsGammeLibelle);
    //                     this._gamme = result.libelle;
    //                     this._gammesValue = result.elementsGammeLibelle;
    //                 }
    //             })
    //         } catch (error) {
    //             return
    //             console.log('error:', error)
    //         }
    //     }
    //     this.splitGamme();
    //     if (this.splitGamme().length > 0) {

    //         this.splitGamme().map((codeGamme) => {
    //             gammeValue(codeGamme)
    //         })
    //     }
    // }

    // splitGamme() {
    //     if (this._gammes) { return this._gammes.replace('¤', ' ').split(' ') };
    //     return;


    // }
    // splitGammesValue() {

    //     const gammesValue = this._gammesValue.replace('¤', ' ').split(' ');

    // }
    // combineGammes() {
    //     console.log('splitGamme():', this.splitGamme())
    //     console.log('splitGammesValue():', this.splitGammesValue())

    // }
    // finalProduct() {
    //     this.combineGammes()
    // }
};

module.exports = ConvertGamme

// module.exports = ConvertGamme;