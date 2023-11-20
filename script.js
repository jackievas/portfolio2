document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch JSON data (employees.json)
        const responseJson = await fetch('employees.json');
        if (!responseJson.ok) {
            throw new Error(`Error fetching JSON: ${responseJson.status} ${responseJson.statusText}`);
        }
        const jsonData = await responseJson.json();

        // Fetch XML data (employees.xml)
        const responseXml = await fetch('employees.xml');
        if (!responseXml.ok) {
            throw new Error(`Error fetching XML: ${responseXml.status} ${responseXml.statusText}`);
        }
        const xmlText = await responseXml.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        // Fetch JSON data for positions
        const responsePositions = await fetch('positions.json');
        if (!responsePositions.ok) {
            throw new Error(`Error fetching positions JSON: ${responsePositions.status} ${responsePositions.statusText}`);
        }
        const positionsData = await responsePositions.json();

        // Combine JSON, XML, and positions data
        const employees = mergeData(jsonData, xmlDoc, positionsData);

        // Display employees
        displayEmployees(employees);
   } catch (error) {
    console.error('An error occurred:', error);

    if (error instanceof SyntaxError) {
        console.error('This is a syntax error. Double-check your JSON or XML files for any formatting issues.');
    } else {
        console.error('Please check your code and data files for any issues.');
    }
};

function mergeData(jsonData, xmlDoc, positionsData) {
    const mergedData = [];

    jsonData.forEach(jsonEmployee => {
        const employeeId = jsonEmployee.id;
        const xmlEmployee = xmlDoc.querySelector(`employee[id="${employeeId}"]`);

        if (xmlEmployee) {
            const position = jsonEmployee.position;
            const positionInfo = positionsData[position];

            if (positionInfo) {
                const mergedEmployee = {
                    id: employeeId,
                    name: jsonEmployee.name,
                    position: position,
                    department: xmlEmployee.getAttribute('department'),
                    positionDescription: positionInfo.description,
                    positionSkills: positionInfo.skills
                };

                mergedData.push(mergedEmployee);
            }
        }
    });

    return mergedData;
}

function displayEmployees(employees) {
    const employeeListContainer = document.getElementById('employeeList');

    employees.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.classList.add('employee-card');
        employeeCard.innerHTML = `
            <h3>${employee.name}</h3>
            <p><strong>Position:</strong> ${employee.position}</p>
            <p><strong>Department:</strong> ${employee.department}</p>
            <p><strong>Position Description:</strong> ${employee.positionDescription}</p>
            <p><strong>Position Skills:</strong> ${employee.positionSkills.join(', ')}</p>
        `;
        employeeListContainer.appendChild(employeeCard);
    });
}
