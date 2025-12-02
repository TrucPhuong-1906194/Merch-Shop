document.addEventListener("DOMContentLoaded", () => {

    // ------------------ SEARCH + FILTER ------------------
    const searchInput = document.getElementById("searchOrder");
    const filterSelect = document.getElementById("filterStatus");

    function updateTransactionList() {
        return document.querySelectorAll(".transaction");
    }

    // Tìm kiếm theo mã đơn
    searchInput.addEventListener("input", function () {
        const keyword = this.value.toUpperCase();
        const transactionItems = updateTransactionList();

        transactionItems.forEach(item => {
            const text = item.textContent.toUpperCase();
            item.style.display = text.includes(keyword) ? "block" : "none";
        });
    });

    // Lọc theo trạng thái
    filterSelect.addEventListener("change", function () {
        const selected = this.value;
        const transactionItems = updateTransactionList();

        transactionItems.forEach(item => {
            item.style.display =
                (selected === "all" || item.getAttribute("data-status") === selected)
                ? "block"
                : "none";
        });
    });

    // ------------------ CART + CHECKOUT ------------------
    const cart = document.getElementById("cart");
    const checkoutBtn = cart.querySelector("button");
    const cartTotal = document.getElementById("cart-total");
    const notification = document.getElementById("payment-notification");
    const confirmBtn = document.getElementById("confirm-notification");
    const transactionsSection = document.getElementById("transactions");
    let totalAmount = 0;

    function generateOrderID() {
        return "#" + Math.floor(Math.random() * 90000 + 10000);
    }

    // Add sản phẩm vào giỏ
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const product = button.closest(".product");
            const name = product.querySelector("h3").textContent;
            const priceText = product.querySelector("p").textContent;
            const price = parseFloat(priceText.match(/[\d.]+/)[0]);
            const img = product.querySelector("img").src;

            const newItem = document.createElement("div");
            newItem.classList.add("cart-item");
            newItem.innerHTML = `<img src="${img}" width="50"><p>${name}<br>${priceText}</p>`;
            cart.insertBefore(newItem, checkoutBtn);

            totalAmount += price;
            cartTotal.innerHTML = `<strong>Tổng: $${totalAmount.toFixed(2)}</strong>`;
        });
    });

    // Nút thanh toán
    checkoutBtn.addEventListener("click", () => {
        const cartItems = cart.querySelectorAll(".cart-item");
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }
        notification.style.display = "block";
    });

    // Nút OK popup
    confirmBtn.addEventListener("click", () => {
        const cartItems = cart.querySelectorAll(".cart-item");
        if (cartItems.length === 0) {
            notification.style.display = "none";
            return;
        }

        const orderID = generateOrderID();

        // Ghi vào lịch sử giao dịch
        cartItems.forEach(item => {
            const productText = item.querySelector("p").textContent;
            const newTransaction = document.createElement("div");

            newTransaction.classList.add("transaction");
            newTransaction.setAttribute("data-status", "processing");
            newTransaction.innerHTML = `
                <p><strong>${orderID}</strong> – ${productText}</p>
                <p class="status processing">Đang xử lý</p>
            `;

            transactionsSection.appendChild(newTransaction);
        });

        // Reset giỏ
        cartItems.forEach(item => item.remove());
        totalAmount = 0;
        cartTotal.innerHTML = `<strong>Tổng: $0.00</strong>`;

        notification.style.display = "none";

        // Hiện form khách hàng
        const customerInfo = document.getElementById("customer-info");
        customerInfo.classList.add("show");
        customerInfo.scrollIntoView({ behavior: "smooth" });

        alert(`Đơn hàng ${orderID} đã được gửi đi xử lý!`);
    });

});
