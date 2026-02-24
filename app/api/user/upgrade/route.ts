import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Upgrade user to Pro in the profiles table (using upsert to ensure row exists)
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                is_pro: true,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Account upgraded to Pro successfully!' });
    } catch (error) {
        console.error('Upgrade error:', error);
        return NextResponse.json({ error: 'Failed to upgrade account' }, { status: 500 });
    }
}
