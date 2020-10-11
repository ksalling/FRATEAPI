import React, { useState, useCallback, useEffect } from 'react';
//import { Modal, FormLayout, Button, Select, TextField, Form, Stack, Card, Layout } from '@shopify/polaris';
import axios from 'axios';

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

function CarrierInstall({appData}) {

  const classes = useStyles();

  const [ shopID, setShopID ] = useState(appData.shopID);
  const [ carrierList, setCarrierList ] = useState([])
  const [ selected, setSelected ] = useState({ label: '', value: '' });
  const [ apiValue, setApiValue ] = useState('');
  const [ secretValue, setSecretValue ] = useState('');

  const handleApiChange = (event) => { setApiValue(event.target.value) }
  const handleSecretChange = (event) => { setSecretValue(event.target.value) }
  
  const handleSelectChange = (event) => { //setSelected(event.target.value) 
    const res = carrierList.find((item) => (item.value === event.target.value))
      setSelected({ label: res.label, value: event.target.value });
  };

  const { register, errors, handleSubmit } = useForm({mode:'onBlur', resolver: yupResolver(schema)});

  function carrierListInstall() {
    try {
      const carrierData = [
        {
          name: "R+L Carriers",
          apiAddress: "www.rlcarriers.com"
        },
        {
          name: "Purolator",
          apiAddress: "www.purolator.com"
        },
        {
          name: "Evergreen",
          apiAddress: "www.evergreen.com"
        }
      ]
      axios.post('/api/carrierlistinstall', carrierData)
        .then((response) => {
          console.log(response)
        })
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    axios.get('/api/carrierlist')
      .then(response => {
        
        var carrierArray = []
        response.data.carrierList.map((carrier, index) => (
          carrierArray.push( { label: carrier.name, value: carrier._id } )
        ))
        setCarrierList(carrierArray)
      })
  }, [])

  const formSubmit = useCallback((data) => {
    var formData = {
      shopId: shopID,
      name: selected.label, //event.target.elements.carrier.selectedOptions[0].text,
      carrierId: selected.value, //event.target.elements.carrier.selectedOptions[0].value,
      active: false,
      apiKey: apiValue, //event.target.elements.apiKey.value,
      apiSecret: secretValue //event.target.elements.apiSecret.value
    }

    axios.post('/api/addcarrier', formData, { headers: {     'Content-Type': 'application/json',   } })
      .then(result => {
        window.location.reload(false)
        
      })
      .catch(error => console.log(error))
  })

  
    return (
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
    );
  }

  export default CarrierInstall