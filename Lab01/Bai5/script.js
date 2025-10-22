document.addEventListener('DOMContentLoaded', function() {

    // --- Lấy các phần tử DOM cần thiết ---
    const searchInput = document.getElementById('searchInput');
    const productList = document.querySelector('.product-list');
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Mảng để lưu trữ toàn bộ dữ liệu sản phẩm
    let products = [];

    // Lưu mảng products vào LocalStorage
    function saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    function render(productsToRender) {
        // Xóa tất cả nội dung cũ trong productList
        productList.innerHTML = '';

        // Nếu không có sản phẩm nào, hiển thị thông báo
        if (!productsToRender || productsToRender.length === 0) {
            productList.innerHTML = '<p class="no-products-message">Không tìm thấy sản phẩm nào.</p>';
            return; // Dừng hàm tại đây
        }
        
        // Lặp qua mảng được truyền vào và tạo HTML cho mỗi sản phẩm
        productsToRender.forEach(product => {
            const formattedPrice = Number(product.price).toLocaleString('vi-VN');
            const placeholderImage = 'https://via.placeholder.com/150';

            const productElement = document.createElement('article');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="${product.image || placeholderImage}" alt="Ảnh sản phẩm ${product.name}">
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <p class="price"><strong>Giá:</strong> <span>${formattedPrice} VNĐ</span></p>
            `;
            // Thêm sản phẩm vào giao diện
            productList.appendChild(productElement);
        });
    }

    // Tải dữ liệu khi trang được mở
    function loadProducts() {
        const storedProducts = localStorage.getItem('products');
        
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        } else {
            // Nếu không, tạo dữ liệu mẫu ban đầu
            products = [
                { name: 'Casio G-Shock GA-2100', price: '2900000', desc: 'Mẫu đồng hồ thể thao siêu bền, chống sốc và chống nước tuyệt vời, thiết kế bát giác độc đáo.', image: 'https://casio-hcm.vn/wp-content/uploads/2021/05/ga-2100-1adr_d44d186a74d54167a8507a9ace8143d8_7e90edb61a6b43cfbacfbb7821d599c5_master.png' },
                { name: 'Seiko 5 Sports SRPD', price: '5500000', desc: 'Huyền thoại trở lại với thiết kế mạnh mẽ, bộ máy tự động đáng tin cậy từ thương hiệu Nhật Bản.', image: 'https://donghoduyanh.com/images/products/2020/03/17/large/dong_ho_seiko_5_sport_srpd55k1_2.jpg.webp' },
                { name: 'Orient Bambino Gen 2', price: '4200000', desc: 'Vẻ đẹp cổ điển, thanh lịch với mặt kính cong quyến rũ, lựa chọn hoàn hảo cho quý ông.', image: 'https://image.donghohaitrieu.com/wp-content/uploads/2023/09/7_FAC00008W0.jpg' }
            ];
            saveToLocalStorage();
        }
        
        // Hiển thị toàn bộ sản phẩm ra màn hình bằng hàm render mới
        render(products);
    }


    // Tìm kiếm
    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Lọc trực tiếp từ mảng `products` gốc
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        
        // Dùng hàm render mới để hiển thị danh sách đã lọc
        render(filteredProducts);
    });
    
    // Sự kiện submit form thêm sản phẩm
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('newProductName').value.trim();
        const price = document.getElementById('newProductPrice').value.trim();
        const desc = document.getElementById('newProductDesc').value.trim();
        const image = document.getElementById('newProductImage').value.trim();

        if (name === '' || desc === '' || isNaN(price) || Number(price) <= 0) {
            errorMsg.textContent = 'Vui lòng nhập đầy đủ và chính xác thông tin!';
            return;
        }
        errorMsg.textContent = '';

        const newProduct = { name, price, desc, image };
        products.unshift(newProduct);
        saveToLocalStorage();
        
        // Render lại toàn bộ danh sách sản phẩm trên giao diện
        render(products);

        addProductForm.reset();
        addProductForm.classList.add('hidden');
        showAddFormBtn.textContent = 'Thêm sản phẩm';
    });

    // Sự kiện cho nút Thêm/Đóng và Hủy
    showAddFormBtn.addEventListener('click', () => {
        addProductForm.classList.toggle('hidden');
        if (addProductForm.classList.contains('hidden')) {
            showAddFormBtn.textContent = 'Thêm sản phẩm';
        } else {
            showAddFormBtn.textContent = 'Đóng Form';
        }
    });

    cancelBtn.addEventListener('click', () => {
        addProductForm.classList.add('hidden');
        addProductForm.reset();
        errorMsg.textContent = '';
        showAddFormBtn.textContent = 'Thêm sản phẩm'; // Nút có thể quay về trạng thái cũ
    });

    loadProducts();
});
