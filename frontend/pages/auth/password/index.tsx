import { useRouter } from 'next/dist/client/router';
import React, { SyntheticEvent, useState } from 'react';
import Layout from '../../../components/Layout';
import { LockClosedIcon } from '@heroicons/react/solid';
import { ColorSet } from '../../../domain/models/ColorSet';

const Index = () => {
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [notiOpen, setNotiOpen] = useState(false);
  const router = useRouter();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setProcessing(true);
    const response = await fetch(
      'http://localhost:8000/api/auth/password/reset/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
        }),
      }
    );
    const content = await response.json();
    setProcessing(false);
    setNotiOpen(true);
    console.log(content);
    if (response.ok) {
      //await router.push('/auth/login');
      setMessage(
        'Click on the link sent to this email to change your password'
      );
    } else {
      setMessage(content.detail);
    }
  };
  return (
    <Layout auth={false} notification={{open:notiOpen, message:message,setOpen:setNotiOpen}}>
      <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-2xl w-50 min-w-md max-w-md'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Xin nhập email đã đăng ký
            </h2>
          </div>
          <form className='mt-8 space-y-6' onSubmit={submit}>
            <input type='hidden' name='remember' defaultValue='true' />
            <div className='rounded-md shadow-sm -space-y-px'>
              <div>
                <label htmlFor='email-address' className='sr-only'>
                  Địa chỉ email
                </label>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Địa chỉ email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              {!processing ? (
                <button
                  type='submit'
                  className={`${ColorSet.BTN_OK} hover:${ColorSet.BTN_OK_HOVER} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                    <LockClosedIcon
                      className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                      aria-hidden='true'
                    />
                  </span>
                  Gửi
                </button>
              ) : (
                <button
                  type='button'
                  className={`${ColorSet.BTN_OK} hover:${ColorSet.BTN_OK_HOVER} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  disabled
                >
                  Processing
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
