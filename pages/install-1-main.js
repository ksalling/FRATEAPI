import React, { useState } from 'react';
import { Card, Layout, Page, Button, DisplayText, Stack } from '@shopify/polaris';

import UnitInstall from '../components/installPage/UnitInstall';
import LocationInstall from '../components/installPage/LocationInstall';
import CarrierInstall from '../components/installPage/CarrierInstall';


function InstallPage(appSettings) {

    const [ appData, setAppData ] = useState(appSettings.appSettings)
    //console.log('Install Page')

    return (
        
        <Page>
        <Layout>
            
            <Layout.Section>
                        <DisplayText size="medium" element="h1">Follow the steps below to setup the app...</DisplayText>
                    </Layout.Section>
                    <Layout.AnnotatedSection
                        title="App Setup Steps"
                        description="Click on the buttons to the right to complete all the steps to activate the app."    
                    >
                        { appData.install.units ?
                            <Card title="Select Metric or Standard Units" sectioned >
                                <UnitInstall appData={ appData } />
                            </Card>
                        : 
                            <p></p>
                        }
                        { appData.install.location ?
                            <Card title="Add a Ship From Location" sectioned>
                                    <LocationInstall appData={ appData } />
                                
                            </Card>
                        :
                            <p></p>
                        }
                        { appData.install.carrier ?
                            <Card title="Set Your Shipper API Keys" sectioned >
                                    <CarrierInstall appData={ appData } />
                            </Card>
                        :
                            <p></p>
                        }
                </Layout.AnnotatedSection>

        </Layout>
        </Page>
        
    )
}

export default InstallPage