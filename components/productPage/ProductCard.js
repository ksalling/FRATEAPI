import React, { useCallback, useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, ResourceList, Stack, TextStyle, Thumbnail, Form, FormLayout, TextField, Button, Select, TextContainer, Heading, DisplayText } from '@shopify/polaris';
import { Spinner } from '@shopify/polaris';
import axios from 'axios';

const GET_PRODUCTS_BY_ID = gql`
query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

function ProductCard(product, index) {

  //console.log(product);
  //console.log(index);
  // var locationOptions = [];
  // var carrierOptions = [];


  const [ length, setLength ] = useState(product.products.len)
  const [ width,  setWidth ] = useState(product.products.width)
  const [ height, setHeight ] = useState(product.products.height)
  const [ weight, setWeight ] = useState(product.products.weight)
  const [ carrier, setCarrier ] = useState(product.products.carrier)
  const [ location, setLocation ] = useState(product.products.location)

  const [ locationOptions, setLocationOptions ] = useState([])
  const [ carrierOptions, setCarrierOptions ] = useState([])

  const handleLengthChange = useCallback((newValue) => setLength(newValue), []);
  const handleWidthChange = useCallback((newValue) => setWidth(newValue), []);
  const handleHeightChange = useCallback((newValue) => setHeight(newValue), []);
  const handleWeightChange = useCallback((newValue) => setWeight(newValue), []);
  const handleCarrierChange = useCallback((newValue) => setCarrier(newValue), []);
  const handleLocationChange = useCallback((newValue) => setLocation(newValue), []);

  const ids = product.products.productId;
  const shopId = product.products.shopId;

  const deleteProduct = useCallback(() => {
    const productId = { id: product.products._id }
    axios.post('/api/deleteproduct', productId)
      .then(result => {
        window.location.reload(false);
      })
      .catch(error => console.log(error))
  })

  const saveProduct = useCallback(() => {
    const updateData = { 
      id: product.products._id,
      shopID: shopId,
      productId: ids,
      len: length,
      width: width,
      height: height,
      weight: weight,
      carrier: carrier,
      location: location
    }
    axios.post('/api/updateproduct', updateData)
      .then(result => {
        window.location.reload(false);
      })
      .catch(error => console.log(error))
  })

  useEffect(() => {
    const reqData = {shopId: shopId};
    axios.post('/api/getcarloc', reqData)
      .then( result => {
        console.log(result)
        var carrierArray = [];
        var locationArray = [];
        result.data.carriers.map((carrier) => {
          carrierArray.push({ label: carrier.name, value: carrier._id })
          console.log(carrier);
        })
        result.data.locations.map((location) => {
          locationArray.push({ label: location.name, value: location._id })
        })
        setLocationOptions(locationArray);
        setCarrierOptions(carrierArray);
      })
      .catch(error => console.log(error))
  }, [])

  //var ids = [];
  // products.products.map((product) => {
  //   ids.push(product.productId);
  // })

  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_ID, {variables: {ids: ids}});

  // const locationOptions = [
  //   {label: 'Cincinnati', value: 'cincinnati'},
  //   {label: 'Los Angeles', value: 'losangeles'},
  //   {label: 'Miami', value: 'miami'}
  // ];

  // const carrierOptions = [
  //   {label: 'RL Carriers', value: 'rlcarriers'},
  //   {label: 'Evergreen', value: 'evergreen'},
  //   {label: 'Purolator', value: 'purolator'}
  // ];

  if (loading) {
    return (
        <div style={{height: '100px'}}>
            <Spinner accessibilityLabel="Spinner example" size="large" color="teal" />
        </div>
    ) } //return 'Loading...';
  if (error) return <div>{error.message}</div>

  //console.log('this is the data', data);

  return (


    <Card>
      <ResourceList
        resourceName={{ singular: 'Product', plural: 'Products' }}
        items={data.nodes}
        renderItem={item => {
          const media = (
            <Thumbnail
              source= {
                item.images.edges[0] ? item.images.edges[0].node.originalSrc : ''
              }
              alt={
                item.images.edges[0] ? item.images.edges[0].altText: ''
              }
            />
          );
          const price = item.variants.edges[0].node.price;
          return (
            <ResourceList.Item
              id={item.id}
              media={media}
              accessibilityLabel={`View Details for ${item.title}`}
            >

            <Stack.Item fill>
                <DisplayText element="h1" size="medium"><TextStyle variation="strong">
                  {item.title}
                </TextStyle></DisplayText>
            </Stack.Item>
            <Stack.Item>
              <Form onSubmit={saveProduct} >
                <FormLayout>
                  <Stack>
                    <TextField label="Length (in)" type="number" value={length} onChange={handleLengthChange} />
                    <TextField label="Width (in)" type="number" value={width} onChange={handleWidthChange} />
                    <TextField label="Height (in)" type="number" value={height} onChange={handleHeightChange} />
                  </Stack>
                  <Stack>
                    <TextField label="Weight (lbs)" type="number" value={weight} onChange={handleWeightChange} />
                    <Select label="Ship From Location" options={locationOptions} value={location} onChange={handleLocationChange} />
                    <Select label="Preferred Carrier" options={carrierOptions} value={carrier} onChange={handleCarrierChange} />
                  </Stack>
                  <Stack distribution="fillEvenly">
                    <Button destructive onClick={deleteProduct} >Delete</Button>
                    <Button primary submit >Submit</Button>
                  </Stack>
                </FormLayout>
              </Form>
            </Stack.Item>
          </ResourceList.Item>
          )
        }}
      />
    </Card>
  )
}

export default ProductCard;