import {Typography } from "@mui/material";
import {useEffect,useState} from "react";
import {fetchProducts, deleteProduct}from "../../api/axios";
import {Button, Box,IconButton, Chip} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import type { Product } from "../../types/types";
import {useNavigate,} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import { GridLogicOperator } from "@mui/x-data-grid";
import type { GridColDef } from '@mui/x-data-grid'
import type { GridRenderCellParams } from "@mui/x-data-grid";
const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 10,
});
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive' | 'lowStock'>('all');


  const loadProducts = async () => {
    try {
      const response = await fetchProducts();
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
      loadProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const handleAddProduct = () => {
    navigate("/products/create");
  };

  const handleEditProduct = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const filteredProducts = products.filter((product) => {
    switch (filterType) {
      case 'active':
        return product.status === 'active';
      case 'inactive':
        return product.status === 'inactive';
      case 'lowStock':
        return product.stock_quantity <= 10;
      default:
        return true;
    }
  });
    

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sku", headerName: "SKU", flex: 1 },
    { field: "price", headerName: "Price", flex: 1, type: "number" },
    { field: "stock_quantity", 
      headerName: "Stock", 
      flex: 1, 
      type: "number",
      renderCell: (params)=>(
        <Chip
        label={params.value}
        color={params.value <= 10 ? "warning" : "default"}
        variant="outlined" />
      )
     },
    { field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "active" ? "success" : "error"}
          variant="outlined"
        />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton onClick={() => handleEditProduct(params.row.id)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

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
      <Box display="flex" gap={1}mb={2} >
          <Button onClick={() => setFilterType('all')} variant={filterType === 'all' ? 'contained' : 'outlined'} 
          sx={{borderRadius: "16px",
          textTransform: "none",
          color: filterType === "all" ? "white" : "inherit",
          backgroundColor: filterType === "all" ? "#1976d2" : "transparent",
          borderColor: "#1976d2",
          '&:hover': {
            backgroundColor: "#1976d2",
            color: "white",
          }
        }}> Show All</Button>
          <Button onClick={() => setFilterType('active')} variant={filterType === 'active' ? 'contained' : 'outlined'} sx={{
          borderRadius: "16px",
          textTransform: "none",
          color: filterType === "active" ? "white" : "green",
          backgroundColor: filterType === "active" ? "green" : "transparent",
          borderColor: "green",
          '&:hover': {
            backgroundColor: "green",
            color: "white"
          }
        }}>Active</Button>
          <Button onClick={() => setFilterType('inactive')} variant={filterType === 'inactive' ? 'contained' : 'outlined'} 
             sx={{
          borderRadius: "16px",
          textTransform: "none",
          color: filterType === "inactive" ? "white" : "red",
          backgroundColor: filterType === "inactive" ? "red" : "transparent",
          borderColor: "red",
          '&:hover': {
            backgroundColor: "red",
            color: "white"
          }
        }}>Inactive</Button>
          <Button onClick={() => setFilterType('lowStock')} variant={filterType === 'lowStock' ? 'contained' : 'outlined'}
             sx={{
        borderRadius: "16px",
        textTransform: "none",
        color: filterType === "lowStock" ? "white" : "#ed6c02",
        backgroundColor: filterType === "lowStock" ? "#ed6c02" : "transparent",
        borderColor: "#ed6c02",
        '&:hover': {
          backgroundColor: "#ed6c02",
          color: "white"
        }
      }}>Low Stock</Button>
      </Box>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          getRowId={(row) => row.id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterLogicOperator: GridLogicOperator.Or,
              },
            },
          }}
          slotProps={{
            toolbar: {
              quickFilterProps: {
                quickFilterParser: (searchInput: string) =>
                  searchInput
                    .split(',')
                    .map((value) => value.trim())
                    .filter((value) => value !== ''),
              },
            },
          }}
          showToolbar
        />
      </Box>
    </Box>
  );
};

export default Products;