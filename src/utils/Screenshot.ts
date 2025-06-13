export async function captureScreenshot(url: string): Promise<Blob> {
  const response = await fetch('http://localhost:3001/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) throw new Error('Failed to capture screenshot');
  return await response.blob();
}
