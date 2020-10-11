import React, { useState } from 'react';
import { Stack, Layout, Card, Page } from '@shopify/polaris';
import { HashRouter as Router, Link, Route, Redirect } from 'react-router-dom';
import ProductPage  from './appPages/ProductPage';
import LocationPage from './appPages/LocationPage';
import CarrierPage from './appPages/CarrierPage';
import SettingsPage from './appPages/SettingsPage';
import HelpPage from './appPages/HelpPage';

import TestPage from './appPages/TestPage';

function Home(appSettings) {

    const [ appData, setAppData ] = useState(appSettings.appSettings);
    //console.log('index 3');

    return (
        <Router>
            <Redirect to="/products" />
            <Page>
            <Layout sectioned>
                <Layout.Section>
                    <Card sectioned>
                        <div style={{border: '0px solid black', width: 'auto' }}>
                            <Stack>
                                <p><Link to={'/products'}>Products</Link></p>
                                <p><Link to={'/locations'}>Locations</Link></p>
                                <p><Link to={'/carriers'}>Carriers</Link></p>
                                <p><Link to={'/settings'}>Settings</Link></p>
                                <p><Link to={'/help'}>Help</Link></p>
                                <p><Link to={'/test'}>Tests</Link></p>
                            </Stack>
                        </div>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                        <Route path="/products" component={ProductPage} exact />
                        <Route path="/locations" component={LocationPage} exact />
                        <Route path="/carriers" component={CarrierPage} exact />
                        <Route path="/settings" component={SettingsPage} exact />
                        <Route path="/help" component={HelpPage} exact />
                        <Route path="/test" component={TestPage} exact />
                </Layout.Section>
            </Layout>
            </Page>  
        </Router>
    )

}

export default Home;