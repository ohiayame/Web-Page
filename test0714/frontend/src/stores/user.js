import axios from 'axios';

export async function login(user_id, user_pw) {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      user_id,
      user_pw
    });
    return response.data;
  } catch (err) {
    return { success: false, message: '서버 오류' };
  }
};
