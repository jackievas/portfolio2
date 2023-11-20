document.addEventListener('DOMContentLoaded', function () {
    // Fetch JSON data (employees.json)
    fetch('employees.json')
        .then(response => response.json())
        .then(jsonData => {
            // Fetch XML data (employees.xml)
            fetch('employees.xml')
                .then(response => response.text())
                .then(xmlData => {
                    // Parse XML data
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');

                    // Fetch JSON data for positions
                    fetch('positions.json')
                        .then(response => response.json())
                        .then(positionsData => {
                            // Combine JSON and XML data
                            const employees = mergeData(jsonData, xmlDoc, positionsData);

                            // Display employees
                            displayEmployees(employees);
                        })
                        .catch(error => console.error('Error fetching positions JSON:', error));
                })
                .catch(error => console.error('Error fetching XML:', error));
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function mergeData(jsonData, xmlDoc, positionsData) {
    // Combine JSON, XML, and positions data based on a common identifier (e.g., employee ID)
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
                    // Add more fields as needed
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
            <!-- Add more fields as needed -->
        `;
        employeeListContainer.appendChild(employeeCard);
    });
}
