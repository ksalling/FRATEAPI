import React, { useState, useCallback } from 'react';
import { Card, Collapsible, TextContainer, Form, FormLayout, Stack, Heading } from '@shopify/polaris';
import store from 'store-js';
import axios from 'axios';

// import { useRecoilState } from 'recoil';
// import storeEngine from 'store-js/src/store-engine';
// import Axios from 'axios';

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

function LocationCard({location, index, setAppState}) {

    const classes = useStyles();
    
    const [nameValue, setNameValue] = useState(location.name);
    const [streetValue, setStreetValue] = useState(location.street);
    const [cityValue, setCityValue] = useState(location.city);
    const [stateValue, setStateValue] = useState(location.state);
    const [zipValue, setZipValue] = useState(location.zip);

    const [active, setActive] = useState(false);
    const [active2, setActive2] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

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

    const handleToggle = useCallback(() => {
        setActive((active) => !active);
        setActive2((active2) => !active2);
        setNameValue((name) => location.name);
        setStreetValue((street) => location.street);
        setCityValue((city) => location.city);
        setStateValue((state) => location.state);
        setZipValue((zip) => location.zip);
    }, [])

    const deleteToggle = useCallback(() => {
        setDeleteConfirm((deleteConfirm) => !deleteConfirm);
        setActive((active) => !active);
        setActive2((active2) => !active2);
        //console.log(location._id);
    }, [])

    const cancel = useCallback(() => {
        setDeleteConfirm(false);
        setActive(false);
        setActive2(true);
        //console.log(location._id);
    }, [])

    // const nameChange = useCallback((newValue) => setName(newValue), []);
    // const streetChange = useCallback((newValue) => setStreet(newValue), []);
    // const cityChange = useCallback((newValue) => setCity(newValue), []);
    // const stateChange = useCallback((newValue) => setState(newValue), []);
    // const zipChange = useCallback((newValue) => setZip(newValue), []);

    const nameChange = (event) => { setNameValue(event.target.value) };
    const streetChange = (event) => { setStreetValue(event.target.value) };
    const cityChange = (event) => { setCityValue(event.target.value) };
    const stateChange = (event) => { setStateValue(event.target.value) };
    const zipChange = (event) => { setZipValue(event.target.value) };

    const { register, errors, handleSubmit } = useForm({mode:'onBlur', resolver: yupResolver(schema)});
    
    const editLocation = useCallback(() => {
        //console.log(location._id)
        //console.log(event.target.elements)
        const url = '/api/editlocation'

        var formData = {
            id: location._id,
            shopId: shopId.shopId,
            name: nameValue,
            street: streetValue,
            city: cityValue,
            state: stateValue,
            zip: zipValue
        }

        //console.log(formData)

        axios.post(url, formData, {   headers: {     'Content-Type': 'application/json',   } })
            .then(result => {
                setAppState({ loading: true });
                getUserData();
                //console.log(result)
            })
            .catch(error => console.log(error))

    })

    const deleteLocation = useCallback(() => {
        console.log("Delete");
        console.log(location);

        const locationId = { id: location._id }
        axios.post('/api/deletelocation', locationId)
            .then(response => {
                //const shopId = store.get('appSettings').shopID;
                //console.log(response);
                //window.location.reload(false);
                setAppState({ loading: true });
                getUserData();

            })
            .catch(error => console.log(error))
    }, [setAppState])
    
    return (
        <Card sectioned key={index}
            actions={[{content: 'Edit', onAction: handleToggle}]} 
            title={location.name}
        >  
            <Collapsible 
                 open={active2}
                 id="basic-collapsible"
                 transition={{duration: '150ms', timingFunction: 'ease'}}
             >
                <TextContainer >
                    <p>{location.street} {location.city}, {location.state}. {location.zip}</p>    
                </TextContainer>                                   
            </Collapsible>
            <Collapsible
                open={active}
                id="basic-collapsible"
                transition={{duration: '150ms', timingFunction: 'ease'}}
            >
                <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(editLocation)}>
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

export default LocationCard;