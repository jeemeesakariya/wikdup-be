const { sendResponse } = require('../common/helper');
const knex = require('../config/db');
const statuscode = require("../common/statuscode");

const createProductController = async (req, res) => {
  const trx = await knex.transaction();
  try {
    const { 
      sku_id, 
      product_name, 
      mrp, 
      cost_price, 
      gst_percent, 
      packaging_type, 
      images 
    } = req.body;
    console.log("ski_id:", sku_id);
    // Get the created_by from the authenticated user (assuming it's available in req.user)
    const created_by = req.user?.id || req.userId || 1; // fallback to 1 if not available

    // Validate SKU exists
    const skuExists = await trx('sku_master').where('id', sku_id).first();
    if (!skuExists) {
      await trx.rollback();
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'SKU not found'
      });
    }

    // Insert product with pending approval status and inactive state
    const [productId] = await trx('product_master').insert({
      sku_id,
      product_name,
      mrp,
      cost_price,
      gst_percent,
      packaging_type,
      is_active: false, // Set to false as specified
      approval_status: 'P', // Pending approval
      is_deleted: false, // Initialize as not deleted
      created_by,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });

    // Insert product images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((imageUrl, index) => ({
        product_id: productId,
        image_url: imageUrl,
        sort_order: index + 1,
        created_at: knex.fn.now()
      }));

      await trx('product_images').insert(imageInserts);
    }

    // Commit transaction
    await trx.commit();

    // Fetch the created product with images for response
    const createdProduct = await knex('product_master')
      .select(
        'product_master.*',
        'sku_master.sku_code'
      )
      .leftJoin('sku_master', 'product_master.sku_id', 'sku_master.id')
      .where('product_master.id', productId)
      .where('product_master.is_deleted', false)
      .first();

    const productImages = await knex('product_images')
      .select('image_url', 'sort_order')
      .where('product_id', productId)
      .orderBy('sort_order');

    const responseData = {
      ...createdProduct,
      images: productImages
    };

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_CREATED,
      message: 'Product created successfully and is pending approval',
      data: responseData
    });

  } catch (error) {
    await trx.rollback();
    console.error('Create Product Error:', error);
    
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Failed to create product'
    });
  }
};

const updateProductController = async (req, res) => {
  const trx = await knex.transaction();
  
  try {
    const productId = req.params.id;
    const updated_by = req.user?.id || req.userId || 1; // Get user ID from auth
    
    // Check if product exists
    const productExists = await trx('product_master')
      .where('id', productId)
      .where('is_deleted', false)
      .first();
    if (!productExists) {
      await trx.rollback();
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Product not found'
      });
    }
    
    const {
      sku_id,
      product_name, 
      mrp, 
      cost_price, 
      gst_percent, 
      packaging_type,
      is_active,
      approval_status,
      approved_by,
      is_deleted,
      images 
    } = req.body;
    
    // Prepare update object with only provided fields
    const updateData = {
      updated_by,
      updated_at: knex.fn.now()
    };
    
    // Add fields to update only if they are provided
    if (sku_id !== undefined) {
      // Validate SKU exists if sku_id is being updated
      const skuExists = await trx('sku_master').where('id', sku_id).first();
      if (!skuExists) {
        await trx.rollback();
        return sendResponse({
          res,
          success: false,
          statusCode: statuscode.R_NOT_FOUND,
          message: 'SKU not found'
        });
      }
      updateData.sku_id = sku_id;
    }
    
    if (product_name !== undefined) updateData.product_name = product_name;
    if (mrp !== undefined) updateData.mrp = mrp;
    if (cost_price !== undefined) updateData.cost_price = cost_price;
    if (gst_percent !== undefined) updateData.gst_percent = gst_percent;
    if (packaging_type !== undefined) updateData.packaging_type = packaging_type;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (approval_status !== undefined) updateData.approval_status = approval_status;
    if (is_deleted !== undefined) {
      updateData.is_deleted = is_deleted;
      // If marking as deleted, set deleted_by and deleted_at
      if (is_deleted === true) {
        updateData.deleted_by = updated_by;
        updateData.deleted_at = knex.fn.now();
      }
    }
    
    if (approved_by !== undefined) {
      // Validate that the approver user exists if approved_by is being set
      if (approved_by !== null) {
        const approverExists = await trx('user_master_data').where('id', approved_by).where('is_deleted', 0).first();
        if (!approverExists) {
          await trx.rollback();
          return sendResponse({
            res,
            success: false,
            statusCode: statuscode.R_NOT_FOUND,
            message: 'Approver user not found'
          });
        }
      }
      updateData.approved_by = approved_by;
    }
    
    // Update product details
    await trx('product_master')
      .where('id', productId)
      .update(updateData);
    
    // Handle images update if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await trx('product_images').where('product_id', productId).del();
      
      // Insert new images
      if (images.length > 0) {
        const imageInserts = images.map((imageUrl, index) => ({
          product_id: productId,
          image_url: imageUrl,
          sort_order: index + 1,
          created_at: knex.fn.now()
        }));
        
        await trx('product_images').insert(imageInserts);
      }
    }
    
    // Commit transaction
    await trx.commit();
    
    // Fetch updated product with images for response
    const updatedProduct = await knex('product_master')
      .select(
        'product_master.*',
        'sku_master.sku_code'
      )
      .leftJoin('sku_master', 'product_master.sku_id', 'sku_master.id')
      .where('product_master.id', productId)
      .where('product_master.is_deleted', false)
      .first();

    const productImages = await knex('product_images')
      .select('image_url', 'sort_order')
      .where('product_id', productId)
      .orderBy('sort_order');

    const responseData = {
      ...updatedProduct,
      images: productImages
    };
    
    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Product updated successfully',
      data: responseData
    });
    
  } catch (error) {
    await trx.rollback();
    console.error('Update Product Error:', error);
    
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Failed to update product'
    });
  }
};

const deleteProductController = async (req, res) => {
  const trx = await knex.transaction();
  
  try {
    const productId = req.params.id;
    const deleted_by = req.user?.id || req.userId || 1; // Get user ID from auth
    
    // Check if product exists and is not already deleted
    const productExists = await trx('product_master')
      .where('id', productId)
      .where('is_deleted', false)
      .first();
      
    if (!productExists) {
      await trx.rollback();
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Product not found or already deleted'
      });
    }
    
    // Soft delete the product by setting is_deleted to true
    await trx('product_master')
      .where('id', productId)
      .update({
        is_deleted: true,
        deleted_by,
        deleted_at: knex.fn.now(),
        updated_by: deleted_by,
        updated_at: knex.fn.now()
      });
    
    // Commit transaction
    await trx.commit();
    
    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    await trx.rollback();
    console.error('Delete Product Error:', error);
    
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Failed to delete product'
    });
  }
};

const getPendingProductsController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get pending products with pagination
    const pendingProducts = await knex('product_master')
      .select(
        'product_master.*',
        'sku_master.sku_code'
      )
      .leftJoin('sku_master', 'product_master.sku_id', 'sku_master.id')
      .where('product_master.approval_status', 'P')
      .where('product_master.is_deleted', false)
      .orderBy('product_master.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await knex('product_master')
      .where('approval_status', 'P')
      .where('is_deleted', false)
      .count('* as count')
      .first();

    // Get images for each product
    const productsWithImages = await Promise.all(
      pendingProducts.map(async (product) => {
        const images = await knex('product_images')
          .select('image_url', 'sort_order')
          .where('product_id', product.id)
          .orderBy('sort_order');
        
        return {
          ...product,
          images
        };
      })
    );

    const totalPages = Math.ceil(totalCount.count / limit);

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Pending products retrieved successfully',
      data: {
        products: productsWithImages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount.count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get Pending Products Error:', error);
    
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Failed to retrieve pending products'
    });
  }
};

const getActiveProductsController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get active approved products with pagination
    const activeProducts = await knex('product_master')
      .select(
        'product_master.*',
        'sku_master.sku_code'
      )
      .leftJoin('sku_master', 'product_master.sku_id', 'sku_master.id')
      .where('product_master.approval_status', 'A')
      .where('product_master.is_active', true)
      .where('product_master.is_deleted', false)
      .orderBy('product_master.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await knex('product_master')
      .where('approval_status', 'A')
      .where('is_active', true)
      .where('is_deleted', false)
      .count('* as count')
      .first();

    // Get images for each product
    const productsWithImages = await Promise.all(
      activeProducts.map(async (product) => {
        const images = await knex('product_images')
          .select('image_url', 'sort_order')
          .where('product_id', product.id)
          .orderBy('sort_order');
        
        return {
          ...product,
          images
        };
      })
    );

    const totalPages = Math.ceil(totalCount.count / limit);

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Active products retrieved successfully',
      data: {
        products: productsWithImages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount.count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get Active Products Error:', error);
    
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Failed to retrieve active products'
    });
  }
};

module.exports = {
  createProductController,
  updateProductController,
  deleteProductController,
  getPendingProductsController,
  getActiveProductsController
};
