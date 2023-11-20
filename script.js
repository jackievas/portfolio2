document.addEventListener('DOMContentLoaded', async function () {
    try {
        console.log('Fetching JSON data...');
        const responseJson = await fetch('employees.json');
        if (!responseJson.ok) {
            throw new Error(`Error fetching JSON: ${responseJson.status} ${responseJson.statusText}`);
        }
        const jsonData = await responseJson.json();

        // Fetch JSON data for positions
        const responsePositions = await fetch('positions.json');
        if (!responsePositions.ok) {
            throw new Error(`Error fetching positions JSON: ${responsePositions.status} ${responsePositions.statusText}`);
        }
        const positionsData = await responsePositions.json();

        console.log('Displaying information...');
        displayEmployeeData(jsonData, positionsData);
    } catch (error) {
        console.error('An error occurred:', error);

        if (error instanceof SyntaxError) {
            console.error('This is a syntax error. Double-check your JSON files for any formatting issues.');
        } else {
            console.error('Please check your code and data files for any issues.');
        }
    }
});

function displayEmployeeData(jsonData, positionsData) {
    const employeeListContainer = document.getElementById('employeeList');

    jsonData.forEach(employee => {
        const position = employee.position;
        const positionInfo = positionsData[position];

        if (positionInfo) {
            const listItem = document.createElement('div');
            listItem.classList.add('employee-card');
            listItem.innerHTML = `
                <h3>${employee.name}</h3>
                <p><strong>Position:</strong> ${position}</p>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Position Description:</strong> ${positionInfo.description}</p>
                <p><strong>Position Skills:</strong> ${positionInfo.skills.join(', ')}</p>
            `;
            employeeListContainer.appendChild(listItem);
        }
    });
}
