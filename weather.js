exports.handler = async function (event) {
  try {
    const lat = event.queryStringParameters.lat;
    const lon = event.queryStringParameters.lon;

    if (!lat || !lon) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Missing lat/lon" })
      };
    }

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,relative_humidity_2m` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation` +
      `&daily=temperature_2m_max,precipitation_sum,relative_humidity_2m_min,relative_humidity_2m_max` +
      `&forecast_days=7` +
      `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: `Weather upstream error: ${response.status}` })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=900"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Weather proxy failed",
        details: err.message
      })
    };
  }
};