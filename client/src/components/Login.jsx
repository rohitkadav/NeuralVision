import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const {setShowLogin , backendUrl , setToken , setUser}= useContext(AppContext);
  const [state , setState ] = useState('Login')

  const [name , setName] = useState('');
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');

  const submitHandlerFunction = async (e) => {
    e.preventDefault();

    try {
      if(state === 'Login') {
      const {data} =  await axios.post(backendUrl+'api/user/login', {email , password});
      

      if(data.sucess){
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token ', data.token);
        setShowLogin(false);
      }else {
        toast.error(data.message);
      }
      }else {

        const {data} =  await axios.post( backendUrl + 'api/user/register', {name ,email , password});
      if(data.sucess){
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token ', data.token);
        setShowLogin(false);
      }else {
        toast.error(data.message);
      }
      }
    }catch (error) {t
      toast.error(data.message);
    }
  }

  useEffect(()=> {
    document.body.style.overflow='hidden';
    return ()=> {
      document.body.style.overflow='unset';
    }
  },[])

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center '>
        <motion.form onSubmit={submitHandlerFunction}
        initial={{opacity: 0.2 , y: 50}}
       transition={{duration:0.3}}
        whileInView={{opacity:1 , y:0}}
       viewport={{once:true}}
        action="" className='relative bg-[#1c1c22] p-10 rounded-xl text-slate-500 '>
            <h1 className='text-center text-2xl text-[#00ff99] font-medium '>{state}</h1>
            <p className='text-sm text-white '>Welcome back! Please sign in to continue</p>
           
          
           {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.person} alt="" />
                <input onChange={ e => setName(e.target.value)} value={name} type="text" placeholder='Full Name' required className='outline-none text-sm bg-inherit' />
            </div>}

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon} alt="" />
                <input onChange={ e => setEmail(e.target.value)} value={email} type="email" placeholder='Email' required className='outline-none text-sm bg-inherit' />
            </div>

             <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.lock_icon} alt="" />
                <input onChange={ e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className='outline-none text-sm bg-inherit' />
            </div>

            <p className='text-sm text-[#00ff99] my-4 cursor-pointer'>Forget Password?</p>

            <button className='bg-[#00ff99] w-full text-black py-2 rounded-full'>{state === 'Login' ? 'login':'Create account'}</button>
             {state === 'Login' ?
            <p className='mt-5 text-center'>Don't have an account? <span className='text-[#00ff99] cursor-pointer' onClick={()=>setState('Sign Up')}>Sign Up</span></p>
              :
         <p className='mt-5 text-center'> Already have an account <span className='text-[#00ff99] cursor-pointer ' onClick={()=>setState('Login')} >Log in</span></p> }
        
        <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer '/>
        </motion.form>
    </div>
  )
}

export default Login