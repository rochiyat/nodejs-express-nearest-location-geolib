const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const example = require('../example.js');
const { isEmpty } = require('lodash');

// Definisikan rute GET /nearest-location
router.get('/nearest-location', (req, res) => {
  try {
    // Get the latitude, longitude, and location data parameters from the query string
    const { latitude, longitude } = req.query;

    let hospitals = [];
    const locations = example;

    locations.map((x) =>
      x.hospitalDetails.map((item) => {
        hospitals.push(item);
      })
    );

    // Calculate nearest location using geolib
    const nearestLocation = geolib.findNearest({ latitude, longitude }, hospitals);

    res.json(nearestLocation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Calculates the distance between two locations in unit
router.get('/distance-location/:unit', (req, res) => {
  try {
    const { unit } = req.params;
    const { latitudeFrom, longitudeFrom, latitudeTo, longitudeTo } = req.query;

    if(isEmpty(unit))
        res.status(500).send('Unit Mandatory');

    let distance;
    const distanceInMeters = geolib.getDistance(
      { latitude: latitudeFrom, longitude: longitudeFrom },
      { latitude: latitudeTo, longitude: longitudeTo }
    );

    switch (unit) {
      case 'km':
        distance = geolib.convertDistance(distanceInMeters, 'km');
        break;

      case 'mi':
        distance = geolib.convertDistance(distanceInMeters, 'mi');
        break;

      case 'nm':
        distance = geolib.convertDistance(distanceInMeters, 'nm');
        break;
    
      default:
        distance = distanceInMeters;
        break;
    }

    res.json(`${distance} ${unit}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// Calculates the distance between two locations in meters
router.get('/distance-location', (req, res) => {
  try {
    const { latitudeFrom, longitudeFrom, latitudeTo, longitudeTo, } = req.query;

    const distance = geolib.getDistance(
      { latitude: latitudeFrom, longitude: longitudeFrom },
      { latitude: latitudeTo, longitude: longitudeTo }
    );

    res.json(`${distance} meters`);
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// Export router agar bisa digunakan di file utama
module.exports = router;
