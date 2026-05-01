import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
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

    // Fetch all incidents using service role key so RLS doesn't block
    const supabase = getServiceClient();
    const { data: incidents, error: dbError } = await supabase
      .from('incidents')
      .select('*')
      .order('taariikhda', { ascending: false });

    if (dbError) {
      console.error('Supabase fetch error:', dbError);
    }

    const incidentCount = incidents?.length || 0;
    const totalDamage = incidents?.reduce((sum, i) => sum + (Number(i.khasaaraha_hantida) || 0), 0) || 0;
    const totalFirefighters = incidents?.reduce((sum, i) => sum + (Number(i.tirada_dabdamiyasha) || 0), 0) || 0;
    const avgResponseTime = incidentCount > 0
      ? Math.round((incidents?.reduce((sum, i) => sum + (Number(i.waqtiga_jawaabta) || 0), 0) || 0) / incidentCount)
      : 0;

    const systemPrompt = `Adiga waxaad tahay AI-ga rasmiga ah ee "Gurmadka Deg Dega ee Gobolka Banadir" (Banadir Region Fire & Emergency Services), Muqdisho, Soomaaliya.

Shaqadaada:
- Ka jawaab su'aalaha ku saabsan dhacdooyinka dabka ee Gobolka Banaadir
- Ku jawaab Af-Soomaali oo keliya, haddeer professional ah oo rasmi ah
- Isticmaal xogta database-ka si saxda ah — ha been shegin
- Haddaan xogtu jirin, dheh: "Xogtan kuma jirto nidaamka"
- Ku dhamee jawaab kasta iyadoo lagu leeyahay "— AI Gurmadka Banadir 🔥"

Macluumaadka Guud ee Nidaamka (hadda):
- Wadarta Dhacdooyinka: ${incidentCount}
- Wadarta Khasaaraha Hantida: $${totalDamage.toLocaleString()}
- Wadarta Dabdamiyasha Loo Adeegsaday: ${totalFirefighters} qof
- Celceliska Waqtiga Jawaabta: ${avgResponseTime} daqiiqo

Xogta Dhacdooyinka Oo Dhan (JSON format):
${JSON.stringify(incidents || [], null, 2)}

Tilmaamo muhiim ah:
- Haddii la weydiiyo tirada dhacdooyinka, u sheeg ${incidentCount}
- Haddii la weydiiyo lacagta khasaaraha, u sheeg $${totalDamage.toLocaleString()}
- Haddii la weydiiyo degmada ugu dhacdooyinka badan, xisaabi oo sheeg
- Haddii la weydiiyo sababaha dabka, faahfaahi
- Ku jawaab si kooban, cad, oo xog-raac ah`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_key_here') {
      return NextResponse.json({
        response: '❌ ANTHROPIC_API_KEY lama helin server-ka. Fadlan .env.local wax ka beddel.'
      }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    // Build message history (exclude system messages, only user/assistant)
    const messageHistory = (history || [])
      .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const claudeResponse = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...messageHistory,
        { role: 'user', content: message },
      ],
    });

    const responseText =
      claudeResponse.content[0].type === 'text'
        ? claudeResponse.content[0].text
        : 'Jawaab lama helin.';

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    const errorMsg = error?.message || 'Khalad aan la aqoon';
    return NextResponse.json(
      { response: `❌ Xiriirka AI-ga wuu jajabay. ${errorMsg}` },
      { status: 500 }
    );
  }
}
