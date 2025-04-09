document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    updateDashboardStats();

    // Handle form submission for adding new product
    document.getElementById('addItemForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Ambil nilai input
        const productName = document.getElementById('productName').value.trim();
        const category = document.getElementById('category').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        const stock = parseInt(document.getElementById('stock').value);

        // Validasi input
        if (!productName || !category) {
            alert('Product Name and Category cannot be empty!');
            return;
        }
        if (isNaN(price) || price <= 0) {
            alert('Price must be a positive number!');
            return;
        }
        if (isNaN(stock) || stock < 0) {
            alert('Stock must be a non-negative number!');
            return;
        }

        const data = {
            product_name: productName,
            category: category,
            price: price,
            stock: stock
        };

        fetch('php/add_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Product added successfully!');
                this.reset(); // Reset form
                loadInventory();
                updateDashboardStats();
            } else {
                alert('Failed to add product. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the product.');
        });
    });
});

function loadInventory() {
    fetch('php/get_items.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('inventoryBody');
            const stockReportBody = document.getElementById('stockReportBody');
            tbody.innerHTML = '';
            stockReportBody.innerHTML = '';

            // Update nomor urut di form Add New Product
            const productNumber = data.length + 1;
            document.getElementById('productNumber').textContent = productNumber;

            data.forEach((item, index) => {
                // Update Inventory List dengan nomor urut
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.product_name}</td>
                    <td>${item.category}</td>
                    <td>$${parseFloat(item.price).toFixed(2)}</td>
                    <td>${item.stock}</td>
                    <td><button class="view-btn" onclick="deleteItem(${item.id})">Delete</button></td>
                `;
                tbody.appendChild(tr);

                // Update Stock Report
                const stockTr = document.createElement('tr');
                stockTr.innerHTML = `
                    <td>${item.product_name}</td>
                    <td>${item.category}</td>
                    <td>$${parseFloat(item.price).toFixed(2)}</td>
                `;
                stockReportBody.appendChild(stockTr);
            });
        });
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch('php/delete_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Product deleted successfully!');
                loadInventory();
                updateDashboardStats();
            } else {
                alert('Failed to delete product. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the product.');
        });
    }
}

function updateDashboardStats() {
    fetch('php/get_items.php')
        .then(response => response.json())
        .then(data => {
            const totalProducts = data.length;
            const inStock = data.filter(item => item.stock > 0).length;
            const outOfStock = data.filter(item => item.stock === 0).length;
            const totalValue = data.reduce((sum, item) => sum + (item.price * item.stock), 0);

            document.getElementById('totalProducts').textContent = totalProducts;
            document.getElementById('inStock').textContent = inStock;
            document.getElementById('outOfStock').textContent = outOfStock;
            document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
        });
}