document.addEventListener('DOMContentLoaded', function() {

    // --- Lấy các phần tử DOM cần thiết ---
    const searchInput = document.getElementById('searchInput');
    const productList = document.querySelector('.product-list');
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('errorMsg');

    // --- Chức năng tìm kiếm sản phẩm ---
    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Lấy danh sách sản phẩm MỚI NHẤT mỗi lần tìm kiếm
        // Điều này đảm bảo các sản phẩm mới thêm cũng được tìm thấy
        const allProducts = document.querySelectorAll('.product-item');

        allProducts.forEach(function(item) {
            const productName = item.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // --- Chức năng ẩn/hiện form thêm sản phẩm ---
    showAddFormBtn.addEventListener('click', function() {
        addProductForm.classList.toggle('hidden');
        if (addProductForm.classList.contains('hidden')) {
            showAddFormBtn.textContent = 'Thêm sản phẩm';
        } else {
            showAddFormBtn.textContent = 'Đóng Form';
        }
    });
    
    // --- Chức năng nút Hủy ---
    cancelBtn.addEventListener('click', function() {
        addProductForm.classList.add('hidden'); // Ẩn form
        addProductForm.reset(); // Xóa dữ liệu đã nhập
        errorMsg.textContent = ''; // Xóa thông báo lỗi
        showAddFormBtn.textContent = 'Thêm sản phẩm';
    });

    // --- Chức năng Thêm sản phẩm mới ---
    addProductForm.addEventListener('submit', function(event) {
        // 1. Ngăn chặn hành vi mặc định của form (tải lại trang)
        event.preventDefault();

        // 2. Lấy giá trị từ các trường input và loại bỏ khoảng trắng thừa
        const name = document.getElementById('newProductName').value.trim();
        const price = document.getElementById('newProductPrice').value.trim();
        const desc = document.getElementById('newProductDesc').value.trim();
        const image = document.getElementById('newProductImage').value.trim();
        const placeholderImage = 'https://via.placeholder.com/150';

        // 3. Validate dữ liệu
        if (name === '' || desc === '') {
            errorMsg.textContent = 'Tên sản phẩm và mô tả không được để trống!';
            return; // Dừng hàm nếu có lỗi
        }
        if (isNaN(price) || Number(price) <= 0) {
            errorMsg.textContent = 'Giá phải là một số hợp lệ và lớn hơn 0!';
            return; // Dừng hàm nếu có lỗi
        }

        // Nếu tất cả hợp lệ, xóa thông báo lỗi
        errorMsg.textContent = '';

        // 4. Tạo phần tử sản phẩm mới bằng template string
        const newProductElement = document.createElement('article');
        newProductElement.className = 'product-item'; // Gán class để có style giống các sản phẩm cũ

        // Định dạng giá tiền cho đẹp hơn
        const formattedPrice = Number(price).toLocaleString('vi-VN');

        newProductElement.innerHTML = `
            <img src="${image || placeholderImage}" alt="Ảnh sản phẩm ${name}">
            <h3>${name}</h3>
            <p>${desc}</p>
            <p class="price"><strong>Giá:</strong> <span>${formattedPrice} VNĐ</span></p>
        `;

        // 5. Chèn sản phẩm mới vào đầu danh sách
        productList.prepend(newProductElement);

        // 6. Reset và ẩn form sau khi thêm thành công
        addProductForm.reset();
        addProductForm.classList.add('hidden');
        showAddFormBtn.textContent = 'Thêm sản phẩm';
    });
});
