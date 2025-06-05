document.addEventListener('DOMContentLoaded', function() {
    // Auth UI Elements
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminPortalLink = document.getElementById('adminPortalLink');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const closeAdminModal = adminLoginModal.querySelector('.close');

    // Dashboard Elements
    const totalClients = document.getElementById('totalClients');
    const totalInvestment = document.getElementById('totalInvestment');
    const totalProfit = document.getElementById('totalProfit');
    const activeAgreements = document.getElementById('activeAgreements');
    const clientsTable = document.getElementById('clientsTable').getElementsByTagName('tbody')[0];
    const portfolioTable = document.getElementById('portfolioTable').getElementsByTagName('tbody')[0];
    const clientSelect = document.getElementById('clientSelect');
    const addInvestmentBtn = document.getElementById('addInvestmentBtn');
    const agreementModal = document.getElementById('agreementModal');
    const closeModal = document.querySelector('.close');
    const agreementForm = document.getElementById('agreementForm');

    // Sample Data
    let clients = [];
    let investments = [];
    let currentUser = null;

    // Admin credentials (in a real app, these would be stored securely on the server)
    const ADMIN_CREDENTIALS = {
        email: "admin@investment.com",
        password: "Admin@1234"
    };

    // Generate random client ID
    function generateClientId() {
        return 'CL' + Math.floor(1000 + Math.random() * 9000);
    }

    // Toggle between sign up and sign in forms
    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
        document.getElementById('clientId').value = generateClientId();
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });

    // Admin portal link click handler
    adminPortalLink.addEventListener('click', function() {
        adminLoginModal.style.display = 'flex';
    });

    // Close admin modal
    closeAdminModal.addEventListener('click', function() {
        adminLoginModal.style.display = 'none';
    });

    // Admin login form submission
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        // Check admin credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            currentUser = {
                name: 'Admin',
                email: email,
                role: 'admin'
            };
            
            // Hide auth container and show dashboard
            container.style.display = 'none';
            dashboard.style.display = 'block';
            adminLoginModal.style.display = 'none';
            
            // Initialize dashboard
            initDashboard();
            
            // Reset form
            adminLoginForm.reset();
        } else {
            alert('Invalid admin credentials. Please try again.');
        }
    });

    // Sign up form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const clientId = document.getElementById('clientId').value;
        
        // Create new client
        const newClient = {
            id: clientId,
            name: name,
            email: email,
            password: password,
            status: 'active',
            date: new Date().toLocaleDateString()
        };
        
        // Add to clients array (in a real app, this would be an API call)
        clients.push(newClient);
        
        // Show success message and switch to sign in
        alert('Account created successfully! Please sign in.');
        container.classList.remove('right-panel-active');
        signupForm.reset();
    });

    // Sign in form submission
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        
        // Check if client exists
        const client = clients.find(c => c.email === email && c.password === password);
        
        if (client) {
            alert('Client login successful! Only admin can access the dashboard.');
        } else {
            alert('Invalid credentials. Please try again.');
        }
        
        signinForm.reset();
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        currentUser = null;
        dashboard.style.display = 'none';
        container.style.display = 'flex';
    });

    // Modal functionality
    addInvestmentBtn.addEventListener('click', function() {
        agreementModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        agreementModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === agreementModal) {
            agreementModal.style.display = 'none';
        }
        if (e.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
        }
    });

    // Agreement form submission
    agreementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientId = clientSelect.value;
        const agreementType = document.getElementById('agreementType').value;
        const investmentAmount = document.getElementById('investmentAmount').value;
        const agreementFile = document.getElementById('agreementFile').files[0];
        
        if (!clientId || !agreementType || !investmentAmount || !agreementFile) {
            alert('Please fill all fields');
            return;
        }
        
        const client = clients.find(c => c.id === clientId);
        
        // Create new investment
        const newInvestment = {
            id: 'INV' + Math.floor(1000 + Math.random() * 9000),
            clientId: clientId,
            clientName: client.name,
            type: agreementType,
            amount: parseFloat(investmentAmount),
            date: new Date().toLocaleDateString(),
            profit: parseFloat(investmentAmount) * 0.1, // 10% profit for demo
            status: 'active'
        };
        
        investments.push(newInvestment);
        
        // Update dashboard
        updateDashboard();
        
        // Close modal and reset form
        agreementModal.style.display = 'none';
        agreementForm.reset();
        
        alert('Investment agreement added successfully!');
    });

    // Initialize dashboard
    function initDashboard() {
        // Add some sample data if empty
        if (clients.length === 0) {
            clients = [
                { id: 'CL1234', name: 'John Doe', email: 'john@example.com', password: '123456', status: 'active', date: '05/15/2023' },
                { id: 'CL5678', name: 'Jane Smith', email: 'jane@example.com', password: '123456', status: 'active', date: '06/20/2023' },
                { id: 'CL9012', name: 'Robert Johnson', email: 'robert@example.com', password: '123456', status: 'inactive', date: '07/10/2023' }
            ];
        }
        
        if (investments.length === 0) {
            investments = [
                { id: 'INV1001', clientId: 'CL1234', clientName: 'John Doe', type: 'Premium', amount: 5000, date: '05/20/2023', profit: 500, status: 'active' },
                { id: 'INV1002', clientId: 'CL5678', clientName: 'Jane Smith', type: 'Standard', amount: 2500, date: '06/25/2023', profit: 250, status: 'active' }
            ];
        }
        
        // Populate client dropdown
        updateClientSelect();
        
        // Update dashboard data
        updateDashboard();
        
        // Initialize charts
        initCharts();
    }

    // Update client dropdown
    function updateClientSelect() {
        clientSelect.innerHTML = '<option value="">Select a client</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.id})`;
            clientSelect.appendChild(option);
        });
    }

    // Update dashboard data
    function updateDashboard() {
        // Update summary cards
        totalClients.textContent = clients.length;
        
        const totalInvest = investments.reduce((sum, inv) => sum + inv.amount, 0);
        totalInvestment.textContent = '$' + totalInvest.toLocaleString();
        
        const totalProf = investments.reduce((sum, inv) => sum + inv.profit, 0);
        totalProfit.textContent = '$' + totalProf.toLocaleString();
        
        const activeAgr = investments.filter(inv => inv.status === 'active').length;
        activeAgreements.textContent = activeAgr;
        
        // Update clients table
        updateClientsTable();
        
        // Update portfolio table
        updatePortfolioTable();
        
        // Update charts
        updateCharts();
    }

    // Update clients table
    function updateClientsTable() {
        clientsTable.innerHTML = '';
        
        clients.slice(0, 5).forEach(client => {
            const row = clientsTable.insertRow();
            
            const clientIdCell = row.insertCell(0);
            clientIdCell.textContent = client.id;
            
            const nameCell = row.insertCell(1);
            nameCell.textContent = client.name;
            
            const emailCell = row.insertCell(2);
            emailCell.textContent = client.email;
            
            // Calculate total investment for client
            const clientInvestments = investments.filter(inv => inv.clientId === client.id);
            const totalInvest = clientInvestments.reduce((sum, inv) => sum + inv.amount, 0);
            
            const investCell = row.insertCell(3);
            investCell.textContent = '$' + totalInvest.toLocaleString();
            
            const statusCell = row.insertCell(4);
            const statusSpan = document.createElement('span');
            statusSpan.className = `status ${client.status}`;
            statusSpan.textContent = client.status;
            statusCell.appendChild(statusSpan);
        });
    }

    // Update portfolio table
    function updatePortfolioTable() {
        portfolioTable.innerHTML = '';
        
        investments.slice(0, 5).forEach(investment => {
            const row = portfolioTable.insertRow();
            
            const clientIdCell = row.insertCell(0);
            clientIdCell.textContent = investment.clientId;
            
            const nameCell = row.insertCell(1);
            nameCell.textContent = investment.clientName;
            
            const typeCell = row.insertCell(2);
            typeCell.textContent = investment.type;
            
            const amountCell = row.insertCell(3);
            amountCell.textContent = '$' + investment.amount.toLocaleString();
            
            const profitCell = row.insertCell(4);
            profitCell.textContent = '$' + investment.profit.toLocaleString();
            
            const actionsCell = row.insertCell(5);
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Edit';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete';
            
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Initialize charts
    function initCharts() {
        // Investment Growth Chart
        const investmentCtx = document.getElementById('investmentChart').getContext('2d');
        window.investmentChart = new Chart(investmentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Investment Amount',
                    data: [12000, 19000, 15000, 20000, 25000, 30000],
                    borderColor: 'rgba(78, 115, 223, 1)',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Client Distribution Chart
        const clientCtx = document.getElementById('clientChart').getContext('2d');
        window.clientChart = new Chart(clientCtx, {
            type: 'doughnut',
            data: {
                labels: ['Standard', 'Premium', 'VIP'],
                datasets: [{
                    data: [30, 45, 25],
                    backgroundColor: [
                        'rgba(78, 115, 223, 0.8)',
                        'rgba(28, 200, 138, 0.8)',
                        'rgba(231, 74, 59, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Update charts
    function updateCharts() {
        // In a real app, you would update chart data here
        // For demo purposes, we'll just keep the sample data
    }
});

