import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InstallPage from './install-1-main';
import Home from './index-3-home';
import store from 'store-js';

function IndexInstallCheck(shop) {

    //const [ shopId, setShopId ] = useState(shop);

    //console.log('index 2')

    store.set('shopId', shop.shop.id);
    store.set('shopName', shop.shop.name);
    const [ appState, setAppState ] = useState({ loading: true });

    const shopId = {
        shopId : shop.shop.id
    }

    useEffect(() => {
        setAppState({ loading: true });
        function getUserData() {
            try {
                axios.post('/api/installCheck', shopId)
                    .then((response) => {
                        //console.log(response);
                        setAppState({ loading: false, data: response.data });
                    })
            } catch (err) {
                console.log(err);
            }
        }

        getUserData()
    }, [setAppState]);

    if (appState.loading) return <h1>Loading...</h1>

    if (appState.data.appSettings.install.shopExists == false) return <InstallPage appSettings={appState.data.appSettings} />

    return <Home appSettings={appState.data.appSettings} />
    

}

export default IndexInstallCheck;