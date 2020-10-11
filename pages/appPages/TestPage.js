import React, { useState, useCallback, useEffect } from 'react';
//import gql from 'graphql-tag';
//import { useQuery } from '@apollo/react-hooks';
import { Spinner, Button, Layout } from '@shopify/polaris';
//import IndexInstallCheck from './index-2-installcheck';
//import { RecoilRoot } from 'recoil';
import store from 'store-js';
import axios from 'axios';
//import { Context } from '@shopify/app-bridge-react';


function TestPage() {

    const shopId = {
        shopId : store.get('shopId')
    }
    console.log(shopId)

    let config = {
        headers: {
            'Accept': 'application/json',
            'X-Shopify-Access-Token': 'test'
        }
    }

    const createShipper = useCallback(() => {

        const carrierService = {
            "carrier_service": {
              "name": "Shipping Rate Provider",
              "callback_url": "http://shippingrateprovider.com",
              "service_discovery": true
            }
          }

        //const carrierId = { id: carrier._id}
        //const shopId = store.get('shopID')
        const data = { shopId: shopId.shopId }
        axios.post('/api/create', data)
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log(error))

    })

    const getShipper = useCallback(() => {

        const carrierService = {
            "carrier_service": {
              "name": "Shipping Rate Provider",
              "callback_url": "http://shippingrateprovider.com",
              "service_discovery": true
            }
        }

        //const shopId = store.get('shopId')
        const data = { shopId: shopId.shopId }
        console.log(data);
        axios.post('/api/getshipper', data)
            .then(response => {
                console.log(response)
            })
    })

    const deleteShipper = useCallback(() => {
        //const shopId = store.get('shopId')
        const data = { shopId: shopId.shopId }
        axios.post('/api/deleteshipper', data)
            .then(response => {
                console.log(response)
            })
    })

    const uninstall = useCallback(() => {
        //const shopId = store.get('shopId')
        console.log(shopId.shopId);
        axios.post('/api/uninstall', shopId)
        .then(response => {
            window.location.reload(false)
        })
    })

    return (
        <Layout>
            <Button onClick={createShipper}>Create Shipper</Button>
            <Button onClick={getShipper}>Get Shipper</Button>
            <Button onClick={deleteShipper}>Delete Shipper</Button>
            <Button onClick={uninstall}>Uninstall</Button>
        </Layout>
    )
}

export default TestPage;
