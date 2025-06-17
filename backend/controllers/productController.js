import db from "../config/db.js";

export const getProducts = async (req, res) => {
    try{
        const products = await db.query("SELECT * FROM products ORDER BY created_at DESC");
        res.status(200).json({success:true, data: products.rows});
    } catch (error) {
        console.log("Error in getProducts function");
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const createProduct = async (req, res) => {
    const {name, price, image} = req.body;
    if(!name || !price || !image){
        return res.status(400).json({error: 'All fields are required'});
    }
    try{
        const newProduct= await db.query(`INSERT INTO products (name, price, image) 
        VALUES($1, $2, $3) 
        RETURNING *`, [name, price, image]);
        res.status(200).json({success:true, data: newProduct.rows[0]});
    } catch (e) {
        console.log("Error in creating product");
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await db.query(`SELECT * FROM products WHERE id = $1`,[id]);
        res.status(200).json({success:true, data: product.rows[0]});
    } catch (e) {
        console.log("Error in getProduct");
        res.status(500).json({success: false, message: "Internal server error"});
    }
}


export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const {name, price, image} = req.body;
    try{
        const updatedProduct = await db.query(
            `UPDATE products SET name = $1, price = $2, image = $3 WHERE id = $4
                              RETURNING *`, [name, price, image, id]);
        if(!updatedProduct.rows[0])
            return res.status(400).json({error: 'Product not found'});
        res.status(200).json({success:true, data: updatedProduct.rows[0]});
    } catch (e) {
        console.log("Error in updating product");
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await db.query(`DELETE FROM products WHERE id = $1 RETURNING *`,[id]);
        if(!deletedProduct.rows[0])
            return res.status(400).json({error: 'Product not found'});
        res.status(200).json({success:true, data: deletedProduct.rows[0]});
    } catch (e) {
        console.log("Error in deleting product");
        res.status(500).json({success: false, message: "Internal server error"});
    }
}