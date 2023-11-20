document.addEventListener('DOMContentLoaded', function () {
    // Fetch JSON data
    fetch('employees.json')
        .then(response => response.json())
        .then(jsonData => {
            // Fetch XML data
            fetch('employees.xml')
                .then(response => response.text())
                .then(xmlData => {
                    // Parse XML data
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');

                    // Combine JSON and XML data
                    const employees = mergeData(jsonData, xmlDoc);

                    // Display employees
                    displayEmployees(employees);
                })
                .catch(error => console.error('Error fetching XML:', error));
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function mergeData(jsonData, xmlDoc) {
    // Combine JSON and XML data based on a common identifier (e.g., employee ID)
    const mergedData = [];

    jsonData.forEach(jsonEmployee => {
        const employeeId = jsonEmployee.id;

        const xmlEmployee = xmlDoc.querySelector(`employee[id="${employeeId}"]`);
        if (xmlEmployee) {
            const mergedEmployee = {
                id: employeeId,
                name: jsonEmployee.name,
                position: jsonEmployee.position,
                department: xmlEmployee.getAttribute('department'),
                // Add more fields as needed
            };

            mergedData.push(mergedEmployee);
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
            <!-- Add more fields as needed -->
        `;
        employeeListContainer.appendChild(employeeCard);
    });
}
