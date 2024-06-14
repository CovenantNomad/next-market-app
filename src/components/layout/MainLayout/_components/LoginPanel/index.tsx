import { Button } from '@/components/ui/button';
import { useState } from 'react';
import SignUp from './_components/SignUp';
import SignIn from './_components/SignIn';


type LoginPanelProps = {}

const LoginPanel = ({}: LoginPanelProps) => {
  const [type, setType] = useState<undefined | 'login' | 'signup'>()

  return (
    <div className='min-w-96'>
      <div className='flex flex-col items-center gap-y-2'>
        <span className='text-lg font-bold'>중고장터 시작하기</span>
        <span className='text-sm text-gray-500'>
          간편하게 가입하고 상품을 확인하세요
        </span>
      </div>
      <div className='mt-8'>
        {type === 'login' ? (
          <>
            <span className='block text-sm text-gray-500 mb-2'>로그인</span>
            <SignIn handleSetType={(type) => setType(type)} />
          </>
        ) : type === 'signup' ? (
          <>
            <span className='block text-sm text-gray-500 mb-2'>회원가입</span>
            <SignUp handleSetType={(type) => setType(type)} />
          </>
        ) : (
          <div className='w-full flex flex-col space-y-2 mt-8'>
            <Button onClick={() => setType('login')}>로그인</Button>
            <Button onClick={() => setType('signup')}>회원가입</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPanel;
