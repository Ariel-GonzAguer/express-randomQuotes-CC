const fetchAllButton = document.getElementById("fetch-quotes");
const fetchRandomButton = document.getElementById("fetch-random");
const fetchByAuthorButton = document.getElementById("fetch-by-author");
const addQuoteButton = document.getElementById("add-quote");
const updateQuoteButton = document.getElementById("update-quote");
const deleteQuoteButton = document.getElementById("delete-quote");

const quoteContainer = document.getElementById("quote-container");
const quoteText = document.querySelector(".quote");
const attributionText = document.querySelector(".attribution");

const resetQuotes = () => {
  quoteContainer.innerHTML = "";
};

const renderError = (response) => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
};

const renderQuotes = (quotes = []) => {
  resetQuotes();
  if (quotes.length > 0) {
    quotes.forEach((quote) => {
      const newQuote = document.createElement("div");
      newQuote.className = "single-quote";
      newQuote.innerHTML = `
        <div class="quote-text">${quote.quote}</div>
        <div class="attribution">- ${quote.person}</div>
        <div>Year: ${quote.year}</div>
        <div class="quote-actions">
          <button onclick="updateQuote(${quote.id})">Update</button>
          <button onclick="deleteQuote(${quote.id})">Delete</button>
        </div>
      `;
      quoteContainer.appendChild(newQuote);
    });
  } else {
    quoteContainer.innerHTML = "<p>Your request returned no quotes.</p>";
  }
};

// Fetch all quotes
fetchAllButton.addEventListener("click", () => {
  fetch("/api/quotes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response.quotes);
    });
});

// Fetch random quote
fetchRandomButton.addEventListener("click", () => {
  fetch("/api/quotes/random")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes([response.quote]);
    });
});

// Fetch quotes by author
fetchByAuthorButton.addEventListener("click", () => {
  const author = document.getElementById("author").value;
  fetch(`/api/quotes?person=${author}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response.quotes);
    });
});

// Add new quote
const addQuote = () => {
  const quote = document.getElementById("new-quote").value;
  const person = document.getElementById("new-person").value;
  const year = document.getElementById("new-year").value;

  if (!quote || !person) {
    alert("Please provide both quote and person");
    return;
  }

  fetch(`/api/quotes?quote=${encodeURIComponent(quote)}&person=${encodeURIComponent(person)}&year=${year}`, {
    method: "POST"
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      alert("Quote added successfully!");
      document.getElementById("new-quote").value = "";
      document.getElementById("new-person").value = "";
      document.getElementById("new-year").value = "";
      fetchAllButton.click();
    });
};

// Update quote
const updateQuote = (id) => {
  const quote = prompt("Enter new quote:");
  const person = prompt("Enter new person:");
  const year = prompt("Enter new year:");

  if (!quote || !person) {
    alert("Please provide both quote and person");
    return;
  }

  fetch(`/api/quotes/${id}?quote=${encodeURIComponent(quote)}&person=${encodeURIComponent(person)}&year=${year}`, {
    method: "PUT"
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      alert("Quote updated successfully!");
      fetchAllButton.click();
    });
};

// Delete quote
const deleteQuote = (id) => {
  if (!confirm("Are you sure you want to delete this quote?")) {
    return;
  }

  fetch(`/api/quotes/${id}`, {
    method: "DELETE"
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      alert("Quote deleted successfully!");
      fetchAllButton.click();
    });
};

addQuoteButton.addEventListener("click", addQuote);
