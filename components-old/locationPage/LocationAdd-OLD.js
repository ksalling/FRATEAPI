import React, { useState, useCallback } from 'react';
//import { Modal, FormLayout, Stack, Button, Form, Card, Layout } from '@shopify/polaris';
import axios from 'axios';

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

function LocationInstall({appData}) {

  //console.log(appData)

  const classes = useStyles();

  const [ shopID, setShopID ] = useState(appData.shopID);

    const [nameValue, setNameValue] = useState('');
    const [streetValue, setStreetValue] = useState('');
    const [cityValue, setCityValue] = useState('');
    const [stateValue, setStateValue] = useState('');
    const [zipValue, setZipValue] = useState('');

    const nameChange = (event) => { setNameValue(event.target.value) };
    const streetChange = (event) => { setStreetValue(event.target.value) };
    const cityChange = (event) => { setCityValue(event.target.value) };
    const stateChange = (event) => { setStateValue(event.target.value) };
    const zipChange = (event) => { setZipValue(event.target.value) };

    const { register, errors, handleSubmit } = useForm({mode:'onBlur', resolver: yupResolver(schema)});
    const onSubmit = data => console.log(data);

    // const streetChange = useCallback((newValue) => setStreetValue(newValue), []);
    // const cityChange = useCallback((newValue) => setCityValue(newValue), []);
    // const stateChange = useCallback((newValue) => setStateValue(newValue), []);
    // const zipChange = useCallback((newValue) => setZipValue(newValue), []); 

    const formSubmit = useCallback((data) => {
      //console.log(event.target.elements)
      var formData = {
        shopId: shopID,
        name: nameValue, //event.target.elements.name.value,
        street: streetValue, //event.target.elements.street.value,
        city: cityValue, //event.target.elements.city.value,
        state: stateValue, //event.target.elements.state.value,
        zip: zipValue, //event.target.elements.zip.value
        liftgate: false,
        residential: false
      }
      axios.post('/api/addlocation', formData, { headers: {     'Content-Type': 'application/json',   } })
      .then(result => {
        window.location.reload(false)
        
      })
      .catch(error => console.log(error))
    })  

    

    
  
    return (
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
    );
  }

  export default LocationInstall