import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.utils import resample
import joblib
import os
def train_model():
    file_path = "trainnew2.csv"
    df = pd.read_csv(file_path).dropna()

    # Tăng số lượng mẫu của lớp "Lying"
    df_lying_upsampled = resample(df[df["Label"] == "Lying"], replace=True, n_samples=1000, random_state=42)
    df_balanced = pd.concat([df[df["Label"] != "Lying"], df_lying_upsampled])

    # Chia tập dữ liệu
    X = df_balanced[["VeDBA", "SCAY"]]
    y = df_balanced["Label"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Huấn luyện mô hình
    rf_model = RandomForestClassifier(n_estimators=50, class_weight="balanced", random_state=42)
    rf_model.fit(X_train, y_train)

    # Lưu mô hình
    joblib.dump(rf_model, "rf_model.pkl")

    return rf_model

def load_model():
    if not os.path.exists("rf_model.pkl"):
        print("Model file not found. Training a new model...")
        return train_model()
    return joblib.load("rf_model.pkl")



def predict_label(vedba: float, scay: float) -> str:
    """Dự đoán nhãn từ hai giá trị đầu vào."""
    model = load_model()  # Nạp mô hình
    input_data = pd.DataFrame([[vedba, scay]], columns=["VeDBA", "SCAY"])
    #input_data = np.array([[vedba, scay]])  # Chuyển đổi đầu vào thành dạng mảng 2D
    predicted_label = model.predict(input_data)[0]  # Dự đoán và lấy giá trị đầu ra đầu tiên
    return str(predicted_label)  # Trả về nhãn dưới dạng chuỗi
