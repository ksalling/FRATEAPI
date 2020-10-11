import React, { useState, useCallback } from 'react';
import { Modal, FormLayout, TextField, Stack, Button, Form, Card, Layout } from '@shopify/polaris';
import axios from 'axios';

function LocationInstall({appData}) {

  //console.log(appData)

  const [ shopID, setShopID ] = useState(appData.shopID);

    const [nameValue, setNameValue] = useState('');
    const [streetValue, setStreetValue] = useState('');
    const [cityValue, setCityValue] = useState('');
    const [stateValue, setStateValue] = useState('');
    const [zipValue, setZipValue] = useState('');

    const nameChange = useCallback((newValue) => setNameValue(newValue), []);
    const streetChange = useCallback((newValue) => setStreetValue(newValue), []);
    const cityChange = useCallback((newValue) => setCityValue(newValue), []);
    const stateChange = useCallback((newValue) => setStateValue(newValue), []);
    const zipChange = useCallback((newValue) => setZipValue(newValue), []); 

    const formSubmit = useCallback((_event) => {
      //console.log(event.target.elements)
      var formData = {
        shopId: shopID,
        name: event.target.elements.name.value,
        street: event.target.elements.street.value,
        city: event.target.elements.city.value,
        state: event.target.elements.state.value,
        zip: event.target.elements.zip.value
      }
      axios.post('/api/addlocation', formData, { headers: {     'Content-Type': 'application/json',   } })
      .then(result => {
        window.location.reload(false)
        
      })
      .catch(error => console.log(error))
    })  
  
    return (
        <Layout sectioned>
            <Form onSubmit={formSubmit}>
              <FormLayout>
                  <TextField name="name" label="Name" value={nameValue} onChange={nameChange} />
                  <TextField name="street" label="Street" value={streetValue} onChange={streetChange} />
              
              <FormLayout.Group condensed>
                  <TextField name="city" label="City" style={{width: '100px'}} value={cityValue} onChange={cityChange} />
                  <TextField name="state" label="State" value={stateValue} onChange={stateChange} />
                  <TextField name="zip" label="Zip" value={zipValue} onChange={zipChange}/>
                  
              </FormLayout.Group>
              <FormLayout.Group>
                  <Stack distribution="trailing" >
                          <Button submit style={{backgroundColor: 'green'}}>Save</Button>
                  </Stack>
              </FormLayout.Group>
              </FormLayout>
            </Form>
        </Layout>
    );
  }

  export default LocationInstall