import PrivateTasks.models as models  # Import module chứa mô hình

# Nhập dữ liệu đầu vào từ người dùng
vedba = float(input("Nhập giá trị VeDBA: "))
scay = float(input("Nhập giá trị SCAY: "))

# Dự đoán nhãn
predicted_label = models.predict_label(vedba, scay)

# Hiển thị kết quả
print(f"Dự đoán nhãn: {predicted_label}")
