import {useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCustomer, updateCustomer } from '../../api/axios';
import {TextField, Button, Box} from '@mui/material';

const EditCustomer: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const 