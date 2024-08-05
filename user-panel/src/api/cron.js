// api/cron.js
import { NextResponse } from 'next/server';
import api from '../../api';

export async function GET(request) {
  try {
    const apiUrl = 'check-expired';

    const response = await api.get(apiUrl);

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Error executing cron job:', error);

    return NextResponse.json({
      success: false,
      message: 'Error executing cron job',
      error: error.message,
    });
  }
}
