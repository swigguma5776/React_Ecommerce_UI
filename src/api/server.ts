let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY5NTc1NDYxMSwianRpIjoiZjRjYTRmMTAtZGRlMi00ODM0LThlY2EtZGExMDc2NTdiNDgzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFsZXhzIiwibmJmIjoxNjk1NzU0NjExLCJleHAiOjE3MjcyOTA2MTF9.WVF87e0PgE1zvqQgYFAaY0qF6XhUwLmg5KadGUuTc84" //our backend access_token from flask
let userId = localStorage.getItem('token') // our users signed into React, this is their userId


export const serverCalls = {

    getShop: async () => {

        const response = await fetch(`https://rangers127-shop-un7o.onrender.com/api/shop`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status  //error message & status code
        }

        return await response.json()
    },
    getOrder: async () => {

        const response = await fetch(`https://rangers127-shop-un7o.onrender.com/api/order/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status  //error message & status code
        }

        return await response.json()
    },
    createOrder: async (data: any) => {

        const response = await fetch(`https://rangers127-shop-un7o.onrender.com/api/order/create/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status  //error message & status code
        }

        return await response.json()
    },
    updateOrder: async (id: string, data: any) => {

        const response = await fetch(`https://rangers127-shop-un7o.onrender.com/api/order/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status  //error message & status code
        }

        return await response.json()
    },
    deleteOrder: async (id: string, data: any) => {

        const response = await fetch(`https://rangers127-shop-un7o.onrender.com/api/order/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status  //error message & status code
        }

        return await response.json()
    }

 
}