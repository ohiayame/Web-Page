import { useState } from 'react';
import './App.css';

function App() {
  const initialValues = { username: "", mailAddless: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setSubmit] = useState(false);

  const handleChange = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // 리로드 방지
    // 로그인 정보 전송
    setFormErrors(validate(formValues));
    setSubmit(true);
  };

  const validate = (vlaues) => {
    const errors = {};
    const regex = 
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

    if(!vlaues.username){
      errors.username = "이름을 입력하세요"
    }

    if(!vlaues.mailAddless){
      errors.mailAddless = "이메일을 입력하세요"
    }else if(!regex.test(vlaues.mailAddless)){
      errors.mailAddless = "옳바른 이메일을 입력하세요"
    }

    if(!vlaues.password){
      errors.password = "파스워드을 입력하세요"
    }else if(vlaues.password.length < 4){
      errors.password = "4~15자의 파스워드을 입력하세요"
    }else if(vlaues.password.length > 15){
      errors.password = "4~15자의 파스워드을 입력하세요"
    }
    return errors;
  };

  return (
    <div className="formContainer">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h1>Login Form</h1>
        <hr />
        <div className="uiForm">

          {/* 이름 */}
          <div className="formField">
            <label>Name</label>
            <input 
              type='text' 
              placeholder='user name' 
              name='username' 
              onChange={(e) => handleChange(e)} 
            />
          </div>
          <p className='errorMsg'>{formErrors.username}</p>

          {/* 이메일 */}
          <div className="formField">
            <label>Email</label>
            <input 
              type='text' 
              placeholder='Email' 
              name='mailAddless' 
              onChange={(e) => handleChange(e)} 
            />
          </div>
          <p className='errorMsg'>{formErrors.mailAddless}</p>

          {/* 파스워드 */}
          <div className="formField">
            <label>password</label>
            <input 
              type='text' 
              placeholder='password' 
              name='password' 
              onChange={(e) => handleChange(e)}  
            />
          </div>
          <p className='errorMsg'>{formErrors.password}</p>

          <button className="sumitButton">로그인</button>
          {Object.keys(formErrors).length === 0 && isSubmit && (
            <div className='msgOk'>로그인 성공 </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
