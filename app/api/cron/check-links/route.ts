import { NextResponse } from 'next/server';
import axios from 'axios';
import { Resend } from 'resend';

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
    // Security check: Only allow Vercel Cron or specific secret header
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('--- LinkGuardian Cron Job Started (Powered by Resend) ---');

    // In a real app, you would fetch links from a database (e.g., Supabase)
    const monitoredLinks = [
        { url: 'https://instagram.com/user', email: 'user@example.com' },
        { url: 'https://invalid-link-test-123.com', email: 'owner@example.com' },
    ];

    const results = [];

    for (const item of monitoredLinks) {
        const isHealthy = await checkLinkStatus(item.url, item.email);
        results.push({ url: item.url, isHealthy });
    }

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        results
    });
}

async function checkLinkStatus(url: string, userEmail: string) {
    try {
        const response = await axios.get(url, { timeout: 8000 });
        console.log(`[Status ${response.status}] ${url} is healthy.`);
        return true;
    } catch (error: any) {
        const statusCode = error.response ? error.response.status : 'Unknown';

        if (statusCode === 404 || statusCode >= 500 || error.code === 'ENOTFOUND') {
            console.error(`🚨 ALERT: ${url} is down (Status: ${statusCode})`);

            if (process.env.RESEND_API_KEY) {
                await sendAlertEmail(userEmail, url, statusCode.toString());
            } else {
                console.warn('Skipping email send: RESEND_API_KEY not configured.');
            }
        }
        return false;
    }
}

async function sendAlertEmail(to: string, targetUrl: string, status: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'LinkGuardian <onboarding@resend.dev>', // Resend testing default
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

        if (error) {
            console.error('Resend Email Error:', error);
        } else {
            console.log('Alert email sent via Resend:', data?.id);
        }
    } catch (err) {
        console.error('Critical Email failure:', err);
    }
}
