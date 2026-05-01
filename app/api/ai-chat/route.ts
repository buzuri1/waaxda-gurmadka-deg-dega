import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    // Fetch all incidents using service role key (bypasses RLS)
    const supabase = getServiceClient();
    const { data: incidents } = await supabase
      .from('incidents')
      .select('*')
      .order('taariikhda', { ascending: false });

    const incidentCount = incidents?.length || 0;
    const totalDamage = incidents?.reduce((sum, i) => sum + (Number(i.khasaaraha_hantida) || 0), 0) || 0;
    const totalFirefighters = incidents?.reduce((sum, i) => sum + (Number(i.tirada_dabdamiyasha) || 0), 0) || 0;
    const avgResponse = incidentCount > 0
      ? Math.round((incidents?.reduce((sum, i) => sum + (Number(i.waqtiga_jawaabta) || 0), 0) || 0) / incidentCount)
      : 0;

    const systemPrompt = `Adiga waxaad tahay AI-ga rasmiga ah ee "Gurmadka Deg Dega ee Gobolka Banadir" (Banadir Region Fire & Emergency Services), Muqdisho, Soomaaliya.

Shaqadaada:
- Ka jawaab su'aalaha ku saabsan dhacdooyinka dabka ee Gobolka Banaadir
- Ku jawaab Af-Soomaali oo keliya, si professional ah oo rasmi ah
- Isticmaal xogta database-ka si saxda ah — ha been shegin
- Haddaan xogtu jirin, dheh: "Xogtan kuma jirto nidaamka"
- Ku dhamee jawaab kasta: "— AI Gurmadka Banadir 🔥"

Macluumaadka Guud (hadda):
- Wadarta Dhacdooyinka: ${incidentCount}
- Wadarta Khasaaraha Hantida: $${totalDamage.toLocaleString()}
- Wadarta Dabdamiyasha: ${totalFirefighters} qof
- Celceliska Waqtiga Jawaabta: ${avgResponse} daqiiqo

Xogta Dhacdooyinka:
${JSON.stringify(incidents || [], null, 2)}

Tilmaamo:
- Haddii la weydiiyo tirada dhacdooyinka, u sheeg ${incidentCount}
- Xisaabi degmadaha, sababaha, noocyada si saxda ah
- Ku jawaab si kooban, cad, oo xog-raac ah`;

    const apiKey = process.env.CHAT_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('your_')) {
      return NextResponse.json({ response: '❌ API KEY lama helin. Fadlan .env.local hubi.' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const chatHistory = (history || [])
      .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({
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
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content || 'Jawaab lama helin.';
    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('AI Chat Error:', error?.message);
    return NextResponse.json(
      { response: `❌ Xiriirka AI-ga wuu jajabay. ${error?.message || 'Khalad aan la aqoon'}` },
      { status: 500 }
    );
  }
}
