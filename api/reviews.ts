import type { VercelRequest, VercelResponse } from '@vercel/node';

// We fetch directly from the Upstash Redis REST API using the Vercel KV environment variables
const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;

interface Review {
  id: string;
  name: string;
  company: string;
  rating: number;
  message: string;
  date: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!kvUrl || !kvToken) {
    return res.status(500).json({ error: 'Database environment variables not configured on Vercel.' });
  }

  try {
    if (req.method === 'GET') {
      // Fetch reviews list from KV
      const response = await fetch(`${kvUrl}/get/reviews_list`, {
        headers: {
          Authorization: `Bearer ${kvToken}`
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch reviews from database.' });
      }

      const data = await response.json();
      const resultString = data.result;

      if (!resultString) {
        return res.status(200).json([]);
      }

      try {
        const reviews = JSON.parse(resultString);
        return res.status(200).json(Array.isArray(reviews) ? reviews : []);
      } catch (parseErr) {
        return res.status(200).json([]);
      }
    }

    if (req.method === 'POST') {
      const { name, company, rating, message } = req.body;

      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const newReview: Review = {
        id: `review-${Date.now()}`,
        name: name.trim(),
        company: (company && typeof company === 'string') ? company.trim() : 'Independent Client',
        rating: ratingNum,
        message: message.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };

      // 1. Get existing reviews
      const getResponse = await fetch(`${kvUrl}/get/reviews_list`, {
        headers: {
          Authorization: `Bearer ${kvToken}`
        }
      });

      let reviewsList: Review[] = [];
      if (getResponse.ok) {
        const getData = await getResponse.json();
        if (getData.result) {
          try {
            reviewsList = JSON.parse(getData.result);
            if (!Array.isArray(reviewsList)) {
              reviewsList = [];
            }
          } catch (e) {
            reviewsList = [];
          }
        }
      }

      // 2. Append new review
      reviewsList.push(newReview);

      // 3. Save back to KV using Redis SET command
      const setResponse = await fetch(kvUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', 'reviews_list', JSON.stringify(reviewsList)])
      });

      if (!setResponse.ok) {
        return res.status(500).json({ error: 'Failed to write review to database.' });
      }

      return res.status(200).json(newReview);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
