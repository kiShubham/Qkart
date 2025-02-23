import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import ProductCard from "./ProductCard";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */

export const generateCartItemsFrom = (cartData, productsData) => {
  // cart data is items ,and produxtData is productList ;
  //  cartData = items // [ {} , {} ...];
  //  productsData = productList // [ {} ,{} ...]
  // console.log("cd :" + cartData);
  // console.log("pd :" + productsData);

  // let cartItem = []; //
  // for (var i = 0; i < cartData.length; i++) {
  //   for (var j = 0; j < productsData.length; j++) {
  //     if (cartData[i].productId === productsData[j]._id) {
  //       cartItem.push(productsData[j]);
  //     }
  //   }
  // }
  // cartItem.forEach((e) => (e.qty = 1));
  // console.log(cartItem, "cartItems");
  // return cartItem;
  if (!cartData) return;
  let cart = cartData.map((e) => ({
    ...e,
    ...productsData.find((elem) => elem._id === e.productId),
  }));
  return cart;
};
/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  // console.log(items);
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].cost * items[i].qty;
  }
  return total;
};

const getTotalItems = (items = []) => {
  var totalProducts = items.length;
  return totalProducts;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
export const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
// const Cart = ({ products, items, handleQuantity }) => {
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useHistory();
  const checkout = () => {
    history.push("/checkout");
  };
  const token = localStorage.getItem("token");
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item) => {
          // console.log(item);
          return (
            <Box
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              key={item.productId}
            >
              <Box className="image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{item.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {isReadOnly ? (
                    <Stack direction="row" alignItems="center">
                      <Box padding="0.5rem" data-testid="item-qty">
                        qty:{item.qty}
                      </Box>
                    </Stack>
                  ) : (
                    <ItemQuantity
                      value={item.qty}
                      handleAdd={() =>
                        handleQuantity(
                          token,
                          items,
                          products,
                          item._id,
                          item.qty + 1,
                          { preventDuplicate: true }
                        )
                      }
                      handleDelete={() =>
                        handleQuantity(
                          token,
                          items,
                          products,
                          item._id,
                          item.qty - 1,
                          { preventDuplicate: true }
                        )
                      }
                    />
                  )}

                  <Box padding="0.5rem" fontWeight="700">
                    ${item.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {isReadOnly ? (
          <></>
        ) : (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={checkout}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly ? (
        <Box className="orderDetails">
          <Box
            padding="1rem"
            display="flex"
            justifyContent="flex-start"
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
          >
            Order Details
          </Box>
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Products
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              {/* {items.length} */}
              {getTotalItems(items)}
              {/* {console.log(getTotalItems(items))} */}
            </Box>
          </Box>
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Subtotal
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Shipping Charges
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              $0
            </Box>
          </Box>
          <Box
            padding="0.5rem"
            pb="2rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              color="#3C3C3C"
              alignSelf="center"
              fontWeight="700"
              fontSize="1.5rem"
            >
              Total
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              fontWeight="700"
              fontSize="1.5rem"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default Cart;
