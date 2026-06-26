export default async function handler(req, res) {
  const { station } = req.query;

  if (!station || !/^[A-Za-z0-9]+$/.test(station)) {
    return res.status(400).json({ error: 'Invalid station ID' });
  }

  try {
    const response = await fetch(
      `https://www.ndbc.noaa.gov/data/realtime2/${station}.txt`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Station data unavailable' });
    }

    const text = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.setHeader('Content-Type', 'text/plain');
    res.send(text);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach NDBC' });
  }
}
