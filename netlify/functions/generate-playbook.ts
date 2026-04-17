import type { Handler } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method not allowed' };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const context = JSON.parse(event.body || '{}');

    const systemPrompt = `You are an expert marketing strategist specializing in destination escape rooms and immersive entertainment venues. You understand that destination businesses (those not in city centers) face unique challenges: they cannot rely on foot traffic, every customer is intentional, and their SEO must target people planning outings rather than people already nearby.

Your playbooks are direct, actionable, and specific. You never give generic advice. Every recommendation must be tailored to the specific venue's location, challenge, and competitive context provided.

Output format: Clean, structured Markdown with clear headers (##), bold key terms, and a seasonal strategy table.`;

    const userPrompt = `Generate a complete Marketing & SEO Playbook for this escape room venue:

Business Name: ${context.businessName}
Location: ${context.location}
Number of Rooms: ${context.rooms}
Primary Challenge: ${context.challenge}
Traffic Context: ${context.traffic}
Peak Season: ${context.peakSeason}
Nearest Competitor: ${context.competitorDistance}
Unique Selling Point: ${context.usp}

The playbook must include:
1. Core Brand Positioning (destination-focused)
2. Three Target Personas with specific pain points
3. Voice of Customer Website Copy (Homepage headline, sub-headline, GBP description)
4. The "Stop Doing / Start Doing" List (5 items each, specific to this venue)
5. Seasonal Marketing Plan (table format: Peak Season Actions vs. Slow Season Actions)
6. Top 5 Local SEO Quick Wins (specific to their location and challenge)`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const content = message.content[0];
    const text = content.type === 'text' ? content.text : '';

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ playbook: text }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};
