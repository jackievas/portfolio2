// Simple JavaScript script to fetch data from employees.json and display employee names

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching JSON: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

function extractEmployeeNames(jsonData) {
    return jsonData.map(employee => employee.name);
}

function displayEmployeeNames(names) {
    names.forEach(name => {
        console.log(name);
    });
}

async function main() {
    try {
        const jsonData = await fetchData('employees.json');
        const employeeNames = extractEmployeeNames(jsonData);

        displayEmployeeNames(employeeNames);

        console.log('Script ran successfully!');
    } catch (error) {
        console.error('An error occurred:', error);

        if (error instanceof SyntaxError) {
            console.error('This is a syntax error. Double-check your JSON file for any formatting issues.');
        } else {
            console.error('Please check your code and data file for any issues.');
        }
    }
}

// Call the main function
main();
