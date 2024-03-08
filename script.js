document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('addContributor').addEventListener('click', addInput);
    document.getElementById('removeContributor').addEventListener('click', removeInput);
    document.getElementById('contributionForm').addEventListener('submit', calculate);

    const formInputs = document.querySelectorAll('.form-ipnut, .form-select');

    function highlightEmptyFields() {
        let isComplete = true;
        formInputs.forEach(input => {
            if (!input.value) {
                input.classList.add('highlight');
                isComplete = false;
            } else {
                input.classList.remove('highlight');
            }
        });
        return isComplete;
    }

    function addInput() {
        var contributionsContainer = document.getElementById("contributionsContainer");
    
        var inputContainer = document.createElement("div");
        inputContainer.classList.add('contributor-container');
    
        var nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = "contributorName";
        nameInput.placeholder = "代墊者";
        nameInput.classList.add('form-input');
    
        var contributionInput = document.createElement("input");
        contributionInput.type = "number";
        contributionInput.name = "contribution";
        contributionInput.placeholder = "代墊金額";
        contributionInput.classList.add('form-input');
    
        inputContainer.appendChild(nameInput);
        inputContainer.appendChild(contributionInput);
    
        // Insert the new input container just after the existing contributionsContainer
        contributionsContainer.parentNode.insertBefore(inputContainer, contributionsContainer.nextSibling);
    }

    function removeInput() {
        var contributionsContainer = document.getElementById("contributionForm");
        
        // Select the last child with class 'contributor-container' and remove it
        var allDivs = contributionsContainer.querySelectorAll('div');
        console.log(allDivs.length);
        if (allDivs.length > 1) {
            allDivs[allDivs.length - 1].remove();
        }
    }
    
    function calculate(event) {
        event.preventDefault(); // Prevent form from submitting

        var names = document.getElementsByName("contributorName");
        var inputs = document.getElementsByName("contribution");
        var contributors = [];
        var contributions = [];
        for (var i = 0; i < inputs.length; i++) {
            contributions.push(parseInt(inputs[i].value, 10));
            contributors.push({name: escapeHTML(names[i].value), contribution: parseInt(inputs[i].value, 10)});
        }

        var num_of_ppl = parseInt(document.getElementById('numOfPeople').value, 10);
        var total = contributions.reduce((a, b) => a + b, 0);
        var money_each = Math.floor(total / num_of_ppl);
        var resultsHTML = '';

        contributors.forEach(contributor => {
            var balance = contributor.contribution - money_each;
            resultsHTML += contributor.name + ' 拿回： ' + balance + ' 元<br>';
        })

        resultsHTML += '其他人應該付出： ' + money_each + ' 元';

        document.getElementById('results').innerHTML = resultsHTML;

        // Storing the record
        var calculationRecord = {
            date: new Date().toISOString(), // Record the calculation time
            contributors: contributors,
            moneyEach: money_each
        };

        storeRecord(calculationRecord);
        
        renderRecords();
    }
    
    function storeRecord(record) {
        // Retrieve existing records from localStorage, or initialize an empty array if none exist
        var records = JSON.parse(localStorage.getItem('calculationRecords')) || [];
        records.push(record); // Append the new record
        localStorage.setItem('calculationRecords', JSON.stringify(records)); // Store back to localStorage
    }

    function renderRecords() {
        // Retrieve the records from localStorage
        var records = JSON.parse(localStorage.getItem('calculationRecords')) || [];

        // Find or create a container in your HTML for the records
        var recordsContainer = document.getElementById('recordsContainer');
        if (!recordsContainer) {
            recordsContainer = document.createElement('div');
            recordsContainer.id = 'recordsContainer';
            document.body.appendChild(recordsContainer); // Append it to body or another container as needed
        }

        // Clear existing records to avoid duplication
        recordsContainer.innerHTML = '';

        // Heading for the records section
        var heading = document.createElement('h3');
        heading.textContent = '計算紀錄';
        recordsContainer.appendChild(heading);

        // Loop through the records and create elements for each record
        records.forEach((record, index) => {
            var recordElement = document.createElement('div');
            recordElement.classList.add('record');

            var dateElement = document.createElement('p');
            dateElement.textContent = `紀錄時間: ${record.date}`;
            recordElement.appendChild(dateElement);

            var contributorsList = document.createElement('ul');
            record.contributors.forEach(contributor => {
                var li = document.createElement('li');
                li.textContent = `${contributor.name}: ${contributor.contribution} 元`;
                contributorsList.appendChild(li);
            });
            recordElement.appendChild(contributorsList);

            var moneyEachElement = document.createElement('p');
            moneyEachElement.textContent = `其他人應該付出: ${record.moneyEach} 元`;
            recordElement.appendChild(moneyEachElement);

            // Append the record element to the records container
            recordsContainer.appendChild(recordElement);

            // Optionally, add a separator or styling to distinguish between records
            if (index < records.length - 1) {
                var separator = document.createElement('hr');
                recordsContainer.appendChild(separator);
            }
        });

        // If no records are found, display a message
        if (records.length === 0) {
            var noRecordsMsg = document.createElement('p');
            noRecordsMsg.textContent = '沒有找到計算紀錄。';
            recordsContainer.appendChild(noRecordsMsg);
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }
});