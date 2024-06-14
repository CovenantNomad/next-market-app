import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase/browserClient';

import { FormEvent } from 'react';

type SignInProps = {
  handleSetType: (type?: 'login' | 'signup') => void
}

const SignIn = ({ handleSetType }: SignInProps) => {

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log(email, password)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert(error.message)
      return
    }

    location.reload()
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <div className='flex flex-col space-y-2'>
        <div>
          <input 
            name='email' 
            type="email" 
            required 
            placeholder='이메일' 
            className='w-full outline-none py-3 px-2 border bordr-gary-300 rounded-md text-sm' 
          />
        </div>
        <div>
          <input 
            name='password' 
            type="password" 
            required 
            placeholder='비밀번호' 
            className='w-full outline-none py-3 px-2 border bordr-gary-300 rounded-md text-sm'
          />
        </div>
      </div>

      <div className='w-full flex flex-col space-y-2 mt-8'>
        <Button type='submit'>로그인</Button>
        <Button type='button' variant="outline" onClick={() => handleSetType('signup')}>회원가입</Button>
      </div>
    </form>
  );
};

export default SignIn;
