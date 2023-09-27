import * as React  from 'react'; 
import { useState, useEffect } from 'react'; 
import {
    Box,
    Button,
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
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';

// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { ShopState } from '../../customHooks';
import { shopStyles } from '../Shop';
import { serverCalls } from '../../api';
import { useGetOrder } from '../../customHooks';



export interface CreateState {
    customer: string
    order: ShopState[]
}



export const Cart = () => {
    const { orderData, getData } = useGetOrder(); 
    const [ currentCart, setCart ] = useState<ShopState[]>([]);
    const db = getDatabase();
    const userId = localStorage.getItem('token')
    const cartRef = ref(db, `carts/${userId}/`); 

    console.log("This is our order: ", orderData)


    // make a useEffect hook that is listening for changes in the cart
    useEffect(() => {

        // we will use the onValue() to listen for changes in our cart
        onValue(cartRef, (snapshot) => {
            const data = snapshot.val()

            let cartList = []

            if (data){
                for (let [key,value] of Object.entries(data)){
                    let cartItem = value as ShopState
                    cartItem['id'] = key
                    cartList.push(cartItem)
                }
            }

            setCart(cartList as ShopState[])
        });

        // Cleanup the event listener when it unmounts/detaches 

        return () => {

            off(cartRef)
        };

    }, []);


    // functionality to Checkout our Cart & create an order 
    const checkout = async () => {

        let data: CreateState = {
            "customer": userId as string,
            "order": currentCart
        }

        // this makes API to our flask server to create an order
        const response = await serverCalls.createOrder(data)

        remove(cartRef)
        .then(() => {
            console.log("Cart cleared successfully")
            window.location.reload()
        })
        .catch((error) => {
            console.log("Error clearing cart: " + error.message)
        })

    }


    // We want to be able to update our Cart Quantity 
    const updateQuantity = async (id: string, operation: string) => {

        // using the .findIndex method to find the index of a certain object 
        const dataIndex = currentCart.findIndex((cart) => cart.id === id) //looping through our list of objects until it finds  match & will return the index of the match


        // make a new variable to update the currentCart state
        const updatedData = [...currentCart]
        if (operation === 'dec'){
            updatedData[dataIndex].quantity -= 1
        } else {
            updatedData[dataIndex].quantity += 1 
        }

        setCart(updatedData)
    }

    // We can increment & decrement quantity without updating the cart but once we hit update then it'll update the cart 
    const updateCart = async ( cartItem: ShopState ) => {

        const itemRef = ref(db, `carts/${userId}/${cartItem.id}`)


        // use the update() function to update a specific item
        update(itemRef, {
            quantity: cartItem.quantity 
        })
        .then(() => {
            console.log("Cart updated successfully")
        })
        .catch((error) => {
            console.log("Error updating cart: ", + error.message)
        })
    }

    // Add function to delete items from our cart 
    const deleteItem = async ( cartItem: ShopState ) => {

        const itemRef = ref(db, `carts/${userId}/${cartItem.id}`)

        // use the remove() function to remove a specific item
        remove(itemRef)
        .then(() => {
            console.log("Successfly Deleted Item")
        })
        .catch((error) => {
            console.log("Error deleting item: ", + error.message)
        })

    }


    return (
        <Box sx={shopStyles.main} >
            <NavBar />
            <Stack direction = 'column' sx={shopStyles.main}>
                <Stack direction = 'row' sx={{alignItems: 'center', marginTop: '100px', marginLeft: '200px'}}>
                    <Typography
                        variant = 'h4'
                        sx = {{marginRight: '20px'}}
                    >
                        Your Cart
                    </Typography>
                    <Button color = 'primary' variant = 'contained' onClick={ checkout }>Checkout 🪴</Button>
                </Stack>
                <Grid container spacing={3} sx={shopStyles.grid}>
                    {currentCart.map((shop: ShopState, index: number) => (
                        <Grid item key={index} xs={12} md={6} lg={4}>
                            <Card
                                sx={shopStyles.card}
                            >
                            <CardMedia
                                component='img'
                                sx={shopStyles.cardMedia}
                                image={shop.image}
                                alt={shop.name}
                            />
                            <CardContent>
                                <Stack direction = 'column' justifyContent='space-between' alignItems='center'>
                                    <Accordion sx={{color: 'white', backgroundColor: theme.palette.secondary.light }}>
                                        <AccordionSummary
                                            expandIcon={<InfoIcon sx={{color: theme.palette.primary.main}} />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>{shop.name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>{shop.description}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Stack direction ='row' alignItems='center' justifyContent='space-between' sx={shopStyles.stack2}>
                                        <Button
                                            size='large'
                                            variant='text'
                                            onClick={()=>{updateQuantity(shop.id, 'dec')}}
                                        >-</Button>
                                        <Typography variant = 'h6' sx={{color: 'white'}}>
                                            {shop.quantity}
                                        </Typography>
                                        <Button
                                            size='large'
                                            variant='text'
                                            onClick={()=>{updateQuantity(shop.id, 'inc')}}
                                        >+</Button>
                                    </Stack>
                                    <Button
                                        size='medium'
                                        variant='outlined'
                                        onClick={()=>{updateCart(shop)}}
                                        sx={shopStyles.button}
                                    >
                                        Update Quantity - ${(shop.quantity * parseFloat(shop.price)).toFixed(2)}
                                    </Button>
                                    <Button
                                        size='medium'
                                        variant='outlined'
                                        onClick={()=>{deleteItem(shop)}}
                                        sx={shopStyles.button}
                                    >
                                        Delete Item from Cart
                                    </Button>
                                </Stack>
                            </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Box>
    )
}