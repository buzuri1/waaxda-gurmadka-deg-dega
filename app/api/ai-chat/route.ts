import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    
    const supabase = createServerClient();
    const { data: incidents } = await supabase.from('incidents').select('*').order('taariikhda', { ascending: false });

    const systemPrompt = `You are the official AI assistant for "Gurmadka Deg Dega ee Gobolka Banadir" (Banadir Region Fire and Emergency Services), Mogadishu, Somalia.

You answer questions in Somali language about fire incidents in the database. Be professional, clear, and helpful. Use the incident data provided to answer accurately.

Current incident database:
${JSON.stringify(incidents, null, 2)}

Guidelines:
- Always respond in Somali
- Use exact numbers from the data
- For financial figures say "dollar" or "$"
- Be concise but complete
- If asked something not in the data, say "Xogtan kuma jirto nidaamka"
- Sign off responses with "— AI Gurmadka Banadir"`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const chatHistory = (history || []).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Jawaab lama helin.';
    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ response: 'Khalad ayaa dhacay. Fadlan hubi in API key-ga saxan yahay.' }, { status: 500 });
  }
}
