const { v4: uuid } = require('uuid');

// HOTELS
const hotels = [
  {
    id: 'h1',
    name: 'Hotel Warszawa',
    address: 'Warszawa'
  },
  {
    id: 'h2',
    name: 'Hotel Kraków',
    address: 'Kraków'
  }
];

// ROOMS
const rooms = [
  {
    id: 'r1',
    hotelId: 'h1',
    number: '101',
    type: 'single',
    price: 100
  },
  {
    id: 'r2',
    hotelId: 'h1',
    number: '102',
    type: 'double',
    price: 200
  },
  {
    id: 'r3',
    hotelId: 'h2',
    number: '201',
    type: 'single',
    price: 120
  }
];

// RESERVATIONS
const reservations = [];

module.exports = {
  hotels,
  rooms,
  reservations,
  uuid
};