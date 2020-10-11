import React, { useState, useCallback } from 'react';
//import { Modal, Button, Form, Select, Stack, FormLayout, Layout, Card } from '@shopify/polaris';
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
      left: -1,
      fontSize: 12,
    },
  },
}));



function UnitInstall({appData}) {

  const weightUnits = [
    { label: 'Pounds', value: 'lbs' },
    { label: 'Kilograms', value: 'kg' },
  ];

  const dimensionUnits = [
    { label: 'Inches', value: 'in' },
    { label: 'Centimeters', value: 'cm' },
  ];
  //console.log(appData)

  const classes = useStyles();
  const [weight, setWeight] = React.useState({ label: 'Pounds', value: 'lbs' });
  const [dimension, setDimension] = React.useState({ label: 'Inches', value: 'in' });
  const [open, setOpen] = React.useState(false);

  const handleWeightChange = (event) => {
    const res = weightUnits.find((item) => (item.value === event.target.value))
    //console.log(res);
    setWeight({ label: res.label, value: event.target.value });
  };

  const handleDimensionChange = (event) => {
    const res = dimensionUnits.find((item) => (item.value === event.target.value))
    setDimension({ label: res.label, value: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const [ shopID, setShopID ] = useState(appData.shopID);
  // const [selectedWeightUnits, setWeightUnits] = useState('');
  // const [selectedDimensionUnits, setDimensionUnits] = useState('');

  // const handleWeightChange = useCallback((selectedValue) => {
  //   setWeightUnits(selectedValue);
  // });

  // const handleDimensionChange = useCallback((selectedValue) => {
  //   setDimensionUnits(selectedValue);
  // })

  //console.log(shopID)
  const formSubmit = useCallback((_event) => {
    var formData = {
      shopId: shopID,
      forceRes: false,
      forceGate: false,
      upcharge: "0",
      upChargeType: "%",
      useGeo: false,
      dimensionUnits: {
        label: dimension.label, //event.target.elements.dimensionSelect.selectedOptions[0].text,
        value: dimension.value //event.target.elements.dimensionSelect.selectedOptions[0].value
      },
      weightUnits: {
        label: weight.label, //event.target.elements.weightSelect.selectedOptions[0].text,
        value: weight.value //event.target.elements.weightSelect.selectedOptions[0].value
      }
    }
    axios.post('/api/addunits', formData, { headers: {     'Content-Type': 'application/json',   } })
    .then(result => {
      window.location.reload(false)
    })
    .catch(error => console.log(error))
  })
  
  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={formSubmit}>
      <div>
        <TextField className={classes.inputLabel}
          label="Weight"
          value={weight.value}
          onChange={handleWeightChange}
          variant="outlined"
          select
          style={{width: "100px"}}
        >
          {weightUnits.map((item, index) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            )) 
          }
        </ TextField>
        <TextField className={classes.inputLabel}
          label="Dimension"
          value={dimension.value}
          onChange={handleDimensionChange}
          variant="outlined"
          select
          style={{width: "100px"}}
        >
          {dimensionUnits.map((item, index) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            )) 
          }
        </ TextField>
      </div>
      <div style={{textAlign: "right"}}>
        <Button style={{marginRight: "1%"}} type="submit" variant="contained" color="primary" >Save</Button>
      </div>
    </form>
  );
}

  export default UnitInstall


  // <Form onSubmit={formSubmit}>
  //         <FormLayout>
  //           <Stack distribution="fillEvenly">
  //             <Select
  //                 label="Weight"
  //                 id='weightSelect'
  //                 options={weightUnits}
  //                 value={selectedWeightUnits}
  //                 onChange={handleWeightChange}
  //             />
  //             <Select
  //                 label="Dimensions"
  //                 id='dimensionSelect'
  //                 options={dimensionUnits}
  //                 value={selectedDimensionUnits}
  //                 onChange={handleDimensionChange}
  //             />
  //           </Stack>
  //           <Stack distribution="trailing" >
  //             <Button submit>Save</Button>
  //           </Stack>
  //         </FormLayout>
  //       </Form>