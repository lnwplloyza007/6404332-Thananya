// src/components/FoodList.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import '../styles/FoodList.css';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      const querySnapshot = await getDocs(collection(db, 'foods'));
      const foodList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoods(foodList);
    };
    fetchFoods();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'foods'), newFood);
      setFoods([...foods, { ...newFood, id: docRef.id }]);
      setNewFood({ name: '', price: '', category: '', description: '' });
    } catch (error) {
      console.error("Error adding food: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'foods', id));
      setFoods(foods.filter(food => food.id !== id));
    } catch (error) {
      console.error("Error deleting food: ", error);
    }
  };

  const handleEdit = async (food) => {
    if (editing === food.id) {
      try {
        await updateDoc(doc(db, 'foods', food.id), food);
        setFoods(foods.map(f => f.id === food.id ? food : f));
        setEditing(null);
      } catch (error) {
        console.error("Error updating food: ", error);
      }
    } else {
      setEditing(food.id);
    }
  };

  return (
    <div className="food-container">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>ระบบจัดการรายการอาหาร</h1>
            <p>เพิ่ม แก้ไข และจัดการรายการอาหารของคุณ</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            ออกจากระบบ
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="food-form">
        <h2>เพิ่มรายการอาหารใหม่</h2>
        <div className="form-grid">
          <div className="input-group">
            <label>ชื่ออาหาร</label>
            <input
              type="text"
              className="input-field"
              placeholder="กรอกชื่ออาหาร"
              value={newFood.name}
              onChange={(e) => setNewFood({...newFood, name: e.target.value})}
              required
            />
          </div>
          
          <div className="input-group">
            <label>ราคา (บาท)</label>
            <input
              type="number"
              className="input-field"
              placeholder="กรอกราคา"
              value={newFood.price}
              onChange={(e) => setNewFood({...newFood, price: e.target.value})}
              required
            />
          </div>
          
          <div className="input-group">
            <label>หมวดหมู่</label>
            <input
              type="text"
              className="input-field"
              placeholder="กรอกหมวดหมู่"
              value={newFood.category}
              onChange={(e) => setNewFood({...newFood, category: e.target.value})}
              required
            />
          </div>
          
          <div className="input-group">
            <label>รายละเอียด</label>
            <input
              type="text"
              className="input-field"
              placeholder="กรอกรายละเอียด"
              value={newFood.description}
              onChange={(e) => setNewFood({...newFood, description: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          เพิ่มรายการอาหาร
        </button>
      </form>

      <div className="food-grid">
        {foods.map(food => (
          <div key={food.id} className="food-card">
            {editing === food.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  className="edit-input"
                  value={food.name}
                  onChange={(e) => setFoods(foods.map(f => 
                    f.id === food.id ? {...f, name: e.target.value} : f
                  ))}
                />
                <input
                  type="number"
                  className="edit-input"
                  value={food.price}
                  onChange={(e) => setFoods(foods.map(f => 
                    f.id === food.id ? {...f, price: e.target.value} : f
                  ))}
                />
                <input
                  type="text"
                  className="edit-input"
                  value={food.category}
                  onChange={(e) => setFoods(foods.map(f => 
                    f.id === food.id ? {...f, category: e.target.value} : f
                  ))}
                />
                <input
                  type="text"
                  className="edit-input"
                  value={food.description}
                  onChange={(e) => setFoods(foods.map(f => 
                    f.id === food.id ? {...f, description: e.target.value} : f
                  ))}
                />
              </div>
            ) : (
              <div className="food-card-content">
                <h3 className="food-name">{food.name}</h3>
                <p className="food-price">{food.price} บาท</p>
                <p className="food-category">หมวดหมู่: {food.category}</p>
                <p className="food-description">{food.description}</p>
              </div>
            )}
            <div className="card-actions">
              <button
                onClick={() => handleEdit(food)}
                className="edit-btn"
              >
                {editing === food.id ? 'บันทึก' : 'แก้ไข'}
              </button>
              <button
                onClick={() => handleDelete(food.id)}
                className="delete-btn"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;