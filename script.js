document.addEventListener('DOMContentLoaded', loadDataAndDisplay);

async function loadDataAndDisplay() {
    try {
        const jsonData = await fetchData('employees.json');
        const xmlText = await fetchData('employees.xml', 'text');
        const xmlDoc = parseXml(xmlText);
        const positionsData = await fetchData('positions.json');

        const employees = mergeData(jsonData, xmlDoc, positionsData);

        displayEmployees(employees);

        console.log('Script ran successfully!');
    } catch (error) {
        handleFetchError(error);
    }
}

async function fetchData(url, type = 'json') {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching ${type.toUpperCase()}: ${response.status} ${response.statusText}`);
    }
    return type === 'json' ? await response.json() : await response.text();
}

function parseXml(xmlText) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, 'application/xml');
}

function mergeData(jsonData, xmlDoc, positionsData) {
    return jsonData.map(jsonEmployee => {
        const employeeId = jsonEmployee.id;
        const xmlEmployee = xmlDoc.querySelector(`employee[id="${employeeId}"]`);

        if (xmlEmployee) {
            const position = jsonEmployee.position;
            const positionInfo = positionsData[position];

            if (positionInfo) {
                return {
                    id: employeeId,
                    name: jsonEmployee.name,
                    position: position,
                    department: xmlEmployee.getAttribute('department'),
                    positionDescription: positionInfo.description,
                    positionSkills: positionInfo.skills
                };
            }
        }
        return null;
    }).filter(Boolean); // Remove null values
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

function handleFetchError(error) {
    console.error('An error occurred:', error);

    if (error instanceof SyntaxError) {
        console.error('This is a syntax error. Double-check your JSON or XML files for any formatting issues.');
    } else {
        console.error('Please check your code and data files for any issues.');
    }
}


