// Connecting frontend to Node.js backend API
const apiUrl = 'http://localhost:3000/api';

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();