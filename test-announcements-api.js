// Test announcements API
const testAnnouncementsAPI = async () => {
  try {
    console.log('Testing GET /api/announcements...');
    const response = await fetch('http://localhost:5000/api/announcements');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Announcements found:', data.length);
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      const error = await response.text();
      console.error('Error response:', error);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
};

testAnnouncementsAPI();
