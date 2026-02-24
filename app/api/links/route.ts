import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Fetch error:', error);
        // Return empty array if DB is not set up to prevent crash
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const { platform, url } = await request.json();

        const { data, error } = await supabase
            .from('links')
            .insert([{
                platform,
                url,
                status: 'Online',
                last_checked: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return NextResponse.json(data[0]);
    } catch (error) {
        console.error('Insert error:', error);
        return NextResponse.json({ error: 'Failed to add link' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
    }
}
