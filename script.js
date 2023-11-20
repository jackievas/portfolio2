const jsonString = '{"id": 1, "name": "John Doe", "position": "Software Engineer"}';

try {
    const jsonData = JSON.parse(jsonString);
    console.log('Parsed JSON:', jsonData);
} catch (error) {
    console.error('Error parsing JSON:', error.message);
}
