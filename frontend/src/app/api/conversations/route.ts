import { NextResponse } from 'next/server';

let conversations: any[] = [];

export async function GET() {
  return NextResponse.json(conversations);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newConversation = {
    id: Date.now().toString(),
    title: body.title || 'New Conversation',
    model: body.model || 'gpt-4',
    created_at: new Date().toISOString(),
  };

  conversations.unshift(newConversation);

  return NextResponse.json(newConversation);
}
