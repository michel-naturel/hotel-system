const express = require('express');
const cors = require('cors');

const roomRoutes = require('./modules/room/room.routes');
const reservationRoutes = require('./modules/reservation/reservation.routes');
const hotelRoutes = require('./modules/hotel/hotel.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hotel API działa 🚀');
});

// ROUTES
app.use('/rooms', roomRoutes);
app.use('/reservations', reservationRoutes);
app.use('/hotels', hotelRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});