document.addEventListener('DOMContentLoaded', function() {

    // --- Lấy các phần tử DOM cần thiết ---
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const productList = document.querySelector('.product-list');
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Modal elements
    const productModal = document.getElementById('productModal');
    const modalClose = document.querySelector('.close');

    // Mảng để lưu trữ toàn bộ dữ liệu sản phẩm
    let products = [];
    let nextId = 1; // ID tự tăng cho mỗi sản phẩm

    // Lưu mảng products vào LocalStorage
    function saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('nextId', nextId);
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
        productsToRender.forEach((product) => {
            const formattedPrice = Number(product.price).toLocaleString('vi-VN');
            const placeholderImage = 'https://via.placeholder.com/150';

            const productElement = document.createElement('article');
            productElement.className = 'product-item';
            productElement.setAttribute('data-id', product.id);
            productElement.innerHTML = `
                <img src="${product.image || placeholderImage}" alt="Ảnh sản phẩm ${product.name}">
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <p class="price"><strong>Giá:</strong> <span>${formattedPrice} VNĐ</span></p>
                <div class="product-actions">
                    <button class="btn-delete" data-id="${product.id}">Xóa</button>
                </div>
            `;
            // Thêm sản phẩm vào giao diện
            productList.appendChild(productElement);
        });

        // Gắn sự kiện cho các nút
        attachProductEvents();
    }

    // Tải dữ liệu khi trang được mở
    function loadProducts() {
        const storedProducts = localStorage.getItem('products');
        const storedNextId = localStorage.getItem('nextId');
        
        if (storedProducts) {
            products = JSON.parse(storedProducts);
            
            // Gán ID cho các sản phẩm cũ nếu chưa có
            let needsSave = false;
            products.forEach(product => {
                if (!product.id) {
                    product.id = nextId++;
                    needsSave = true;
                }
            });
            
            // Cập nhật nextId từ localStorage hoặc tính từ sản phẩm hiện có
            if (storedNextId) {
                nextId = parseInt(storedNextId);
            } else {
                const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
                nextId = maxId + 1;
                needsSave = true;
            }
            
            if (needsSave) {
                saveToLocalStorage();
            }
        } else {
            // Nếu không, tạo dữ liệu mẫu ban đầu
            products = [
                { id: nextId++, name: 'Casio G-Shock GA-2100', price: '2900000', desc: 'Mẫu đồng hồ thể thao siêu bền, chống sốc và chống nước tuyệt vời, thiết kế bát giác độc đáo.', image: 'https://casio-hcm.vn/wp-content/uploads/2021/05/ga-2100-1adr_d44d186a74d54167a8507a9ace8143d8_7e90edb61a6b43cfbacfbb7821d599c5_master.png' },
                { id: nextId++, name: 'Seiko 5 Sports SRPD', price: '5500000', desc: 'Huyền thoại trở lại với thiết kế mạnh mẽ, bộ máy tự động đáng tin cậy từ thương hiệu Nhật Bản.', image: 'https://donghoduyanh.com/images/products/2020/03/17/large/dong_ho_seiko_5_sport_srpd55k1_2.jpg.webp' },
                { id: nextId++, name: 'Orient Bambino Gen 2', price: '4200000', desc: 'Vẻ đẹp cổ điển, thanh lịch với mặt kính cong quyến rũ, lựa chọn hoàn hảo cho quý ông.', image: 'https://image.donghohaitrieu.com/wp-content/uploads/2023/09/7_FAC00008W0.jpg' }
            ];
            saveToLocalStorage();
        }
        
        // Hiển thị toàn bộ sản phẩm ra màn hình bằng hàm render mới
        render(products);
    }

    // --- Hàm lọc và sắp xếp sản phẩm ---
    function filterAndSortProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const sortValue = sortSelect.value;
        
        // Lọc sản phẩm
        let filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        
        // Sắp xếp sản phẩm
        if (sortValue === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'name-desc') {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
        }
        
        render(filteredProducts);
    }

    // --- Gắn sự kiện cho các nút trên sản phẩm ---
    function attachProductEvents() {
        // Click vào toàn bộ sản phẩm để xem chi tiết
        document.querySelectorAll('.product-item').forEach(item => {
            item.addEventListener('click', function(event) {
                // Không mở chi tiết nếu click vào nút xóa
                if (event.target.classList.contains('btn-delete') || 
                    event.target.closest('.btn-delete')) {
                    return;
                }
                
                const productId = parseInt(this.getAttribute('data-id'));
                showProductDetail(productId);
            });
            
            // Thêm cursor pointer để người dùng biết có thể click
            item.style.cursor = 'pointer';
        });

        // Nút xóa
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async function(event) {
                event.stopPropagation(); // Ngăn sự kiện lan truyền lên product-item
                const productId = parseInt(this.getAttribute('data-id'));
                await deleteProduct(productId);
            });
        });
    }

    // --- Hiển thị chi tiết sản phẩm trong modal ---
    function showProductDetail(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const formattedPrice = Number(product.price).toLocaleString('vi-VN');
        const placeholderImage = 'https://via.placeholder.com/300';
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="modal-product-detail">
                <img src="${product.image || placeholderImage}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p class="modal-price">${formattedPrice} VNĐ</p>
                <p class="modal-desc">${product.desc}</p>
            </div>
        `;
        
        productModal.style.display = 'block';
    }

    // --- Xóa sản phẩm với xác nhận async ---
    async function deleteProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        // Giả lập xác nhận async
        const confirmed = await showConfirmDialog(`Bạn có chắc muốn xóa "${product.name}"?`);
        
        if (confirmed) {
            products = products.filter(p => p.id !== productId);
            saveToLocalStorage();
            filterAndSortProducts();
        }
    }

    // --- Hàm giả lập dialog xác nhận async ---
    function showConfirmDialog(message) {
        return new Promise((resolve) => {
            const result = confirm(message);
            // Giả lập delay để mô phỏng async operation
            setTimeout(() => {
                resolve(result);
            }, 100);
        });
    }

    // --- Sự kiện cho modal ---
    modalClose.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            productModal.style.display = 'none';
        }
    });


    // Tìm kiếm
    searchInput.addEventListener('keyup', filterAndSortProducts);
    
    // Sắp xếp
    sortSelect.addEventListener('change', filterAndSortProducts);
    
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

        const newProduct = { id: nextId++, name, price, desc, image };
        products.unshift(newProduct);
        saveToLocalStorage();
        
        // Render lại toàn bộ danh sách sản phẩm trên giao diện
        filterAndSortProducts();

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
