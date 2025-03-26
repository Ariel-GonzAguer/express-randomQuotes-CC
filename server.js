const express = require("express");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Quote API!",
    endpoints: {
      "Get random quote": "/api/quotes/random",
      "Get all quotes": "/api/quotes",
      "Get quotes by author": "/api/quotes?person=[author]",
      "Add new quote": "/api/quotes (POST)",
      "Update quote": "/api/quotes/:id (PUT)",
      "Delete quote": "/api/quotes/:id (DELETE)"
    }
  });
});

app.get("/api/quotes/random", (req, res) => {
  const randomQuote = getRandomElement(quotes);
  res.json({ quote: randomQuote });
});

app.get("/api/quotes", (req, res) => {
  if (req.query.person) {
    const filteredQuotes = quotes.filter(
      (quote) => quote.person === req.query.person
    );
    res.json({ quotes: filteredQuotes });
  } else {
    res.json({ quotes });
  }
});

app.post("/api/quotes", (req, res) => {
  const { quote, person } = req.query;

  if (!quote || !person) {
    res.status(400).json({ error: "Missing quote or person" });
    return;
  }

  // Generar un nuevo ID (el mayor ID existente + 1)
  const newId = Math.max(...quotes.map(q => q.id), 0) + 1;

  const quoteToAdd = { 
    quote, 
    person,
    id: newId
  };

  if (req.query.year) {
    quoteToAdd.year = parseInt(req.query.year);
  }

  quotes.push(quoteToAdd);
  res.status(201).json({ quote: quoteToAdd });
});

app.put("/api/quotes/:id", (req, res) => {
  const { quote, person } = req.query;
  const { id } = req.params;

  if (!quote || !person)
    return res.status(400).json({ error: "Missing quote or person" });

  const quoteIndex = quotes.findIndex((quote) => quote.id === parseInt(id));
  if (quoteIndex === -1) {
    return res.status(404).json({ error: "That quote does not exist" });
  }

  quotes[quoteIndex] = {
    ...quotes[quoteIndex],
    quote,
    person,
  };

  res.status(200).json({ quote: quotes[quoteIndex] });
});

app.delete("/api/quotes/:id", (req, res) => {
  const { id } = req.params;
  const quoteIndex = quotes.findIndex((quote) => quote.id === parseInt(id));
  if (quoteIndex === -1) {
    return res.status(404).json({ error: "That quote does not exist" });
  } else {
    const deletedQuote = quotes[quoteIndex];
    quotes.splice(quoteIndex, 1);
    res.status(200).json({ message: "Quote deleted successfully", quote: deletedQuote });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
