import React,{useEffect,useContext,useState} from 'react'
import { Link, useNavigate } from "react-router-dom";
import noteContext from '../context/noteContext'

export const Adminsignin = () => {
    const [alertstate, setalertstate] = useState("secondary");
    const { state, dispatch } = useContext(noteContext);
    const navigate = useNavigate();
    useEffect(() => {
   
    if(localStorage.getItem('admintoken')){
        
        navigate("/adminhome")}
    else{
        dispatch({ type: 'UPDATE_VALUE', payload: false });
        dispatch({ type: 'UPDATE_AVALUE', payload: false });
        console.log('admintoken not found')
    }
  },[]);

  const handle=async (e)=>{
    localStorage.clear()
    let iemail=document.getElementById('email').value
    let ipassword=document.getElementById('password').value
    e.preventDefault();
    const response=await fetch(`http://${state.backend}:${state.port}/api/admin_auth/adminlogin`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({email:iemail,password:ipassword})


    });
    const json=await response.json();
    console.log(json)
    if(json.response){
        localStorage.setItem('admintoken',json.jwtData)
       
        let alertt = document.getElementById('loginalert')
        setalertstate('success')
        alertt.innerHTML=json.message
        alertt.style.display='block'
        
        navigate("/adminhome")
        
    }else{
        console.log("false")
        let alertt = document.getElementById('loginalert')
        alertt.innerHTML=json.message
        alertt.style.display='block'
        setalertstate('danger')

    }
}
  return (
    <>
    <div className="container signinbox signinbg" >
   <section className="bg-gray-50 dark:bg-gray-900 siginsection" style={{backgroundColor:'transparent'}}>
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 sectonexdiv">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Admin    
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <div className={`alert alert-${alertstate}`} id='loginalert' style={{ outline:'none',border:'none',borderRadius:'10px',display:'none'}} role="alert">
                
                      </div>
              <form className="space-y-4 md:space-y-6" onSubmit={handle}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white dlabel">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@mail.com" required />
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white dlabel">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                  </div>
                 
                  <button type="submit" id='sigin_submit' className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p> */}
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                     Login to Student <Link to="/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Click here</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
   </div>
    
    </>
  )
}
