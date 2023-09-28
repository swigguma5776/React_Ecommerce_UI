import * as _React from 'react'; 
import { useState } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import {
    onAuthStateChanged,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from 'firebase/auth'; 
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Stack,
    Divider,
    CircularProgress,
    Dialog,
    DialogContent,
    Alert } from '@mui/material'


// internal imports
import { NavBar } from '../sharedComponents';
import { InputText, InputPassword } from '../sharedComponents';
import shop_image from '../../assets/Images/littleshop.jpg'; 


// our object we can reference when creating our styles aka sx = {}
const authStyles = {

    main: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${shop_image});`,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top 5px',
        position: 'absolute', 
        marginTop: '10px'
    },
    stack : {
        width: '400px',
        marginTop: '100px',
        marginRight: 'auto',
        marginLeft: 'auto',
        color: 'white'
    },
    button: {
        width: '175px',
        fontSize: '14px'
    }
}


// our interfaces for our function arguments

interface Props {
    title: string; 
}


interface ButtonProps {
    open: boolean
    onClick: () => void
}

interface SubmitProps {
    email: string
    password: string
}


// making a literal union type for our alerts
export type MessageType = 'error' | 'warning' | 'info' | 'success'


const GoogleButton = (_props: ButtonProps ) => {
    // setting up our hooks to manage the state of some things
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const [ signInWithGoogle, _user, loading, error ] = useSignInWithGoogle(auth)


    const signIn = async () => {
        await signInWithGoogle();

        // using something called localStorage which is essentially just JS temporary storage (very similar to SQLite in Python)
        localStorage.setItem('auth', 'true')
        onAuthStateChanged(auth, (user) => {

            if (user) {
                localStorage.setItem('user', user.email || '') 
                localStorage.setItem('token', user.uid || '') //will be using this later to store cart items on a specific user but also make API calls
                setMessage(`Successfully logged in ${user.email}`)
                setMessageType('success')
                setOpen(true)
                setTimeout(() => {navigate('/shop')}, 2000) //will display successful message to user & then navigate to shop
            }
            
        })

        if (error) {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        }

        if (loading) {
            return <CircularProgress />
        }
    }

    return (
        <Box>
            <Button
                variant = 'contained'
                color = 'info'
                size = 'large'
                sx = { authStyles.button }
                onClick = { signIn }
            >
                Sign In With Google
            </Button>
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


const SignIn = () => {
    // setting up our hooks 
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit } = useForm<SubmitProps>({});


    const onSubmit:SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault(); 

        console.log(data.email, data.password)
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            // Signed in 
            localStorage.setItem('auth', 'true')
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    localStorage.setItem('token', user.uid || '') //setup cart database & for api calls to our backend
                    localStorage.setItem('user', user.email || '') //using this on our navbar 
                }
            })
            const user = userCredential.user;
            // Once a user is signed in we can display a success message
            setMessage(`Successfully logged in user ${user.email}`)
            setMessageType('success')
            setOpen(true)
            setTimeout(()=>{navigate('/shop')}, 2000)
        })
        .catch((error) => {
            const errorMessage = error.message;
            setMessage(errorMessage)
            setMessageType('error')
            setOpen(true)
        });
    }

    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant='h6'>Sign Into Your Account</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Email Here' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Password must be 6 or more characters' />
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



const SignUp = () => {
    // setting up our hooks 
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit } = useForm<SubmitProps>({});


    const onSubmit:SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault(); 

        console.log(data.email, data.password)
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            // Signed in 
            localStorage.setItem('auth', 'true')
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    localStorage.setItem('token', user.uid || '') //setup cart database & for api calls to our backend
                    localStorage.setItem('user', user.email || '') //using this on our navbar 
                }
            })
            const user = userCredential.user;
            // Once a user is signed in we can display a success message
            setMessage(`Successfully logged in user ${user.email}`)
            setMessageType('success')
            setOpen(true)
            setTimeout(()=>{navigate('/shop')}, 2000)
        })
        .catch((error) => {
            const errorMessage = error.message;
            setMessage(errorMessage)
            setMessageType('error')
            setOpen(true)
        });
    }

    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant='h6'>Sign Up for Free!</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Email Here' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Password must be 6 or more characters' />
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




export const Auth = (props: Props) => {
    // setup our hooks
    const [ open, setOpen ] = useState(false)
    const navigate = useNavigate();
    const [ signType, setSignType ] = useState<string>()

    const handleSnackClose = () => {
        setOpen(false)
        navigate('/shop')
    }


    return (
        <Box>
            <NavBar />
            <Box sx={authStyles.main}>
                <Stack direction = 'column' alignItems = 'center' textAlign = 'center' sx = {authStyles.stack}>
                    <Typography variant = 'h2' sx = {{color: 'white'}}>
                        {props.title}
                    </Typography>
                    <br />
                    <Typography variant ='h5'>
                        Track your shop items for free!
                    </Typography>
                    <br />
                    <GoogleButton open = {open} onClick = {handleSnackClose} />
                    <Divider variant = 'fullWidth' color = 'white' />
                    <br />
                    <Stack 
                        width = '100%'
                        alignItems = 'center'
                        justifyContent = 'space-between'
                        direction = 'row'
                        >
                            <Button
                                variant = 'contained'
                                color = 'primary'
                                size = 'large'
                                sx = { authStyles.button }
                                onClick = {()=>{setOpen(true); setSignType('signin')}}
                                >
                                    Email Login In
                                </Button>
                            <Button
                                variant = 'contained'
                                color = 'primary'
                                size = 'large'
                                sx = { authStyles.button }
                                onClick = {()=>{setOpen(true); setSignType('signup')}}
                                >
                                    Email Sign Up
                                </Button>
                        </Stack>
                </Stack>
                <Dialog open={open} onClose = {()=>{setOpen(false)}}>
                    <DialogContent>
                        {signType === 'signin' ? <SignIn/> : <SignUp/>}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    )
}