import { NextResponse } from 'next/server';
import axios from 'axios';
import { Resend } from 'resend';
import { createServiceRoleClient } from '@/utils/supabase/service';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('--- LinkGuardian Global Cron Job Started ---');

    const supabase = createServiceRoleClient();

    // Fetch all monitored links
    const { data: monitoredLinks, error } = await supabase
        .from('links')
        .select('*');

    if (error) {
        console.error('Failed to fetch links:', error);
        return NextResponse.json({ error: 'DB fetch failed' }, { status: 500 });
    }

    const results = [];

    for (const item of monitoredLinks || []) {
        const isHealthy = await checkLinkStatus(item.url, item.id, item.user_id, supabase);
        results.push({ url: item.url, isHealthy });
    }

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        count: monitoredLinks?.length || 0,
        results
    });
}

async function checkLinkStatus(url: string, id: string, userId: string, supabase: any) {
    let statusStr = 'Online';
    let isHealthy = true;

    try {
        const response = await axios.get(url, {
            timeout: 8000,
            headers: { 'User-Agent': 'LinkGuardian-Bot/1.0' }
        });
    } catch (error: any) {
        isHealthy = false;
        const statusCode = error.response ? error.response.status : (error.code || 'TIMEOUT');
        statusStr = `${statusCode} Error`;

        console.error(`🚨 ALERT: ${url} is down for user ${userId}`);

        let notifyEmail = process.env.NOTIFICATION_EMAIL;

        // Try to get user email from auth.users, but don't fail if service role key is missing
        try {
            if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
                const { data: userData } = await supabase.auth.admin.getUserById(userId);
                if (userData?.user?.email) {
                    notifyEmail = userData.user.email;
                }
            }
        } catch (e) {
            console.error('Failed to fetch user email (missing service role key?). Using default fallback.');
        }

        if (process.env.RESEND_API_KEY && notifyEmail) {
            await sendAlertEmail(notifyEmail, url, statusStr);
        }
    }

    await supabase
        .from('links')
        .update({ status: statusStr, last_checked: new Date().toISOString() })
        .eq('id', id);

    return isHealthy;
}

async function sendAlertEmail(to: string, targetUrl: string, status: string) {
    try {
        await resend.emails.send({
            from: 'LinkGuardian <alerts@linkguardian.net>',
            to: [to],
            subject: `🚨 Action Required: Link Broken on LinkGuardian`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">🚨 Link Alert!</h2>
          <p style="font-size: 16px; line-height: 1.5;">Your monitored link is currently down.</p>
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Link:</strong> <a href="${targetUrl}" style="color: #3b82f6;">${targetUrl}</a></p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">${status}</span></p>
          </div>
          <p style="font-size: 14px; color: #64748b;">Please check your bio link to ensure your audience can find you.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated message from LinkGuardian.</p>
        </div>
      `,
        });
    } catch (err) {
        console.error('Email failure:', err);
    }
}
