import React, { useState, useCallback, useEffect } from 'react';
import { Card, Collapsible, Form, FormLayout, Link, Stack, Heading } from '@shopify/polaris';
import GreenDot, { RedDot } from './GreenDot';
import axios from 'axios';
import store from 'store-js';


//import { DeleteModalContext } from '../context/atoms';
//import { useRecoilState } from 'recoil';

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

function CarrierCard({carrier, index, setAppState}) {

    const classes = useStyles();

    //console.log(carrier)
    // const [key, setKey] = useState(!carrier.apiKey ? "" : carrier.apiKey);
    // const [secret, setSecret] = useState(!carrier.apiSecret ? "" : carrier.apiSecret);
    const [ apiValue, setApiValue ] = useState(carrier.apiKey);
    const [ secretValue, setSecretValue ] = useState(carrier.apiSecret);

    const [active, setActive] = useState(false);
    //const [active2, setActive2] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // const keyChange = useCallback((newValue) => setKey(newValue), []);
    // const secretChange = useCallback((newValue) => setSecret(newValue), []);

    const handleApiChange = (event) => { setApiValue(event.target.value) }
    const handleSecretChange = (event) => { setSecretValue(event.target.value) }
    
    // const handleSelectChange = (event) => { //setSelected(event.target.value) 
    //     const res = carrierList.find((item) => (item.value === event.target.value))
    //     setSelected({ label: res.label, value: event.target.value });
    // };

  const { register, errors, handleSubmit } = useForm({mode:'onBlur', resolver: yupResolver(schema)});

    const handleToggle = useCallback(() => {
        setActive((active) => !active);
    }, [])

    const deleteToggle = useCallback(() => {
        setDeleteConfirm((deleteConfirm) => !deleteConfirm);
        setActive((active) => !active);
        //setActive2((active2) => !active2);
        //console.log(location._id);
    }, [])

    const cancel = useCallback(() => {
        setDeleteConfirm(false);
        setActive(false);
        //setActive2((active2) => !active2);
        //console.log(location._id);
    }, [])

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

    const deleteLocation = useCallback(() => {
        // console.log("Delete");
        // console.log(carrier);

        const carrierId = { id: carrier._id}
        axios.post('/api/deletecarrier', carrierId)
            .then(result => {
                setAppState({ loading: true });
                getUserData();
                //console.log(result)
                //window.location.reload(false)
                //setDeleteModalState(!DeleteModalState);

                // const shopId = { id: shopID}
                // axios.post('/api/installcheck', shopId)
                // .then(response => {
                //     window.location.reload(false)
                // })
            })
            .catch(error => console.log(error))
    }, [setAppState])

    

    useEffect(() => {

        setApiValue(carrier.apiKey)
        setSecretValue(carrier.apiSecret)
    }, [])

    const formSubmit = useCallback((data) => {
        const url = '/api/editcarrier'

        var formData = {
            id: carrier._id,
            shopId: shopId.shopId,
            name: carrier.name,
            active: false,
            apiKey: apiValue, //event.target.elements.apiKey.value,
            apiSecret: secretValue, //event.target.elements.apiSecret.value
        }
        console.log(formData);
        axios.post(url, formData, {   headers: {     'Content-Type': 'application/json',   } })
            .then(result => {
                setAppState({ loading: true });
                getUserData();
                //console.log(result)
            })
            .catch(error => console.log(error))


    }, [setAppState])

    return (
        <Card sectioned key={index}
            actions={[{content: 'Set Keys', onAction: handleToggle}]} 
            title={carrier.active ? <GreenDot carrier={carrier} /> : <RedDot carrier={carrier} /> }
        >                                         
            <Collapsible
                open={active}
                id="basic-collapsible"
                transition={{duration: '150ms', timingFunction: 'ease'}}
            >   
                <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(formSubmit)}>

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
            <Stack distribution="equalSpacing" >
                <Button destructive onClick={deleteToggle} >Delete</Button>
                <Button style={{marginRight: "1%"}} type="submit" variant="contained" color="primary" >Save</Button>
            </Stack>
          
        </div>   
      </form>
            </Collapsible>
            <Collapsible
                open={deleteConfirm}
                id="basic-collapsible"
                transition={{duration: '150ms', timingFunction: 'ease'}}
                style={{paddingTop: "50px"}}
            >
               <Stack distribution="center" >
                    <Heading>Delete ?</Heading>
                    <Button onClick={cancel} >Cancel</Button>
                    <Button destructive onClick={deleteLocation}>Confirm</Button>
                </Stack>
          </Collapsible>
        </Card>
    );
}

export default CarrierCard