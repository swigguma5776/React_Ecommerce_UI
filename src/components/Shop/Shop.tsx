import * as React  from 'react'; 
import { useState }  from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';   
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import InfoIcon from '@mui/icons-material/Info';
import { useForm, SubmitHandler } from 'react-hook-form';



// internal imports
import { NavBar } from '../sharedComponents';
import {  theme } from '../../Theme/themes';
import { useGetShop, ShopState } from '../../customHooks';
import { InputText } from '../sharedComponents';



const shopStyles = {
    main: {
        backgroundColor: 'secondary',
        height: '100%',
        width: '100%',
        color: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px'
    },
    grid: {
        marginTop: '25px', 
        marginRight: 'auto', 
        marginLeft: 'auto', 
        width: '70vw'
    },
    card: {
        width: "300px", 
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1B2929",
        border: '1px solid',
        borderColor: 'primary',
        borderRadius: '10px'
    },
    cardMedia: {
        width: '95%',
        margin: 'auto',
        marginTop: '5px',
        aspectRatio: '1/1',
        border: '1px solid',
        borderColor: 'primary',
        borderRadius: '10px'
    },
    button: {
        color: 'white', 
        borderRadius: '50px',
        height: '45px',
        width: '250px'
    },
    stack: {
        width: '75%', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    }
}

interface SubmitState {
    quantity: string
}


export const Shop = () => {
    const { shopData, getData } = useGetShop(); 
    console.log(shopData)
    return (
        <div>
            <NavBar />
            <h1>Shop</h1>
        </div>
    )
}