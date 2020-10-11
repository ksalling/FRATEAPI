import React, { useEffect, useState, useCallback } from 'react';
import { DisplayText, Spinner } from '@shopify/polaris';
import axios from 'axios';
import store from 'store-js';
import DimensionSetting from '../../components/settingsPage/DimensionUnits';
import WeightSetting from '../../components/settingsPage/WeightUnits';
import ShippingOptions from '../../components/settingsPage/ShippingOptions';
//import Locations from '../../components/Locations';
//import Carriers from '../../components/Carriers';
import { Card, Layout, Page, Stack, Link, Modal, Button } from '@shopify/polaris';
// import LocationModal from '../modals/LocationModal';
// import CarrierModal from '../modals/CarrierModal';

//import LocationAdd from '../../modals/LocationAdd';
//import CarrierAdd from '../../modals/CarrierAdd';

// import { LocationModalContext, CarrierModalContext } from '../context/atoms';
// import { useRecoilState } from 'recoil/dist/recoil.production';

import { useForm } from "react-hook-form";
import { FormGroup, FormControlLabel, Switch } from "@material-ui/core/";

function SettingsPage() {

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
        <Page title="Settings">
            <Layout>
                <Layout.AnnotatedSection 
                    title="Shipping Units"
                    description="Select the dimensional and weight units you would like to use for your shipment quotes."
                >
                    <Stack>
                        <DimensionSetting appData={appState} />
                        <WeightSetting appData={appState} />
                    </Stack>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection
                    title="Select Shipping Options"
                    description="Choose to force liftgate or residential delivery or make optional.">
                    <Card sectioned>
                        <DisplayText>Force Residential Quote</DisplayText>
                        <DisplayText>Force Liftgate Option</DisplayText>
                        <DisplayText>Upcharge Quote</DisplayText><input type="text"></input>
                        <ShippingOptions />
                    </Card>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection
                    title="Enable Residential Lookup and Geolocation"
                    description="This will incur charges">
                    <Card sectioned>
                        <DisplayText>Residential Lookup</DisplayText>
                    </Card>
                </Layout.AnnotatedSection>
            </Layout>
        </Page>
        </Card>
        
            
    )
                            
}

export default SettingsPage;