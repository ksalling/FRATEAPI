import App from 'next/app';
import Head from 'next/head';
//import { AppProvider } from '@shopify/polaris';
//import { Provider } from '@shopify/app-bridge-react';
//import '@shopify/polaris/styles.css';
//import translations from '@shopify/polaris/locales/en.json';
//import Cookies from 'js-cookie';
//import ApolloClient from 'apollo-boost';
//import { ApolloProvider } from 'react-apollo';

import Index from './index';

//import CssBaseline from '@material-ui/core/CssBaseline';
//import 'fontsource-roboto';

// const client = new ApolloClient({
//     fetchOptions: {
//         credentials: 'include'
//     }
// })


class MyApp extends App {  

  render() {
  //  const { Component, pageProps } = this.props;
  //  const config = { apiKey: API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };
    console.log('test')


    return (
      <React.Fragment>
        
        <Head>
          <title>Frate</title>
          <meta charSet="utf-8" />
        </Head>
        <Index />
      </React.Fragment>
    );
  }
}

export default MyApp;

{/* <Provider config={config}>
            <AppProvider i18n={translations}>
                <ApolloProvider client={client} >
                  
                    <Component {...pageProps} />
                  
                </ApolloProvider>
            </AppProvider>
        </Provider> */}