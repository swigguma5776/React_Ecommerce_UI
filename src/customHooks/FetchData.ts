import * as React from 'react';
import { useState, useEffect } from 'react';

// internal imports
import { serverCalls } from '../api'; 


// interface that represents our Shop Items

export interface ShopState {
    id: string,
    name: string,
    image: string,
    description: string,
    price: string,
    prod_id: string,
    quantity: number 
}

// interface to represent return of our hook

interface UseGetShopData {
    shopData: ShopState[]
    getData: () => void 
}

// create our custom hook that get's called automatically when we go our our shop page
export const useGetShop = (): UseGetShopData => {
    // set my hooks
    const [shopData, setData] = useState<ShopState[]>([])

    async function handleDataFetch(){
        const result = await serverCalls.getShop() //this is making our api call
        console.log(result)
        setData(result)
    }

    //useEffect takes in 2 arguments, 1 is the function to run, the other is the dependency its monitoring
    useEffect( () => {
        handleDataFetch()
    }, []) //whatever its monitoring goes in this list 


    return { shopData, getData: handleDataFetch }

}