import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { useState } from 'react';
import { addPost, deletePost } from './features/Posts';

function App() {
  // 제목의 useState()
  const [title, setTitle] = useState("");
  // 내용의 useState()
  const [content, setContent] = useState("");
  // useSelector()로 store(posts의 initialState.value)에 접근
  const postList = useSelector((state) => state.posts.value);
  // dispatch선언
  const dispatch = useDispatch();

  // 개시물을 추가
  const handleAddPost = () => {
    // 내용이 없으면 무시
    if(title === "" || content === "") return;

    // dispatch로 addPost(id, title, content) -> title, content 초기화
    dispatch(
      addPost({
        id: uuidv4(),
        title: title,
        content: content
      })
    );
    setTitle("");
    setContent("");
  }

  return(
    <div>
      <div>
        <h1>개시판</h1>
      </div>

      <div className='addPost'>
        {/* 제목 */}
        <input
          type='text'
          placeholder='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* 내용 */}
        <input 
          type='text'
          placeholder='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* 저장 버튼 */}
        <button onClick={() => handleAddPost()}>upLoad</button>
        <hr />
      </div>

      {/* 출력 */}
      <div className='displayPosts'>
        {postList.map((post) =>(
          <div className='post' key={post.id}>
            <h1 className='postName'>{post.title}</h1>
            <h1 className='postContent'>{post.content}</h1>
            <button onClick={() => dispatch(deletePost({id: post.id}))}>
              delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
