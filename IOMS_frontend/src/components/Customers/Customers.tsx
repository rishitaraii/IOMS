import { Typography } from "@mui/material";
import { useEffect, useState} from "react";
import {fetchCustomers, deleteCustomer}from "../../api/axios";
import {Button, Box,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
interface Customer {
  id: number; 
  name: string;
  email: string;  
  phone: string;
  address: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
   const loadCustomers = async () => {
    try { 
      const response = await fetchCustomers(); 
      console.log("Fetched customers:", response.data);
      setCustomers(response.data); 
    } catch (error) {
      console.error("Failed to fetch customers", error);  
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id); 
      loadCustomers(); 
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
  };
  const handleAddCustomer = () => {
    navigate("/customers/create");
  };

  const handleEditCustomer = async (id: number) => {
    navigate(`/customers/${id}/edit`)
  };
  
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

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditCustomer(customer.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(customer.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Customers;
