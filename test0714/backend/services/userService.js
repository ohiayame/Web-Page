import bcrypt from 'bcrypt';
import db from '../config/db.js';

export async function authenticateUser(name, user_pw) {

    const user = await db('users').where({ name }).first();
    if (!user) {
        return { success: false, message: '존재하지 않는 사용자입니다.' }
    }

    const isMatch = await bcrypt.compare(user_pw, user.psw);
    if (!isMatch) {
        return { success: false, message: '비밀번호가 일치하지 않습니다.' }
    }

    return { success: true, user };
}
