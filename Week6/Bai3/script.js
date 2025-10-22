// Đảm bảo toàn bộ DOM đã được tải xong trước khi chạy script
document.addEventListener('DOMContentLoaded', function() {

    // --- Bước 6: Xử lý sự kiện tìm kiếm sản phẩm ---

    // 1. Lấy các phần tử cần thiết từ DOM
    const searchInput = document.getElementById('searchInput');
    const productItems = document.querySelectorAll('.product-item');

    // 2. Gắn sự kiện 'keyup' vào ô tìm kiếm để lọc trực tiếp khi người dùng gõ
    searchInput.addEventListener('keyup', function() {
        // Lấy giá trị từ ô tìm kiếm, chuyển thành chữ thường và loại bỏ khoảng trắng thừa
        const searchTerm = searchInput.value.toLowerCase().trim();

        // 3. Duyệt qua tất cả các sản phẩm
        productItems.forEach(function(item) {
            // Lấy tên sản phẩm từ thẻ h3 bên trong
            const productName = item.querySelector('h3').textContent.toLowerCase();
            
            // 4. Kiểm tra xem tên sản phẩm có chứa từ khóa tìm kiếm không
            if (productName.includes(searchTerm)) {
                // Nếu có, hiển thị sản phẩm
                item.style.display = 'block'; 
            } else {
                // Nếu không, ẩn sản phẩm đi
                item.style.display = 'none';
            }
        });
    });


    // --- Bước 11: Xử lý sự kiện nút "Thêm sản phẩm" ---

    // 1. Lấy nút "Thêm sản phẩm" và form thêm sản phẩm
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    const addProductForm = document.getElementById('addProductForm');

    // 2. Gắn sự kiện 'click' cho nút
    showAddFormBtn.addEventListener('click', function() {
        // 3. Sử dụng classList.toggle() để thêm/xóa class 'hidden' một cách linh hoạt
        // Đây là cách đơn giản và hiệu quả nhất để ẩn/hiện một phần tử.
        addProductForm.classList.toggle('hidden');

        // (Tùy chọn) Thay đổi nội dung của nút để người dùng biết chức năng
        if (addProductForm.classList.contains('hidden')) {
            showAddFormBtn.textContent = 'Thêm sản phẩm';
        } else {
            showAddFormBtn.textContent = 'Đóng Form';
        }
    });

    // (Bonus) Xử lý sự kiện submit cho form thêm sản phẩm
    addProductForm.addEventListener('submit', function(event) {
        // Ngăn chặn hành vi mặc định của form là tải lại trang
        event.preventDefault(); 
        
        // Lấy thông tin từ các trường input
        const name = document.getElementById('newProductName').value;
        const desc = document.getElementById('newProductDesc').value;
        const price = document.getElementById('newProductPrice').value;
        const image = document.getElementById('newProductImage').value;

        // Thông báo cho người dùng (trong bài tập thực tế sẽ là thêm sản phẩm vào danh sách)
        alert(`Đã thêm sản phẩm (giả lập):\n- Tên: ${name}\n- Giá: ${price} VNĐ`);

        // Xóa nội dung trong form sau khi submit
        addProductForm.reset();
        // Ẩn form đi
        addProductForm.classList.add('hidden');
        showAddFormBtn.textContent = 'Thêm sản phẩm';
    });

});
