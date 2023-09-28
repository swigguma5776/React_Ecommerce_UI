import * as _React  from 'react'; 
import { useState }  from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography,
    Snackbar,
    Alert } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';   
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import InfoIcon from '@mui/icons-material/Info';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getDatabase, ref, push } from 'firebase/database'; 



// internal imports
import { NavBar } from '../sharedComponents';
import {  theme } from '../../Theme/themes';
import { useGetShop, ShopState } from '../../customHooks';
import { InputText } from '../sharedComponents';
import { MessageType } from '../Auth';



export const shopStyles = {
    main: {
        backgroundColor: theme.palette.secondary.main,
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
        backgroundColor: theme.palette.secondary.light,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    cardMedia: {
        width: '95%',
        margin: 'auto',
        marginTop: '5px',
        aspectRatio: '1/1',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: 'white', 
        borderRadius: '50px',
        height: '45px',
        width: '250px',
        marginTop: '10px'
    },
    stack: {
        width: '75%', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    },
    stack2: {
        border: '1px solid', 
        borderColor: theme.palette.primary.main, 
        borderRadius: '50px', 
        width: '100%',
        marginTop: '10px'
    },
    typography: { 
        marginLeft: '15vw', 
        color: "white", 
        marginTop: '100px'
    }

}

export interface SubmitState {
    quantity: string
}

interface CartProps {
    cartItem: ShopState
}

const AddToCart = (cart: CartProps) => {
    // make my hooks or instatiate my objects
    const db = getDatabase(); 
    const { register, handleSubmit } = useForm<SubmitState>({})
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()


    const onSubmit: SubmitHandler<SubmitState> = async (data, event) => {
        if (event) event.preventDefault(); 

        const userId = localStorage.getItem('token') //grabbing that userId we stored when a user signed in

        const cartRef = ref(db, `carts/${userId}/`) //this is creating a reference in our database for our user 

        let myCart = cart.cartItem

        // were going to check to see if user is trying to add more quantity than available
        
        if (myCart.quantity > parseInt(data.quantity)){
            myCart.quantity = parseInt(data.quantity)
        }

        push(cartRef, myCart)
        .then((newCartRef) => {
            console.log("Cart item added with key: " + newCartRef.key)
            setMessage(`Successfully added item ${myCart.name} to Cart`)
            setMessageType('success')
            setOpen(true)
        })
        .then(()=>{
            setTimeout(()=>{window.location.reload()}, 3000)
        })
        .catch((error) => {
            console.log("Error adding cart item: " + error.message)
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        });
        // window.location.reload()
    }

    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Box>
                    <label htmlFor='quantity'>How much of {cart.cartItem.name} do you want to add?</label>
                    <InputText {...register('quantity')} name='quantity' placeholder='Quantity Here' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={()=> setOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}


export const Shop = () => {
    const { shopData } = useGetShop(); 
    const [ currentShop, setCurrentShop ] = useState<ShopState>();
    const [ cartOpen, setCartOpen ] = useState(false);


    console.log(shopData)
    return (
        <Box sx={shopStyles.main} >
            <NavBar />
            <Typography
                variant='h4'
                sx={shopStyles.typography}
            >
                The Shop
            </Typography>
            <Grid container spacing={3} sx={shopStyles.grid}>
                {shopData.map((shop: ShopState, index: number) => (
                    <Grid item key={index} xs={12} md={6} lg={4}>
                        <Card sx={shopStyles.card}>
                            <CardMedia
                                component='img'
                                sx={shopStyles.cardMedia}
                                image={shop.image}
                                alt={shop.name}
                            />
                            <CardContent>
                                <Stack direction = 'column' justifyContent='space-between' alignItems='center'>
                                    <Stack direction = 'row' alignItems='center' justifyContent='space-between'>
                                        <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                                            <AccordionSummary
                                                expandIcon={<InfoIcon sx={{color: theme.palette.primary.main }} />}
                                                aria-controls='panel1a-content'
                                                id='panel1-header'
                                            >
                                            <Typography>{shop.name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    {shop.description}
                                                </Typography>
                                            </AccordionDetails> 
                                        </Accordion>
                                    </Stack>
                                    <Button
                                        size='medium'
                                        variant='outlined'
                                        onClick = {()=>{setCurrentShop(shop); setCartOpen(true)}}
                                        sx={shopStyles.button}
                                    >
                                        Add to Cart - ${parseFloat(shop.price).toFixed(2)}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid> 
                ))}
            </Grid>
            <Dialog open={cartOpen} onClose={()=>{setCartOpen(false)}}>
                <DialogContent>
                    <DialogContentText>Add to Cart</DialogContentText>
                    <AddToCart cartItem = {currentShop as ShopState } />
                </DialogContent>
            </Dialog>
        </Box>
    )
}