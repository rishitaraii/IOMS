import { Typography } from "@mui/material";
import { useEffect, useState} from "react";
import {fetchProducts, deleteProduct}from "../../api/axios";
import {Button, Box,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  status: string;
}

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

  const handleAddProduct = () => {
    console.log("Add Product button clicked");
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

      <TableContainer component={Paper}>
        <Table>
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
                  <IconButton onClick={() => console.log("Edit product", product)}><Edit /></IconButton>
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

