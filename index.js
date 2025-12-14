const express = require('express');
const app = express();

const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FA08 Test Application</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        input, button { padding: 10px; margin: 5px; }
        button { background-color: #4CAF50; color: white; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to FA08 Test App</h1>
        <p>This is a test application for BDD testing.</p>
        
        <h2>Login Form</h2>
        <form>
          <input type="email" placeholder="Email" id="email">
          <input type="password" placeholder="Password" id="password">
          <button type="button" onclick="login()">Login</button>
        </form>
        <div id="message"></div>

        <h2>Search</h2>
        <input type="text" placeholder="Search..." id="searchBox">
        <button onclick="search()">Search</button>
        <div id="results"></div>
      </div>

      <script>
        function login() {
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const message = document.getElementById('message');
          
          if (email && password) {
            message.innerHTML = '<p style="color: green;">Login successful!</p>';
          } else {
            message.innerHTML = '<p style="color: red;">Please enter email and password</p>';
          }
        }

        function search() {
          const query = document.getElementById('searchBox').value;
          const results = document.getElementById('results');
          
          if (query) {
            results.innerHTML = '<p>Search results for: ' + query + '</p>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
