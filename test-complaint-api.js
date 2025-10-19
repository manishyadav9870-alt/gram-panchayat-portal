// Simple test to check complaint API
const testComplaintAPI = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        contact: '1234567890',
        address: 'Test Address',
        category: 'water',
        description: 'Test complaint description',
        images: []
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('Response body:', result);
    
    if (!response.ok) {
      console.error('API Error:', result);
    } else {
      console.log('Success:', JSON.parse(result));
    }
  } catch (error) {
    console.error('Network Error:', error.message);
  }
};

testComplaintAPI();
