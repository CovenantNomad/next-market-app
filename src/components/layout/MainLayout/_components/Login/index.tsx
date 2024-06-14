import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import LoginPanel from '../LoginPanel';
import { useEffect, useState } from 'react';
import Spinner from '@/components/common/Spinner';
import { getMe } from '@/repository/me/getMe';
import supabase from '@/lib/supabase/browserClient';


type LoginProps = {}

const Login = ({}: LoginProps) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState<boolean | undefined>()


  const onLogoutHandler = async () => {
    await supabase.auth.signOut()

    location.reload()
  }

  useEffect(() => {
    (async () => {
      const { data: { shopId }} = await getMe(supabase)
      setIsLoggedIn(!!shopId)
    })()
    
  }, [])

  return (
    <>
      {isLoggedIn === undefined ? (
        <div>
          <Spinner hasText={false} />
        </div>
      ) : isLoggedIn === false ? (
        <Dialog>
          <DialogTrigger>
            <span className='text-sm text-gray-500'>로그인/회원가입</span>
          </DialogTrigger>
          <DialogContent>
            <LoginPanel />
          </DialogContent>
        </Dialog>
      ) : (
        <button onClick={onLogoutHandler}>
          <span className='text-sm text-gray-500'>로그아웃</span>
        </button>
      )}
    </>
  );
};

export default Login;
