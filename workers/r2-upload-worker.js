export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle different API endpoints
    if (url.pathname === '/api/r2/upload' && request.method === 'POST') {
      return handleUpload(request, env);
    } else if (url.pathname === '/api/r2/get' && request.method === 'GET') {
      return handleGet(request, env);
    } else if (url.pathname === '/api/r2/delete' && request.method === 'DELETE') {
      return handleDelete(request, env);
    } else {
      return new Response('Not Found', { status: 404 });
    }
  }
};

async function handleUpload(request, env) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const key = formData.get('key');
    const contentType = formData.get('contentType');

    if (!file || !key) {
      return new Response('Missing file or key', { status: 400 });
    }

    // Upload to R2 using the Worker's bound R2 bucket
    await env.MAVIRE_ASSETS.put(key, file, {
      httpMetadata: {
        contentType: contentType || 'application/octet-stream',
      },
    });

    return new Response(JSON.stringify({
      success: true,
      key: key,
      message: 'File uploaded successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleGet(request, env) {
  try {
    const key = url.searchParams.get('key');
    
    if (!key) {
      return new Response('Missing key parameter', { status: 400 });
    }

    const object = await env.MAVIRE_ASSETS.get(key);
    
    if (object === null) {
      return new Response('Object Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return new Response(object.body, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Get error:', error);
    return new Response(JSON.stringify({
      error: 'Get failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDelete(request, env) {
  try {
    const key = url.searchParams.get('key');
    
    if (!key) {
      return new Response('Missing key parameter', { status: 400 });
    }

    await env.MAVIRE_ASSETS.delete(key);

    return new Response(JSON.stringify({
      success: true,
      key: key,
      message: 'File deleted successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({
      error: 'Delete failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
