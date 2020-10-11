import React, { useState, useEffect } from 'react';
import { EmptyState, Layout, Page, Button, Card, Stack } from '@shopify/polaris';
import { ResourcePicker, TitleBar  } from '@shopify/app-bridge-react';
import store from 'store-js';
import axios from 'axios';

import ProductCard from '../../components/productPage/ProductCard'


function ProductPage() {

    const [ appState, setAppState ] = useState({ loading: true });
    const [ productArray, setProductArray ] = useState();
    const [ modal, setModal ] = useState({ open: false });

    const shopId = {
        shopId: store.get('shopId')
    }

    console.log(shopId)

    useEffect(() => {
        setAppState({ loading: true });
        function getUserData() {
            try {
                axios.post('/api/installCheck', shopId)
                    .then((response) => {
                        console.log(response);
                        setProductArray(response.data.appSettings.settings.products);
                        setAppState({ loading: false, data: response.data });
                        
                    })
            } catch (err) {
                console.log(err);
            }
        }
        getUserData()
    }, [setAppState, setProductArray]);

    function handleSelection(resources) {
        const idsFromResources = resources.selection.map((product) => {
            const submitProduct = { 
                shopId: shopId.shopId, 
                productId: product.id,    
            }
            //console.log(submitProduct)
            axios.post('/api/addproduct', submitProduct)
            .then(result => {
                //console.log(result)
            })
            .catch(error => console.log(error))
            window.location.reload(false)
        });
        setModal({ open: false });
    }

    if (appState.loading) return <Page><h1>Loading...</h1></Page>


    return(
        <Card>
        <Page title="Products" primaryAction={
            <Button onClick={() => setModal({ open: true })} primary >Add Product</Button>
        }>
            <ResourcePicker
                resourceType="Product"
                showVariants={false}
                open={modal.open}
                onSelection={(resources) => handleSelection(resources)}
                onCancel={() => setModal({ open: false })}
            />
                    
        { productArray.length == 0 ?
            <h1>Add some products in order to provide FRATE quotes.</h1>
        :
             productArray.map((product, index) => (
                <ProductCard products={product} key={index} />
            )) 
        }
        </Page>
        </Card>

    )

}

export default ProductPage;