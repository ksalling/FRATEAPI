import React, { useState, useCallback } from 'react';
import store from 'store-js';
import { Card, Select } from '@shopify/polaris';
import axios from 'axios';

function DimensionSetting(appData) {

    //console.log(appData)

    const [selectedDimensionUnits, setDimensionUnits] = useState(appData.appData.data.appSettings.settings.units[0].dimensionUnits.value);
    
    const dimensionUnits = [
        { label: 'Inches', value: 'in' },
        { label: 'Centimeters', value: 'cm' },
    ];

    const handleDimensionChange = useCallback((selectedValue) => {
        setDimensionUnits(selectedValue);
        const filteredUpdate = dimensionUnits.filter(units => units.value == selectedValue);
        
        const data = { 
            item: 'dimension',
            filter: { shopId: store.get('shopId')}, 
            update: { dimensionUnits: { label: filteredUpdate[0].label, value: filteredUpdate[0].value } }
        }

        axios.post('/api/settingsupdate', data)
            .then(response => {
                //console.log(response)
        })
        
    })

    return (
        <Card title="Dimension" sectioned>
            <Select
                id='dimensionSelect'
                options={dimensionUnits}
                value={selectedDimensionUnits}
                onChange={handleDimensionChange}
            />
        </Card>
    )

}
export default DimensionSetting

