import { createSlice } from "@reduxjs/toolkit"

export const postSlice = createSlice({
    // 슬라이스 이름(name), 초기 상태(initialState), 기능(reducers)
    name: "posts",
    initialState: { value: [] },
    reducers: {
        // 추가
        addPost: (state, action) => {
            // value에 전달 받은 값을 넣기
            state.value.push(action.payload);
        },
        // 삭제
        deletePost: (state, action) => {
            // value 내에서 전달 받은 id와 동일한 id를 가지는 항목을 찾아 제거한 내용을 대입
            state.value = state.value.filter((post) => post.id !== action.payload.id);
        }
    }
});

export const { addPost, deletePost } = postSlice.actions;
export default postSlice.reducer;