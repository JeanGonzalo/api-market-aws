const productModel = require("../models/product.model");

module.exports.ownerAuth = async (req,res,next) =>{
  try {
    const product = await productModel.findOne({_id:req.params.id})
    if(product.owner!==req.params.owner){
      res.status(500).json({ message: "Usuario no es owner" });
    } else 
    next()
  } catch(err) {
    res.status(500).json({ message: "Usuario no es owner" });
  }
  
  
}