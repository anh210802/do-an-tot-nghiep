const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const User = require('../models/userModel');
const Cow = require('../models/cowModel');

const userController = {
    addCow: async (req, res) => {
        try {
            const userId = req.user.id; // Lấy ID người dùng từ middleware
            const {nameCow, breedCow, birthDateCow, weightCow, genderCow, statusCow} = req.body;
            idCow = nanoid(8); 
            const newCow = await Cow.create({
                idCow,
                userId,
                nameCow,
                breedCow,
                birthDateCow,
                weightCow,
                genderCow, 
                statusCow
            });

            return res.status(200).json({ message: 'Thêm động vật thành công', cow: newCow });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },
    getAllCows: async (req, res) => {
        try {
            const userId = req.user.id; // Lấy ID người dùng từ middleware
            const cows = await Cow.find({ userId }).populate('userId', 'name email'); // Lấy danh sách động vật của người dùng
            return res.status(200).json(cows);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

    deleteCow: async (req, res) => {
        try {
            const { cowId } = req.params;
            const deletedCow = await Cow.findOneAndDelete({ idCow: cowId });
    
            if (!deletedCow) {
                return res.status(404).json({ message: 'Không tìm thấy động vật để xóa' });
            }
    
            return res.status(200).json({ message: 'Xóa động vật thành công' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },    

    updateCow: async (req, res) => {
        try {
            const { cowId } = req.params;
            const { nameCow, breedCow, birthDateCow, weightCow, genderCow } = req.body;
            const updatedCow = await Cow.findByIdAndUpdate(cowId, {
                nameCow,
                breedCow,
                birthDateCow,
                weightCow,
                genderCow
            }, { new: true });

            return res.status(200).json({ message: 'Cập nhật động vật thành công', cow: updatedCow });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

};

module.exports = userController;
