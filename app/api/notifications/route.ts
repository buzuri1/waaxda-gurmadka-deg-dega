import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const notifications: any[] = [];

  // 1. Fetch new incidents from last 24 hours
  try {
    const supabase = getServiceClient();
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const { data: newIncidents } = await supabase
      .from('incidents')
      .select('lambarka_warbixinta, degmada, nooca_hantida, created_at')
      .gte('created_at', yesterday)
      .order('created_at', { ascending: false });

    if (newIncidents) {
      newIncidents.forEach((inc) => {
        notifications.push({
          id: `inc-${inc.lambarka_warbixinta}`,
          type: 'incident',
          title: 'Dhacdada Cusub 🔥',
          description: `${inc.lambarka_warbixinta} · ${inc.degmada.split(',')[0]} · ${inc.nooca_hantida}`,
          time: inc.created_at,
          read: false,
        });
      });
    }
  } catch (e) {
    console.error('Incidents fetch error:', e);
  }

  // 2. Fetch recent GitHub commits
  try {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (token && owner && repo) {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=3`,
        { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } }
      );
      if (res.ok) {
        const commits = await res.json();
        if (Array.isArray(commits)) {
          commits.forEach((commit: any) => {
            notifications.push({
              id: `commit-${commit.sha?.slice(0, 7)}`,
              type: 'commit',
              title: '⚙️ Nidaamka Wax Laga Bedelay',
              description: commit.commit?.message?.slice(0, 80) || 'Wax la bedelay',
              time: commit.commit?.author?.date || new Date().toISOString(),
              read: false,
            });
          });
        }
      }
    }
  } catch (e) {
    console.error('GitHub fetch error:', e);
  }

  // Sort by time descending
  notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return NextResponse.json(notifications);
}
