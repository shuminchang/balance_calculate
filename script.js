document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('addContributor').addEventListener('click', addInput);
    document.getElementById('removeContributor').addEventListener('click', removeInput);
    document.getElementById('contributionForm').addEventListener('submit', calculate);
    document.getElementById('clearForm').addEventListener('click', clearForm);

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
            var contribution = parseInt(inputs[i].value, 10);
            contributors.push({name: escapeHTML(names[i].value), contribution: contribution});
        }
    
        var num_of_ppl = parseInt(document.getElementById('numOfPeople').value, 10);
        var total = contributions.reduce((a, b) => a + b, 0);
        var money_each = Math.floor(total / num_of_ppl);
        var resultsHTML = '';
    
        contributors = contributors.map(contributor => {
            var balance = contributor.contribution - money_each;
            resultsHTML += `${contributor.name} 拿回：${balance} 元<br>`;
            return { ...contributor, balance: balance }; // Include balance in the contributor object
        });
    
        resultsHTML += `其他人應該付出：${money_each} 元`;
    
        document.getElementById('results').innerHTML = resultsHTML;
    
        // Adjusted to pass contributors with balance included
        var calculationRecord = {
            date: new Date().toISOString(),
            contributors: contributors, // This now includes balance for each contributor
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
        var records = JSON.parse(localStorage.getItem('calculationRecords')) || [];
        var recordsContainer = document.getElementById('recordsContainer');
        if (!recordsContainer) {
            recordsContainer = document.createElement('div');
            recordsContainer.id = 'recordsContainer';
            document.body.appendChild(recordsContainer);
        }
    
        recordsContainer.innerHTML = '';
    
        var heading = document.createElement('h3');
        heading.textContent = '計算紀錄';
        recordsContainer.appendChild(heading);
    
        records.forEach((record, index) => {
            var recordElement = document.createElement('div');
            recordElement.classList.add('record');
            var formattedDate = formatDate(new Date(record.date));
            var dateElement = document.createElement('p');
            dateElement.textContent = `紀錄時間: ${formattedDate}`;
            recordElement.appendChild(dateElement);
    
            var contributorsList = document.createElement('ul');
            record.contributors.forEach(contributor => {
                var li = document.createElement('li');
                li.textContent = `${contributor.name}: 代墊了 ${contributor.contribution} 元, 拿回 ${contributor.balance} 元`;
                contributorsList.appendChild(li);
            });
            recordElement.appendChild(contributorsList);
    
            var moneyEachElement = document.createElement('p');
            moneyEachElement.textContent = `其他人應該付出: ${record.moneyEach} 元`;
            recordElement.appendChild(moneyEachElement);
            recordsContainer.appendChild(recordElement);
    
            if (index < records.length - 1) {
                var separator = document.createElement('hr');
                recordsContainer.appendChild(separator);
            }
        });
    
        if (records.length === 0) {
            var noRecordsMsg = document.createElement('p');
            noRecordsMsg.textContent = '沒有找到計算紀錄。';
            recordsContainer.appendChild(noRecordsMsg);
        }
    }

    function clearForm() {
        // Reset the form
        document.getElementById('contributionForm').reset();

        // Remove any dynamically added input containers
        var contributionsContainer = document.getElementById('contributionsContainer');
        var dynamicInputs = document.querySelectorAll('.contributor-container:not(:first-child)');
    
        dynamicInputs.forEach(inputContainer => {
            contributionsContainer.removeChild(inputContainer);
        });

        // Clear the results and records
        document.getElementById('results').innerHTML = '';
        document.getElementById('recordsContainer').innerHTML = '';
    }

    // View counter logic
    function updateViewCounter() {
        // Retrieve the current view count from localStorage, or initialize it to 0 if it doesn't exist
        let viewCount = parseInt(localStorage.getItem('viewCount')) || 0;

        // Increment the view count
        viewCount++;

        // Update localStorage with the new view count
        localStorage.setItem('viewCount', viewCount.toString());

        // Display the view count on the webpage
        const viewCounterElement = document.getElementById('viewCounter') || createViewCounterElement();
        viewCounterElement.textContent = `瀏覽次數：${viewCount}`;
    }

    function createViewCounterElement() {
        // Create a new element to display the view count
        const viewCounterElement = document.createElement('div');
        viewCounterElement.id = 'viewCounter';
        
        // Optionally, add any styling or classes to the viewCounterElement here

        // Append the view counter element to a container on your webpage
        document.body.appendChild(viewCounterElement); // This could be appended elsewhere depending on your layout

        return viewCounterElement;
    }

    updateViewCounter();

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');
        var seconds = date.getSeconds().toString().padStart(2, '0');
        var ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
        return `${year}/${month}/${day}, ${hours}:${minutes}:${seconds} ${ampm}`;
    }
});