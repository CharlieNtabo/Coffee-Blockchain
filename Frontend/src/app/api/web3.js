export default async function handler(req, res) {
    const { method, query, body } = req;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
    try {
      const response = await fetch(`${apiUrl}${req.url.replace('/api', '')}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? JSON.stringify(body) : null,
      });
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }