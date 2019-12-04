var express = require("express");
var router = express.Router();
const productModel = require("../models/product.model");
const { ownerAuth } = require("./authMidleware");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const fs = require("fs");
var multerS3 = require('multer-s3')
var aws = require('aws-sdk')

aws.config.update({
  secretAccessKey: process.env.SECRETKEY,
  accessKeyId: process.env.ACCESSID,
  region: 'us-east-2'
});

const s3 = new aws.S3();

const uploadFile = async (file) => {
  // Read content from the file
  const fileContent = fs.readFileSync(file.path);

  // Setting up S3 upload parameters
  const params = {
      Bucket: 'apimarket',
      Key: file.filename, // File name you want to save as in S3
      Body: fileContent
  };
  
  // Uploading files to the bucket
  
var s3UploadPromise = new Promise(function(resolve, reject) {
  s3.upload(params, function(err, data) {
      if (err) {
          reject(err);
      } else {
          resolve(data);
      }
  });
});
return s3UploadPromise;

};

var cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 }
]);
router.post("/", cpUpload, async (req, res, next) => {
  try {
    //console.log(req.files["image"][0]);
    //console.log(req.files["video"][0]);

    //console.log(req.files)
    
    const image = await uploadFile(req.files["image"][0])
    const video = await uploadFile(req.files["video"][0])
    

    const { name, price, owner } = req.body;

    const product = await productModel.create({
      name,
      price,
      owner,
      image: {
        data: image.Location,
        contentType: req.files["image"][0].mimetype
      },
      video: {
        data: video.Location,
        contentType: req.files["video"][0].mimetype
      }
    });
    

    console.log(product);
    res.status(200).json({ message: "Product Added" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error adding product" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const products = await productModel.find();
    
    res.status(200).json(products);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await productModel.findOne({ _id: req.params.id });
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: "Producto no encontrado" });
  }
});

router.put("/", cpUpload, async (req, res, next) => {
  try {
    const product = await productModel.findOne({ _id: req.body.id });
    console.log(product);
    console.log(req.body.owner);

    const image = await uploadFile(req.files["image"][0])
    const video = await uploadFile(req.files["video"][0])
    if (product.owner !== req.body.owner) {
      res.status(500).json({ message: "Usuario no es owner" });
    } else {
      if (!req.files["image"] && !req.files["video"]) {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price
            }
          },
          { useFindAndModify: false }
        );
        console.log("ninguno existe");
        res.status(200).json({ message: "Producto actualizado" });
      } else if (!req.files["image"]) {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              video: {
                data: video.Location,
                contentType: req.files["video"][0].mimetype
              }
            }
          },
          { useFindAndModify: false }
        );
        console.log("imagen no existe");
        res.status(200).json({ message: "Producto actualizado" });
      } else if (!req.files["video"]) {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              image: {
                data: image.Location,
                contentType: req.files["image"][0].mimetype
              }
            }
          },
          { useFindAndModify: false }
        );
        console.log("video no existe");
        res.status(200).json({ message: "Producto actualizado" });
      } else {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              image: {
                data: image.Location,
                contentType: req.files["image"][0].mimetype
              },
              video: {
                data: video.Location,
                contentType: req.files["video"][0].mimetype
              }
            }
          },
          { useFindAndModify: false }
        );
        console.log("todos existen");
        res.status(200).json({ message: "Producto actualizado" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Producto no encontrado" });
  }
});

router.delete("/:id/:owner", ownerAuth, async (req, res, next) => {
  try {
    await productModel.findOneAndDelete(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    res.status(200).json({ message: "Producto eliminado" });
  } catch (e) {
    res.status(500).json({ message: "Producto no encontrado" });
  }
});



module.exports = router;
