import { AddShoppingCartOutlined } from "@mui/icons-material";
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <>
      <Card className="card">
        <CardMedia component="img" height="140" image={product.image} alt="" />
        <CardContent>
          <Typography gutterBottom>{product.name}</Typography>
          <Typography>${product.cost}</Typography>
          <Rating name="read-only" value={product.rating} readOnly />
        </CardContent>
        <CardActions className="card-actions">
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<AddShoppingCartOutlined />}
            onClick={handleAddToCart}
          >
            ADD TO CART
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ProductCard;
