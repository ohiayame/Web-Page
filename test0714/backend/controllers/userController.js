import { authenticateUser } from '../services/userService.js';

export async function login(req, res) {
    const { user_id, user_pw } = req.body;
    console.log(user_id, user_pw);
    const result = await authenticateUser(user_id, user_pw);
    console.log(result);
    if (!result.success) {
        return res.status(401).json(result);
    }

    res.json({ success: true, message: '로그인 성공', user: result.user });
};
