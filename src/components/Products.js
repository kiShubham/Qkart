import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { resolveModuleName } from "typescript";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
//by me
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";
import { ItemQuantity } from "./Cart";
// console.log(token); //null when not logged in,random string when logged in ;

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id productId - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productList, setProductList] = useState([]); // [] is very neccessary ;
  const [isLoading, setIsLoading] = useState(false);
  // const [search, setSearch] = useState("");
  // const [found, setFound] = useState(true);
  const [debouncerTimerId, setDebouncerTimerId] = useState(0);
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  // console.log(config.endpoint);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);

    try {
      let res = await axios.get(`${config.endpoint}/products`);
      // console.log(res);
      let listOfProducts = res.data;
      setProductList(listOfProducts);
      setIsLoading(false);
    } catch (e) {
      // setIsLoading(false);
      // console.log(error);
      //... enqueueSnackbar(error.response.data.message, { variant: "error" });
      if (e.response && e.responce.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. check that the backend running, reachable and returns valid JSON.",
          { variant: "error" }
        );
        return null;
      }
    }
  };
  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    fetchCart(token).then((elem) => {
      setCartItem(generateCartItemsFrom(elem, productList));
    });
  }, [productList]);

  // console.log(productList); //(12) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  // const searchHandler = (e) => {
  //   setSearch(e.target.value);
  //   if (e.target.value === "") setFound(true);
  //   debounceSearch(e, debouncerTimerId);
  // };

  const performSearch = async (text) => {
    // setIsLoading(true);
    try {
      let res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      // setIsLoading(false);
      let listOfProducts = res.data;
      setProductList(listOfProducts);
    } catch (e) {
      // ...setIsLoading(false);

      // ...if (error.response.status === 404) setProductList([]);
      // console.log(error.response.status); //=== 404 product not found
      // setFound(false);
      if (e.response.status === 404) {
        setProductList([]);
      } else if (e.response.status === 500) {
        enqueueSnackbar(e.responce.data.message, { variant: "error" });
        setProductList(productList);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    // setSearch(event.target.value); // agar ise ha pe set karenge tou rendering m issue hoga aur kabhi neeceh tak commmand jayegi nhi
    // setIsLoading(true);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    let newTimerId = setTimeout(async () => {
      performSearch(event.target.value);
    }, 500);

    setDebouncerTimerId(newTimerId);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res);
      setItems(res.data);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };
  // console.log(items+'items');

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    // setTimeout(() => {
    //   console.log(cartItem);
    // }, 5000);
    // for (var i = 0; i < items.length; i++) { // Not working properly ;
    //   if (productId === items[i].productId) {
    //     return true;
    //   }
    // }
    for (var i = 0; i < cartItem.length; i++) {
      if (productId === cartItem[i].productId) {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    } else if (
      isItemInCart(items, productId) === true &&
      options.preventDuplicate === false
    ) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    } else {
      try {
        let res = await axios.post(
          `${config.endpoint}/cart`,
          { productId: productId, qty: qty },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(res);
        // fetchCart(token);
        setCartItem(generateCartItemsFrom(res.data, productList));
        // console.log(items)
      } catch (error) {
        if (error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        }
      }
    }
  };

  return (
    <div>
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      {/* Search view for dekstop in Header.js*/}
      <Header hasHiddenAuthButtons={false}>
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          // value={search}
          onChange={(e) => {
            debounceSearch(e, debouncerTimerId); // yha pe dono call kar sakte h ,koi issue nhi h ;
            // setSearch(e.target.value);
          }}
        />
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        // value={search}
        onChange={(e) => debounceSearch(e, debouncerTimerId)}
      />
      {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      {localStorage.getItem("username") ? (
        <Grid container spacing={2} className="background">
          <Grid item xs={12} md={9}>
            <Grid container>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s{" "}
                    <span className="hero-highlight">FASTEST DELIVERY</span> to
                    your door step
                  </p>
                </Box>
              </Grid>
            </Grid>
            {isLoading ? (
              <div className="loadingIcon">
                <CircularProgress />
                <p>Loading Products</p>
              </div>
            ) : (
              <>
                {productList.length ? (
                  <Grid container spacing={2} mt={2} mb={4}>
                    {productList.map((product) => {
                      return (
                        <Grid
                          item
                          key={product._id}
                          xs={6}
                          sm={4}
                          md={3}
                          lg={3}
                        >
                          <ProductCard
                            product={product}
                            handleAddToCart={() =>
                              addToCart(
                                token,
                                items,
                                productList,
                                product._id,
                                1
                              )
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <div className="notFoundCard">
                    <SentimentDissatisfied />
                    <h2>No products found</h2>
                  </div>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <Cart
              products={productList}
              items={cartItem}
              handleQuantity={addToCart}
            />
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>
          {isLoading ? (
            <div className="loadingIcon">
              <CircularProgress />
              <p>Loading Products</p>
            </div>
          ) : (
            <>
              {productList.length ? (
                <Grid container spacing={2} mt={2} mb={4}>
                  {productList.map((product) => (
                    <Grid item key={product._id} xs={6} sm={4} md={3} lg={3}>
                      <ProductCard
                        product={product}
                        handleAddToCart={() =>
                          addToCart(token, items, productList, product._id, 1)
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div className="notFoundCard">
                  <SentimentDissatisfied />
                  <h2>No products found</h2>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Products;
