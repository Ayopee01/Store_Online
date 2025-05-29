🛒 Simulated Online Store System

This project is a simulated e-commerce platform developed using React and Tailwind CSS for the frontend, Node.js for the backend API, and MySQL as the database. MySQL Workbench is used to simulate and manage the API-connected database.

🔧 Developed Features:

  - Login System Includes form validation and communicates with the backend API to verify existing user accounts stored in the database.

  - Register System Features input validation and sends user data to the backend API via a POST request to create a new account for future logins.

  - Navbar Display After logging in, the navigation bar dynamically shows the username of the logged-in user along with a Logout button that redirects back to the login page.

  - Home Page (Product Display) Displays all products retrieved from the API. Products are categorized clearly by type. Users can:

    - Select color variants

    - Add products to the cart

    - View available stock directly on each product card

    - See promotions displayed alongside each product

  - Shopping Cart (Cart System) Displays all items added to the cart. Users can:

    - Increase or decrease item quantity

    - Remove individual items

    - Clear the entire cart

    - Confirm a purchase, which:

        - Automatically reduces stock quantity

        - Generates a receipt in PDF format

  - PDF Receipt System After completing a purchase, a PDF invoice is generated showing:

    - User information

    - Order date and time

    - Order ID

    - List of purchased items with quantity and prices

    - Total cost
