import api from "../../../../api";

export async function GET() {
  try {
    // const response = await api.get('/check-expired');

    return new Response(JSON.stringify({
      success: true,
      message: 'Cron job executed successfully',
      // data: response.data,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error executing cron job:', error);

    return new Response(JSON.stringify({
      success: false,
      message: 'Error executing cron job',
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
