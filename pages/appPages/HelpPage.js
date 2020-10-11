import React, { useEffect, useState, useCallback } from 'react';
import { Spinner } from '@shopify/polaris';
import axios from 'axios';
import store from 'store-js';
//import DimensionSetting from '../../components/DimensionUnits';
//import WeightSetting from '../../components/WeightUnits';
//import Locations from '../../components/Locations';
//import Carriers from '../../components/Carriers';
import { Card, Layout, Page, Stack, Link, Modal, Button } from '@shopify/polaris';
// import LocationModal from '../modals/LocationModal';
// import CarrierModal from '../modals/CarrierModal';

//import LocationAdd from '../../modals/LocationAdd';
//import CarrierAdd from '../../modals/CarrierAdd';

// import { LocationModalContext, CarrierModalContext } from '../context/atoms';
// import { useRecoilState } from 'recoil/dist/recoil.production';

function HelpPage() {

    const [locationActive, setLocationActive] = useState(false);
    const handleLocationChange = useCallback(() => setLocationActive(!locationActive), [locationActive]);
    const locationActivator = <Button onClick={handleLocationChange}>Open</Button>;

    const [carrierActive, setCarrierActive] = useState(false);
    const handleCarrierChange = useCallback(() => setCarrierActive(!carrierActive), [carrierActive]);
    const carrierActivator = <Button onClick={handleCarrierChange}>Open</Button>;


    const [ appState, setAppState ] = useState({ loading: true });

    const [ LocationModalState, setLocationModalState ] = useState(false);
    const [ CarrierModalState, setCarrierModalState ] = useState(false);

    const shopId = {
        shopId : store.get('shopId')
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

    console.log(appState);

    if (appState.loading) return <h1>Loading...</h1>

    return(
        <Card sectioned>
        <Page title="Help Page">
            <Layout>
                <Layout.AnnotatedSection 
                    title="Shipping Units"
                    description="Select the dimensional and weight units you would like to use for your shipment quotes."
                >
                    <Stack>
                        
                    </Stack>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection
                    title="Shipping Locations"
                    description="Add shipping origin locations. Useful if some products are dropshipped from a different location. At least one location must be entered.">
                    <Link onClick={() => { setLocationActive(true); }} >Add Location</Link>
                    <Card sectioned>
                        
                    </Card>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection
                    title="Available Carriers"
                    description="Enable one or multiple freight carriers to obtain realtime quotes.">
                    <Link onClick={() => { setCarrierActive(true); }} >Add Shipper</Link>
                    <Card sectioned>
                    
                    </Card>
                </Layout.AnnotatedSection>
            </Layout>
            
        </Page>
        </Card>
        
            
    )
                            
}

export default HelpPage;