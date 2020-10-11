import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import store from 'store-js';
//import DimensionSetting from '../../components/DimensionUnits';
//import WeightSetting from '../../components/WeightUnits';
//import Locations from '../../components/Locations';
import CarrierCard from '../../components/carrierPage/CarrierCard';
import { Card, Layout, Page, Stack, Link, Modal, Collapsible, Form, FormLayout} from '@shopify/polaris';
// import LocationModal from '../modals/LocationModal';
// import CarrierModal from '../modals/CarrierModal';

//import LocationAdd from '../../modals/LocationAdd';
//import CarrierAdd from '../../modals/CarrierAdd-OLD';

// import { LocationModalContext, CarrierModalContext } from '../context/atoms';
// import { useRecoilState } from 'recoil/dist/recoil.production';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { TextField, makeStyles, Button, Select, MenuItem } from '@material-ui/core';
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    '& .MuiInputLabel-root': {
      fontWeight: 'bold',
      fontSize: 12,
    },
  },
}));

const schema = yup.object().shape({
  apiKey: yup.string().required(),
  apiSecret: yup.string().required(),
});

function CarriersPage() {

    const classes = useStyles();

    const [ buttonText, setButtonText ] = useState({text: 'Add Carrier', value: true});
    const [carrierActive, setCarrierActive] = useState(false);
    const [ appState, setAppState ] = useState({ loading: true });
    const [showAdd, setShowAdd] = useState(false);
    const [ carrierList, setCarrierList ] = useState('')
    //const [selected, setSelected] = useState('today');
    const [apiValue, setApiValue] = useState('');
    const [secretValue, setSecretValue] = useState('');
    const [ selected, setSelected ] = useState({ label: '', value: '' });

    // const handleApiChange = useCallback((newApiValue) => setApiValue(newApiValue), []);
    // const handleSecretChange = useCallback((newSecretValue) => setSecretValue(newSecretValue), []);
    // const handleSelectChange = useCallback((value) => setSelected(value), []);
    // const handleCarrierChange = useCallback(() => setCarrierActive(!carrierActive), [carrierActive]);
    // const carrierActivator = <Button onClick={handleCarrierChange}>Open</Button>;

    const handleApiChange = (event) => { setApiValue(event.target.value) }
    const handleSecretChange = (event) => { setSecretValue(event.target.value) }

    const handleSelectChange = (event) => { //setSelected(event.target.value) 
        const res = carrierList.find((item) => (item.value === event.target.value))
          setSelected({ label: res.label, value: event.target.value });
    };


    const { register, errors, handleSubmit } = useForm({mode:'onBlur', resolver: yupResolver(schema)});

    const [ CarrierModalState, setCarrierModalState ] = useState(false);

    
 
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

    function getCarrierList() {
        try{
            axios.get('/api/carrierlist')
                .then(response => {
                    const carrierArray = []
                    response.data.carrierList.map((carrier, index) => (
                        carrierArray.push( { label: carrier.name, value: carrier._id } )
                    ))
                    setCarrierList(carrierArray)
                })
        } catch(error) {
            console.log(error)
        }
    }

    const handleShowAdd = useCallback(() => {
        setShowAdd((showAdd) => !showAdd)
        if (buttonText.value == true) {
            setButtonText({text: 'Cancel', value: false});
        } else if (buttonText.value == false) {
            setButtonText({text: 'Add Carrier', value: true});
        }
        console.log(buttonText.text)
        console.log(buttonText.value)
    }, [buttonText]);

    const addLocation = useCallback(() => {
        console.log(_event)
    })

    const formSubmit = useCallback((data) => {
        //console.log(event.target.elements) 
        var formData = {
            shopId: shopId.shopId,
            name: selected.label, //event.target.elements.carrier.selectedOptions[0].text,
            carrierId: selected.value, //event.target.elements.carrier.selectedOptions[0].value,
            active: false,
            apiKey: apiValue, //event.target.elements.apiKey.value,
            apiSecret: secretValue //event.target.elements.apiSecret.value
        }
        //console.log(formData);
        axios.post('/api/addcarrier', formData, { headers: {     'Content-Type': 'application/json',   } })
        .then(result => {
          //window.location.reload(false)
          console.log(result);
          setAppState({ loading: true });
          getUserData();
          setButtonText({text: 'Add Carrier', value: true});
          setShowAdd((showAdd) => !showAdd);
        })
        .catch(error => console.log(error))
      }, [setAppState])

    useEffect(() => {
        getCarrierList()
        setAppState({ loading: true });
        getUserData()
    }, [setAppState]);

    console.log(appState);

    if (appState.loading) return <h1>Loading...</h1>

    return(
        <Card sectioned>
        <Page title="Carriers Page"
            primaryAction={
                <Button
                    id="addCarrier"
                    onClick={handleShowAdd}
                    ariaExpanded={showAdd}
                    ariaControls="basic-collapsible"
                    primary
                >{buttonText.text}</Button>
            }
        >
        <Layout>
            <Layout.AnnotatedSection
                title="Available Carriers"
                description="Enable one or multiple freight carriers to obtain realtime quotes.">
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
            label="Available Carriers"
            name="carrier"
            select
            error={errors.carrier ? true: false}
            inputRef={register}
            helperText={errors.carrier ? 'Required': ''}
            onChange={handleSelectChange}
            value={selected.value}
            style={{ width: "99%" }}
            variant="outlined"
          >
            {carrierList.map((item, index) => (
                  <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
              )) 
            }
          </TextField>
        </div>
        <div>
          <TextField
            style={{width: "99%"}}
            error={errors.apiKey ? true: false}
            inputRef={register}
            helperText={errors.apiKey ? 'Required': ''} 
            label="API Key" 
            name="apiKey" 
            value={apiValue} 
            onChange={handleApiChange}
            variant="outlined" 
          />
          <TextField
            style={{width: "99%"}}
            error={errors.apiSecret ? true: false}
            inputRef={register}
            helperText={errors.apiSecret ? 'Required': ''} 
            label="API Secret" 
            name="apiSecret" 
            value={secretValue} 
            onChange={handleSecretChange}
            variant="outlined" 
          />
        </div>
        <div style={{textAlign: "right"}}>
          <Button style={{marginRight: "1%"}} type="submit" variant="contained" color="primary" >Save</Button>
        </div>   
      </form>
                            </Layout>
                        </Collapsible>
                    </Layout.Section>
                    <Layout.Section>
                        <Card sectioned>
                        { appState.data.appSettings.settings.carriers.map((carrier, index) => (
                                            <CarrierCard carrier={carrier} key={index} setAppState={setAppState} />
                        ))}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Layout.AnnotatedSection>
        </Layout>
            
        </Page>
        </Card>
        
    )
                            
}

export default CarriersPage;