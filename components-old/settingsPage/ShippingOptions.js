import React, { useEffect, useState, useCallback } from 'react';
import { FormGroup, FormControlLabel, Switch } from "@material-ui/core/";

function ShippingOptions() {
    
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
      });
    
    const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <FormGroup row>
            <FormControlLabel
                control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                label="Secondary"
            />
            <FormControlLabel
                control={
                <Switch
                    checked={state.checkedB}
                    onChange={handleChange}
                    name="checkedB"
                    color="primary"
                />
                }
                label="Primary"
            />
            <FormControlLabel control={<Switch />} label="Uncontrolled" />
            <FormControlLabel disabled control={<Switch />} label="Disabled" />
            <FormControlLabel disabled control={<Switch checked />} label="Disabled" />
        </FormGroup>
    )

}

export default ShippingOptions;