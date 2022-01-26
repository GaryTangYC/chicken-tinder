/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import { Sequelize } from 'sequelize';

// Initialize dotenv to pull secrets for salting process
dotenv.config();

class MatchCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  async createSession(req, res) {
    console.log('POST Request: /match');
    console.log('req.body', req.body);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    console.log('to get lat & lng and insert into DB ');
    // Destructure params from front end
    const {
      currentUserId, coordinates, cuisine, dateTime, partner, price, rating,
    } = req.body;
    const { lat } = coordinates;
    const { lng } = coordinates;
    console.log('coordinates', coordinates);

    console.log('lat', lat);
    console.log('lng', lng);

    // placeHolder to perform a get request store it and save in a const
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=2000&type=restaurant&keyword=chinese`;

    const response = await axios.get(url);
    // console.log('response to gAPI', response);
    const searchResult = response.data;
    console.log(searchResult);

    const initLikesList = [{ restaurant_id: 'null', likes: { p1_like: 'null', p2_like: 'null' } }];

    const createSession = await this.model.create({
      p1Id: currentUserId,
      p2Id: partner,
      // eslint-disable-next-line quote-props
      parameters: {
        url, cuisine, dateTime, partner, price, rating,
      },
      searchResults: searchResult,
      likesList: initLikesList,
    });

    res.status(200).send({ createdDB: createSession });
  }
}

export default MatchCtrl;
