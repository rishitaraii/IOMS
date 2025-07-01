import { Typography } from "@mui/material";
import { useEffect, useState} from "react";
import {fetchProducts, deleteProduct}from "../../api/axios";
import {Button, Box,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import type { Product } from "../../types/types"; // Adjust the import path as necessary
import {useNavigate,} from "react-router-dom";
const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

    const loadProducts = async () => {
    try {
      const response = await fetchProducts();
      console.log("Fetched products:", response.data);
      setProducts(response.data); 
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

    const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      loadProducts(); // Refresh list
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/products/create");
  };
  const handleEditProduct = (id: number) => {
    navigate(`/products/${id}/edit`); 
  };

    return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(product.id)}><Delete /></IconButton>
                  <IconButton onClick={() => handleEditProduct(product.id)}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;

