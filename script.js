document.addEventListener('DOMContentLoaded', async function () {
    try {
        console.log('Fetching JSON data...');
        const responseJson = await fetch('employees.json');
        if (!responseJson.ok) {
            throw new Error(`Error fetching JSON: ${responseJson.status} ${responseJson.statusText}`);
        }
        const jsonData = await responseJson.json();

        // Assuming your JSON has a property called 'name'
        const name = jsonData[0].name;

        console.log('Displaying information...');
        document.body.innerHTML = `<p>Name: ${name}</p>`;
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error.message);
    }
});
