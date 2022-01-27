import React, { useState, useEffect } from 'react';
import {
  TextField, Card, CardContent, Button, Autocomplete, Box,
} from '@mui/material';

import {
  GoogleMap,
  useLoadScript,
  Autocomplete as GoogleAutocomplete,
} from '@react-google-maps/api';

import axios from 'axios';
import mapStyles from '../mapStyles.js';
import ErrorBoundary from './ErrorBoundaries.jsx';

const libraries = ['places'];
const mapContainerStyle = {
  marginTop: '10px',
  width: '228px',
  height: '228px',
};

const PartnerChoice = ({ partner, setPartner, setAppState }) => {
  const [friends, setFriends] = useState([]);

  // Get curren user id from local storage
  const currentUserId = localStorage.getItem('userId');
  // AJAX Call: get friends of user from db
  useEffect(() => {
    axios.get(`/user/allFriends/${currentUserId}`)
      .then((result) => {
        setFriends(result.data);
        console.log('axios get friends', result.data);
      });
  }, []);
  console.log('friends', friends);
  const handleChange = (e, value) => {
    // sets chosen partner's uid
    console.log('partner value', value.id);
    setPartner(`${value.id}`);
  };

  const addFriendsClick = (e) => {
    e.preventDefault();
    setAppState('friends');
  };

  return (

    <CardContent>
      {friends ? (
        <div>
          <Autocomplete
            onChange={handleChange}
            // sets options as friends array
            options={friends}
            // renders name of each element of friends
            getOptionLabel={(option) => option.name}
            // What does this line do?
            renderInput={(params) => <TextField {...params} label="Pick a partner" />}
          />
          <Button size="small" onClick={addFriendsClick}>
            Add Friend
          </Button>
        </div>
      )
        : (
          <div>
            <h2>It seems like you don't have any friends yet.</h2>
            <Button size="small" onClick={addFriendsClick}>Add friends</Button>
          </div>
        )}
    </CardContent>

  );
};

const Map = ({ coordinates, setCoordinates }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const onLoad = (autoC) => setAutocomplete(autoC);
  const onPlaceChanged = () => {
    // Google Maps API command
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    // Sets Coordinates on the map
    setCoordinates({ lat, lng });
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';

  // Google Map options, all UI disabled
  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
  };
  return (

    <CardContent sx={{ mt: '-28px' }}>
      <GoogleAutocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <TextField
          sx={{
            width: '228px',
          }}
          label="Search"
          variant="outlined"
        />
      </GoogleAutocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={coordinates}
        options={options}
      />
    </CardContent>

  );
};

const FormOne = ({ setFormOneParams, setFormState, setAppState }) => {
  const [partner, setPartner] = useState('');
  const [coordinates, setCoordinates] = useState({
    // Singapore's coordinates
    lat: 1.3521,
    lng: 103.8198,
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log('page 1 form click running');
    // Packaging same page info into object
    const data = {
      coordinates,
      partner,
    };
    console.log('coordinates', coordinates);
    console.log('partner', partner);

    setFormOneParams(data);
    setFormState(2);
  };

  return (
    <div>
      <Card className="frosted-card">
        <ErrorBoundary>
          <PartnerChoice partner={partner} setPartner={setPartner} setAppState={setAppState} />
        </ErrorBoundary>
        <Map coordinates={coordinates} setCoordinates={setCoordinates} />
      </Card>
      <Box className="center-box">
        <Button className="wide-button" variant="contained" onClick={handleClick}>Next</Button>
      </Box>

    </div>
  );
};

export { FormOne };
