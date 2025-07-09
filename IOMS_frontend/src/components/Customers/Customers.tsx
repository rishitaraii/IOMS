import {Typography } from "@mui/material";
import {useEffect,useState} from "react";
import {fetchCustomers, deleteCustomer}from "../../api/axios";
import {Button, Box,IconButton} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import type { Customer } from "../../types/types";
import {useNavigate,} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import { GridLogicOperator } from "@mui/x-data-grid";
import type { GridColDef } from '@mui/x-data-grid'
import type { GridRenderCellParams } from "@mui/x-data-grid";
const Customers: React.FC = () => {
  const [Customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 10,
});

  const loadCustomers = async () => {
    try {
      const response = await fetchCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to fetch Customers", error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (error) {
      console.error("Failed to delete Customer", error);
    }
  };

  const handleAddCustomer = () => {
    navigate("/Customers/create");
  };

  const handleEditCustomer = (id: number) => {
    navigate(`/Customers/${id}/edit`);
  };

    

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "email", flex: 1 },
    { field: "phone", headerName: "phone", flex: 1, type: "number" },
    { field: "address", headerName: "address", flex: 1, type: "number",},
    {field: "actions", headerName: "Actions", flex: 1, sortable: false, filterable: false,
       renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton onClick={() => handleEditCustomer(params.row.id)}>
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
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </Button>
      </Box>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={Customers}
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

export default Customers;