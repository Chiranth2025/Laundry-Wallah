// ==========================================
// LAUNDRY WALLAH - API INTEGRATION VERSION
// ==========================================

const API_BASE_URL = 'http://localhost:3000'; // Your backend URL

// --- Mobile Menu Logic ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
}

// --- Login Logic ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        submitBtn.innerText = "Logging in...";
        submitBtn.disabled = true;

        try {
            // 1. Send Login Request to Backend
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 2. Save the real JWT token and user name
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', data.user.username);
                
                alert("Login successful! Welcome " + data.user.username);
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Login failed");
                submitBtn.innerText = "Log In";
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Cannot connect to server.");
            submitBtn.innerText = "Log In";
            submitBtn.disabled = false;
        }
    });
}

// --- Booking Form Logic ---
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please log in first to schedule a pickup.");
        window.location.href = "login.html";
    }

    bookingForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.innerText = "Booking...";
        submitBtn.disabled = true;

        // Gather form data (matches your cus_model schema!)
        const orderData = {
            service: document.getElementById('service').value,
            date: document.getElementById('pickup-date').value,
            time: document.getElementById('pickup-time').value,
            address: document.getElementById('address').value
        };
        
        try {
            // Send secure POST request with the JWT token
            const response = await fetch(`${API_BASE_URL}/order`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // THE BOUNCER PASS
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Booking Confirmed! Our driver will contact you soon.");
                window.location.href = "dashboard.html";
            } else {
                alert("Error: " + data.message);
                submitBtn.innerText = "Confirm Booking";
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Cannot connect to server.");
            submitBtn.innerText = "Confirm Booking";
            submitBtn.disabled = false;
        }
    });
}

// --- Dashboard Logic ---
const ordersList = document.getElementById('orders-list');
if (ordersList) {
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('currentUser');
    
    if (!token) {
        window.location.href = "login.html";
    } else {
        const dashboardTitle = document.querySelector('.dashboard-container h2');
        if (dashboardTitle) {
            dashboardTitle.innerHTML = `Active Orders for <br><span style="font-size: 18px; color: #7f8c8d;">${loggedInUser}</span>`;
        }
        
        // Fetch real orders from the database
        fetchOrders(token);
    }

    async function fetchOrders(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/order`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                const myOrders = data.order || []; // Gets the array of orders from DB

                if (myOrders.length === 0) {
                    ordersList.innerHTML = "<p>You have no active orders. <a href='book.html'>Schedule a pickup!</a></p>";
                } else {
                    ordersList.innerHTML = ""; // Clear loading state
                    myOrders.forEach(function(order) {
                        const orderCard = document.createElement('div');
                        orderCard.classList.add('order-card');
                        
                        const formattedService = order.service ? order.service.replace('-', ' ').toUpperCase() : 'STANDARD';

                        orderCard.innerHTML = `
                            <div class="order-details">
                                <h4>Order ID: ${order._id.substring(order._id.length - 6)}</h4>
                                <p><strong>Service:</strong> ${formattedService}</p>
                                <p><strong>Pickup:</strong> ${order.date} (${order.time})</p>
                                <p><strong>Address:</strong> ${order.address}</p>
                            </div>
                            <div class="order-status">Processing</div>
                        `;
                        ordersList.appendChild(orderCard);
                    });
                }
            } else {
                ordersList.innerHTML = "<p>Session expired. Please log in again.</p>";
                localStorage.removeItem('token');
            }
        } catch (error) {
            ordersList.innerHTML = "<p>Error loading orders. Is the server running?</p>";
        }
    }
}

// --- Registration Logic ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(event) {
        // 1. Stop the page from reloading (this prevents the '?' from appearing)
        event.preventDefault(); 
        
        // 2. Grab the data from the inputs
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        // 3. Change button text so you know it's working
        submitBtn.innerText = "Creating Account...";
        submitBtn.disabled = true;

        try {
            // 4. Send the data to your Node.js backend
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            // 5. Handle the backend's response
            if (response.ok) {
                alert("Account created successfully! Please log in.");
                window.location.href = "login.html"; // Send them to the login page!
            } else {
                alert("Error: " + (data.message || "Registration failed"));
                submitBtn.innerText = "Sign Up";
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error("Registration Error:", error);
            alert("Cannot connect to server. Is your Node.js backend running?");
            submitBtn.innerText = "Sign Up";
            submitBtn.disabled = false;
        }
    });
}
// ==========================================
// SMART NAVIGATION & LOGOUT LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Find the button in the navbar using its class
    const authBtn = document.querySelector('.nav-btn');
    
    // Check if the user is holding a valid token in their browser
    const token = localStorage.getItem('token');

    if (authBtn) {
        if (token) {
            // USER IS LOGGED IN: Morph the button into "Logout"
            authBtn.innerText = "Logout";
            authBtn.href = "#"; // Stop it from going to the login page
            authBtn.style.backgroundColor = "#e74c3c"; // Make it red to indicate logout
            authBtn.style.color = "white";
            authBtn.style.padding = "8px 15px";
            authBtn.style.borderRadius = "5px";
            
            // Add the logout click event
            authBtn.addEventListener('click', function(e) {
                e.preventDefault(); // Stop default link behavior
                
                // 1. Destroy the session data
                localStorage.removeItem('token');
                localStorage.removeItem('currentUser');
                
                // 2. Alert the user and redirect to home
                alert("You have successfully logged out.");
                window.location.href = "index.html"; 
            });
            
        } else {
            // USER IS NOT LOGGED IN: Keep it as "Login"
            authBtn.innerText = "Login";
            authBtn.href = "login.html";
        }
    }
});