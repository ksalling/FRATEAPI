import React, { useState, useCallback } from 'react';
import store from 'store-js';
import { Card, Select } from '@shopify/polaris';
import axios from 'axios';

function WeightSetting(appData) {

    const [selectedWeightUnits, setWeightUnits] = useState(appData.appData.data.appSettings.settings.units[0].weightUnits.value);

    const weightUnits = [
        { label: 'Pounds', value: 'lbs' },
        { label: 'Kilograms', value: 'kg' },
    ];

    const handleWeightChange = useCallback((selectedValue) => {
        setWeightUnits(selectedValue);
        const filteredUpdate = weightUnits.filter(items => items.value == selectedValue);

        const data = { 
            item: 'weight',
            filter: { shopId: store.get('shopId')}, 
            update: { weightUnits: { label: filteredUpdate[0].label, value: filteredUpdate[0].value } }
        }

        axios.post('/api/settingsupdate', data)
                .then(response => {
                    //console.log(response)        
        })

    });

    return (
        <Card title="Weight" sectioned>
            <Select
                id='weightSelect'
                options={weightUnits}
                value={selectedWeightUnits}
                onChange={handleWeightChange}
            />
        </Card>
    )
}
export default WeightSetting