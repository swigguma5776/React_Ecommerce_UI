import * as _React from 'react';
import { useState } from 'react'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, 
    Snackbar} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form'; 


// Internal imports
import { serverCalls } from '../../api';
import { useGetOrder } from '../../customHooks';
import { InputText } from '../sharedComponents/Inputs';
import { theme } from '../../Theme/themes';
import { ShopState } from '../../customHooks';
import { SubmitState } from '../Shop'; 
import { MessageType } from '../Auth';



const columns: GridColDef[] = [
  { field: 'image', //needs to match keys on our Order Object/Dictionary 
    headerName: 'Image', //can be whatever (is what will be displayed as column header) 
    width: 150,
    renderCell: (params) => (
        <img
            src={params.row.image}
            alt={params.row.name}
            style={{maxHeight: '100%', aspectRatio: '1/1'}}
        />
    )
    },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    editable: true,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 100,
    editable: true,
  },
  {
    field: 'prod_id',
    headerName: 'Product ID',
    width: 150,
    editable: true,
  },
  {
    field: 'id',
    headerName: 'Order ID',
    width: 150,
    editable: true,
  },
 
];

interface UpdateState {
    id: string,
    orderData: ShopState[]
}

const UpdateQuantity = (props: UpdateState) => {
    const { register, handleSubmit } = useForm<SubmitState>({})
    const [ openAlert, setAlertOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()



    const onSubmit: SubmitHandler<SubmitState> = async (data, event) => {
        if (event) event.preventDefault(); //if an event is happening or we take in an event its just going to stop the default (typically refresh screen)

        let order_id = ""
        let prod_id = ""

        for (let order of props.orderData){
            if (order.id === props.id){
                order_id = order.order_id as string
                prod_id = order.prod_id as string
            }
        }

        const updateData = {
            'prod_id' : prod_id,
            'quantity' : parseInt(data.quantity) as number //quantity that is coming from the form 
        }

        const response = await serverCalls.updateOrder(order_id, updateData)
        if (response.status === 200){
            setMessage('Successfully updated item in your Order')
            setMessageType('success')
            setAlertOpen(true)
            setTimeout(()=>{window.location.reload()}, 3000)
        } else {
            setMessage(response.message)
            setMessageType('error')
            setAlertOpen(true)
            setTimeout(()=>{window.location.reload()}, 3000)
        }

    }

    return(
        <Box sx={{padding: '20px'}}>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Box>
                    <label htmlFor="quantity">What is the updated quantity?</label>
                    <InputText {...register('quantity')} name='quantity' placeholder='Quantity Here' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={openAlert}
                autoHideDuration={3000}
                onClose={()=> setAlertOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )
}



export const Order = () => {
    const { orderData } = useGetOrder();
    const [ open, setOpen ] = useState(false);
    const [ gridData, setGridData ] = useState<GridRowSelectionModel>([]) //hook to set the row in our grid as our current object so we can edit
    const [ openAlert, setAlertOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()

    const deleteItem = async () => {

        const id = `${gridData[0]}`

        let order_id = ""
        let prod_id = ""

        for (let order of orderData){ //looping through the list of order objects

            if (order.id === id){
                order_id = order.order_id as string
                prod_id = order.prod_id as string
            }
        }

        // we need to match the same format as what flask is expecting 

        const deleteData = {
            'prod_id': prod_id
        }

        const response = await serverCalls.deleteOrder(order_id, deleteData)
        console.log(response)

        if (response.status === 200){
            setMessage('Successfully deleted item from Order')
            setMessageType('success')
            setAlertOpen(true)
            setTimeout(()=>{window.location.reload()}, 3000)
        } else {
            setMessage(response.message)
            setMessageType('error')
            setAlertOpen(true)
            setTimeout(()=>{window.location.reload()}, 3000)
        }
        
    }

    return (
        <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={orderData}
            columns={columns}
            sx={{color: 'white', borderColor: theme.palette.primary.main, backgroundColor: theme.palette.secondary.light }}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 5,
                },
            },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            getRowId = {(row) => row.id}
            onRowSelectionModelChange = {(newSelectionModel) => setGridData(newSelectionModel)}
        />
        <Button variant='contained' color='info' onClick={()=>{setOpen(true)}}>Update</Button>
        <Button variant='contained' color='warning' onClick={deleteItem}>Delete</Button>
        <Dialog open={open} onClose={()=>{setOpen(false)}} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Update An Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>Order id: {gridData[0]}</DialogContentText>
                </DialogContent>
                <UpdateQuantity id={`${gridData[0]}`} orderData = {orderData} />
                <DialogActions>
                    <Button onClick={()=>{setOpen(false)}} color='error'>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openAlert}
                autoHideDuration={3000}
                onClose={()=> setAlertOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
}