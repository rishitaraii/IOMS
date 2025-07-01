import React, { useEffect, useState } from "react";
import {Box,Button,TextField,Typography,Stack,} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {fetchCustomer,createCustomer,updateCustomer} from "../../api/axios";
import type { Customer, CustomerInput } from "../../types/types";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<CustomerInput>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const load = async () => {
      if (id) {
        const res = await fetchCustomer(parseInt(id));
        const customer: Customer = res.data;
        setForm({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        });
      }
    };
    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await updateCustomer(parseInt(id), form);
        alert("Customer updated");
      } else {
        await createCustomer(form);
        alert("Customer created");
      }
      navigate("/customers");
    } catch (err) {
      console.error("Failed to save customer", err);
      alert("Something went wrong");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          {id ? "Edit Customer" : "Create Customer"}
        </Typography>
        <IconButton onClick={() => navigate("/customers")}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Stack spacing={3} mt={2}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />
        <Box>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {id ? "Update Customer" : "Create Customer"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default CustomerForm;
