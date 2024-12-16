require('dotenv').config();
const apiKey = process.env.API_KEY;
const btn = document.querySelector("form button");
/*const fromcurr = document.querySelector(".from select");
const dropdown = document.querySelectorAll(".dropdown select");
const tocurr = document.querySelector(".to select");*/
const searchBox1 = document.getElementById('searchBox1');
const suggestionBox1 = document.getElementById('suggestionBox1');
const searchBox2 = document.getElementById('searchBox2');
const suggestionBox2 = document.getElementById('suggestionBox2');
const fromimg = document.getElementById('from-img');
const toimg = document.getElementById('to-img');
let fromcountry = "*";
let tocountry = "*";

/*for (let select of dropdown) {
    for (currcode in countryList) {
        let newoption = document.createElement("option");
        newoption.innerText = currcode;
        newoption.value = currcode;
        if (select.name === "from" && currcode === "USD") {
            newoption.selected = "selected";
        } else if (select.name === "to" && currcode === "INR") {
            newoption.selected = "selected";
        }
        select.append(newoption);
    }
    select.addEventListener("change", (evt) => {
        updateflag(evt.target);
    });
}*/

// Clear the amount input and set placeholders when the page loads
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".amount input").value = ""; // Clear the amount input box
    searchBox1.value = ""; // Set placeholder for From currency
    searchBox2.value = ""; // Set placeholder for To currency
});

function isNumeric(value) {
    return typeof value === 'string' && Number.isFinite(Number(value.trim()));
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    const msg = document.querySelector(".msg");
    let amount = document.querySelector(".amount input");
    let amtval = amount.value;
    if (!isNumeric(amtval) || amtval < 0 || amtval === "") {
        msg.innerText = "Please Enter a Valid Amount !";
    } else if (fromcountry === "*" || fromcountry === "") {
        msg.innerText = "Please Select a Valid Currency in From!";
    } else if (tocountry === "*" || tocountry === "") {
        msg.innerText = "Please Select a Valid Currency in To!";
    } else {
        console.log(amtval);
        console.log(fromcountry);
        console.log(tocountry);

        /*let endpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromcountry}/${tocountry}`;*/
        let endpoint = `http://localhost:3000/api/exchange-rate?from=${fromcountry}&to=${tocountry}`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (data.result === "success") {
                    const convertedAmount = (amtval * data.conversion_rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
                    msg.innerText = `${amtval} ${fromcountry.toUpperCase()} = ${convertedAmount} ${tocountry.toUpperCase()}`;
                } else {
                    msg.innerText = "Error: Unable to fetch conversion rate. Try again later.";
                    console.error("Error:", data.error);
                }
            })
            .catch(error => {
                msg.innerText = "Network Error: Unable to fetch data.";
                console.error("Network Error:", error);
            });

    }
})


function renderSuggestions1(filteredSuggestions) {
    suggestionBox1.innerHTML = '';

    if (filteredSuggestions.length === 0) {
        fromcountry = "*";
        suggestionBox1.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }

    filteredSuggestions.forEach(item => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = `${item[0]} - ${item[1]}`;
        suggestionBox1.appendChild(suggestionItem);

        // Add click event to select a suggestion
        suggestionItem.addEventListener('click', () => {
            searchBox1.value = item[0];
            suggestionBox1.classList.remove('active');

            let countrycode = countryList[item[0]];
            let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
            fromimg.src = newsrc;
            fromcountry = item[0].toLowerCase();
        });
    });
}


function renderSuggestions2(filteredSuggestions) {
    suggestionBox2.innerHTML = '';

    if (filteredSuggestions.length === 0) {
        tocountry = "*";
        suggestionBox2.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }

    filteredSuggestions.forEach(item => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = `${item[0]} - ${item[1]}`;
        suggestionBox2.appendChild(suggestionItem);

        // Add click event to select a suggestion
        suggestionItem.addEventListener('click', () => {
            searchBox2.value = item[0];
            suggestionBox2.classList.remove('active');

            let countrycode = countryList[item[0]];
            let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
            toimg.src = newsrc;
            tocountry = item[0].toLowerCase();
        });
    });
}

function filterSuggestions(query) {
    const entries = Object.entries(countryList);
    if (!query) {
        return entries; // Show all if query is empty
    }

    return entries.filter(([key, value]) => {
        return key.toLowerCase().includes(query.toLowerCase()) ||
            value.toLowerCase().includes(query.toLowerCase());
    });
}

searchBox1.addEventListener('input', (event) => {
    const query = event.target.value;
    fromcountry = "*";
    const filteredSuggestions = filterSuggestions(query);
    renderSuggestions1(filteredSuggestions);
    suggestionBox1.classList.add('active');
});

searchBox1.addEventListener('focus', () => {
    suggestionBox1.classList.add('active');
    renderSuggestions1(Object.entries(countryList));
});

searchBox2.addEventListener('input', (event) => {
    const query = event.target.value;
    tocountry = "*";
    const filteredSuggestions = filterSuggestions(query);
    renderSuggestions2(filteredSuggestions);
    suggestionBox2.classList.add('active');
});

searchBox2.addEventListener('focus', () => {
    suggestionBox2.classList.add('active');
    renderSuggestions2(Object.entries(countryList));
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
        suggestionBox1.classList.remove('active');
        suggestionBox2.classList.remove('active');
    }
});

// Initially show all suggestions
renderSuggestions1(Object.entries(countryList));
renderSuggestions2(Object.entries(countryList));