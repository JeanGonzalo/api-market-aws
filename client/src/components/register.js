import React from 'react'

const Register = (props) => (
    <div className='page-container'>
<form className='content'onSubmit={props.handleRegister}>
    <input type="text" placeholder='Username' name='username' onChange={props.handleChange} />
    <input type="password" placeholder='Password' name='password' onChange={props.handleChange} />
    <button className="btn waves-effect waves-light">Registrar</button>
</form>
</div>
)

export default Register;