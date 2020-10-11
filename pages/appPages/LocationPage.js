import React, { useEffect, useState, useCallback } from 'react';
import { Spinner } from '@shopify/polaris';
import axios from 'axios';
import store from 'store-js';
//import DimensionSetting from '../../components/DimensionUnits';
//import WeightSetting from '../../components/WeightUnits';
import LocationCard from '../../components/locationPage/LocationCard';
//import Carriers from '../../components/Carriers';
import { Card, Layout, Page, Stack, Link, Modal, Form, FormLayout, DisplayText, Collapsible } from '@shopify/polaris';
// import LocationModal from '../modals/LocationModal';
// import CarrierModal from '../modals/CarrierModal';

//import LocationAdd from '../../components/locationpage/LocationAdd';
//import CarrierAdd from '../../modals/CarrierAdd-OLD';

// import { LocationModalContext, CarrierModalContext } from '../context/atoms';
// import { useRecoilState } from 'recoil/dist/recoil.production';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { TextField, makeStyles, Button } from '@material-ui/core';
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
      },
      '& .MuiInputLabel-root': {
        fontWeight: 'bold',
        left: -1,
        fontSize: 12,
      },
    },
  }));

  const schema = yup.object().shape({
    name: yup.string().required(),
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().min(2).max(2).required(),
    zip: yup.string().min(4).max(5).required(),
  });

function LocationPage() {

    const classes = useStyles();

    const [ buttonText, setButtonText ] = useState({text: 'Add Location', value: true});

    const [locationActive, setLocationActive] = useState(false);
    const handleLocationChange = useCallback(() => setLocationActive(!locationActive), [locationActive]);
    const locationActivator = <Button onClick={handleLocationChange}>Open</Button>;

    const [ appState, setAppState ] = useState({ loading: true });

    const [nameValue, setNameValue] = useState('');
    const [streetValue, setStreetValue] = useState('');
    const [cityValue, setCityValue] = useState('');
    const [stateValue, setStateValue] = useState('');
    const [zipValue, setZipValue] = useState('');

    // const nameChange = useCallback((newValue) => setNameValue(newValue), []);
    // const streetChange = useCallback((newValue) => setStreetValue(newValue), []);
    // const cityChange = useCallback((newValue) => setCityValue(newValue), []);
    // const stateChange = useCallback((newValue) => setStateValue(newValue), []);
    // const zipChange = useCallback((newValue) => setZipValue(newValue), []);

    const nameChange = (event) => { setNameValue(event.target.value) };
    const streetChange = (event) => { setStreetValue(event.target.value) };
    const cityChange = (event) => { setCityValue(event.target.value) };
    const stateChange = (event) => { setStateValue(event.target.value) };
    const zipChange = (event) => { setZipValue(event.target.value) };

    const { register, errors, handleSubmit } = useForm({mode:'onBlur', resolver: yupResolver(schema)});

    const [showAdd, setShowAdd] = useState(false);

    const shopId = {
        shopId : store.get('shopId')
    }

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

    const handleShowAdd = useCallback(() => {
        setShowAdd((showAdd) => !showAdd)
        if (buttonText.value == true) {
            setButtonText({text: 'Cancel', value: false});
        } else if (buttonText.value == false) {
            setButtonText({text: 'Add Location', value: true});
        }
        console.log(buttonText.text)
        console.log(buttonText.value)
    }, [buttonText]);

    const addLocation = useCallback(() => {
        console.log(_event)
    })

    const formSubmit = useCallback((_event) => {
      //console.log(event.target.elements) 
      var formData = {
        shopId: shopId.shopId,
        name: event.target.elements.name.value,
        street: event.target.elements.street.value,
        city: event.target.elements.city.value,
        state: event.target.elements.state.value,
        zip: event.target.elements.zip.value
      }
      axios.post('/api/addlocation', formData, { headers: {     'Content-Type': 'application/json',   } })
      .then(result => {
        //window.location.reload(false)
        console.log(result);
        setAppState({ loading: true });
        getUserData();
        setButtonText({text: 'Add Location', value: true});
        setShowAdd((showAdd) => !showAdd);
      })
      .catch(error => console.log(error))
    }, [setAppState])  

    useEffect(() => {
        setAppState({ loading: true });
        getUserData();
    }, [setAppState]);

    console.log(appState);

    if (appState.loading) return <h1>Loading...</h1>

    return(
        <Card sectioned>
            <Page title="Locations Page" 
                primaryAction={
                    <Button
                        id="addLocation" 
                        onClick={handleShowAdd}
                        ariaExpanded={showAdd}
                        ariaControls="basic-collapsible"
                        primary 
                    >{buttonText.text}</Button>
                }
            >        
            <Layout>
                <Layout.AnnotatedSection
                    title="Shipping Locations"
                    description="Add shipping origin locations. Useful if some products are dropshipped from a different location. At least one location must be entered.">
                    <Layout sectioned>
                        
                        <Layout.Section>
                            <Collapsible 
                                open={showAdd}
                                id="basic-collapsible"
                                transition={{duration: '150ms', timingFunction: 'ease'}}
                            >
                                <Layout sectioned>
                                <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(formSubmit)}>
        <div>  
          <TextField 
            style={{width: "99%"}}
            error={errors.name ? true: false} 
            name="name" 
            label="Name" 
            value={nameValue} 
            onChange={nameChange} 
            variant="outlined" 
            inputRef={register}
            helperText={errors.name ? 'Required': ''}
          />
          <TextField 
            style={{width: "99%"}}
            error={errors.street ? true: false}
            inputRef={register}
            helperText={errors.street ? 'Required': ''}
            name="street" 
            label="Street" 
            value={streetValue} 
            onChange={streetChange} 
            variant="outlined" 
          />
        </div>
        <div>
          <TextField
            style={{width: "55%"}}
            error={errors.city ? true: false}
            inputRef={register}
            helperText={errors.city ? 'Required': ''}
            name="city"
            label="City"
            value={cityValue}
            onChange={cityChange}
            variant="outlined" 
          />
          <TextField
            style={{width: "14%"}}
            error={errors.state ? true: false}
            inputRef={register}
            helperText={errors.state ? 'Required': ''}
            name="state" 
            label="State" 
            value={stateValue} 
            onChange={stateChange} 
            variant="outlined" 
          />
          <TextField
            style={{width: "22%"}}
            error={errors.zip ? true: false}
            inputRef={register}
            helperText={errors.zip ? 'Required': ''}
            name="zip" 
            label="Zip" 
            value={zipValue} 
            onChange={zipChange} 
            variant="outlined" 
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button style={{marginRight: "1%"}} type="submit" variant="contained" color="primary" >Save</Button>
        </div>
      </form>
                                </Layout>
                            </Collapsible>
                        </Layout.Section>
                        <Layout.Section>
                            <Card sectioned>
                                { appState.data.appSettings.settings.locations.map((location, index) => (
                                                    <LocationCard location={location} key={index} setAppState={setAppState} />
                                ))}
                            </Card>
                        </Layout.Section>
                    </Layout>

                </Layout.AnnotatedSection>
            </Layout>
            <Modal
                activator={locationActivator}
                open={locationActive}
                onClose={handleLocationChange}
                title="Add Ship From Location"
                primaryAction={{
                    content: 'Save',
                    onAction: addLocation,
                  }}
            >
                <Modal.Section>
                    <Layout sectioned>
                        
                    </Layout>
                </Modal.Section>
            </Modal>
        </Page>
        </Card>
        
            
    )
                            
}

export default LocationPage;