const request = require('request');

const forecast = (lat, lng, callback) => {
  const url = `https://api.darksky.net/forecast/9faf69bfe9e9c57a2d8275f013cbfff4/${lat},${lng}?units=si`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weather service', undefined);
    } else if (response.body.error) {
      callback('Unable to find location', undefined);
    } else {
      const {
        currently: { temperature, precipProbability },
        daily
      } = response.body;
      callback(
        undefined,
        `${daily.data[0].summary} It is currently ${temperature} degrees out. There is a ${precipProbability}% chance of rain`
      );
    }
  });
};

module.exports = forecast;
