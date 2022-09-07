const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

const categoryFileTxt = './assets/import/production/familles.txt'
const subCategoryFileTxt = './assets/import/production/sous-famille.txt'

router.get('/category', async (req, res, next) => {
    const jsonToCsvData = await csv({
        noheader: false,
        headers: ['codeFamille', 'libelleFamille',],
        trim: true,
    }).fromFile(categoryFileTxt);

    if (jsonToCsvData) {
        const resultMessage = [];
        jsonToCsvData.forEach(categoryObj => {
            Category.findOneAndUpdate({ codeFamille: categoryObj.codeFamille }, { ...categoryObj }, (error, category) => {
                if (error) {
                    console.log("🚀 ~ file: category.route.js ~ line 19 ~ Category.findOneAndUpdate ~ error", error)
                    return res.status(500).json({ error: error })
                }
                else if (category) {
                    // console.log("🚀 ~ file: category.route.js ~ line 23 ~ Category.findOneAndUpdate ~ category", category)
                    resultMessage.push(category)
                    // return res.status(200).json({ category: category })

                }
                else if (!category) {
                    const category = new Category({ ...categoryObj });

                    category.save((error, result) => {
                        if (error) {
                            console.log('error:', error);
                            return res.status(500).json({ error: error })
                        }
                        if (result) {
                            // console.log("🚀 ~ file: category.route.js ~ line 36 ~ category.save ~ result", result)
                            resultMessage.push(result)
                            // return res.status(202).json({ resultSaveCategory: result })
                        }

                    })
                }


            })
        })
        return res.status(200).json({ status: "Catégorie enregistrées" })
    } else {
        return res.status(500).json({ status: "Une erreur s'est produite" })
    }



});


router.get('/subCategory', async (req, res, next) => {
    const jsonToCsvSubCategorie = await csv({
        noheader: false,
        headers: ['codeSousFamille', 'libelleSousFamille', 'codeFamille'],
        trim: true,
    }).fromFile(subCategoryFileTxt);

    if (jsonToCsvSubCategorie) {
        const resultMessage = [];
        jsonToCsvSubCategorie.forEach(categoryObj => {
            SubCategory.findOneAndUpdate({ codeSousFamille: categoryObj.codeSousFamille }, { ...categoryObj }, (error, category) => {
                if (error) {
                    console.log("🚀 ~ file: category.route.js ~ line 19 ~ Category.findOneAndUpdate ~ error", error)
                    return res.status(500).json({ error: error })
                }
                else if (category) {
                    console.log("🚀 ~ file: category.route.js ~ line 23 ~ Category.findOneAndUpdate ~ category", category)
                    resultMessage.push(category)
                    // return res.status(200).json({ category: category })

                }
                else if (!category) {
                    const subCategory = new SubCategory({ ...categoryObj });

                    subCategory.save((error, result) => {
                        if (error) {
                            console.log('error:', error);
                            return res.status(500).json({ error: error })
                        }
                        if (result) {
                            console.log("🚀 ~ file: category.route.js ~ line 36 ~ category.save ~ result", result)
                            resultMessage.push(result)
                            // return res.status(202).json({ resultSaveCategory: result })
                        }

                    })
                }


            })
        })
        // resultMessage
        // console.log("🚀 ~ file: category.route.js ~ line 151 ~ router.get ~ resultMessage", resultMessage)
        return res.status(200).json({ status: "Catégorie enregistrées" })
    } else {
        return res.status(500).json({ status: "Une erreur s'est produite" })
    }




});



module.exports = router;