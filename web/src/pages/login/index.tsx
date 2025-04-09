import { useLogin } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import authorizationUtil from '@/utils/authorization-util';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'umi';
import styles from './index.less';
import RightPanel from './right-panel';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useLogin();

  // 定义默认的账号密码
  const DEFAULT_EMAIL = 'ma.k@neusoft.com'; // 替换为你的邮箱
  const DEFAULT_PASSWORD = '1qaz!QAZ'; // 替换为你的密码

  // 自动登录函数
 const autoLogin = async () => {
   try {
     const rsaPassWord = rsaPsw(DEFAULT_PASSWORD) as string;
     const code = await login({
       email: DEFAULT_EMAIL.trim(),
       password: rsaPassWord,
     });
     if (code === 0) {
       console.log(
         'Auto login successful, Authorization:',
         authorizationUtil.getAuthorization(),
       );
       navigate('/knowledge', { replace: true });
     } else {
       console.error('Login failed with code:', code);
     }
   } catch (error) {
     console.error('Auto login failed:', error);
   }
 };

 useEffect(() => {
   if (authorizationUtil.getAuthorization()) {
     navigate('/knowledge', { replace: true });
     return;
   }

   const searchParams = new URLSearchParams(location.search);
   const token = searchParams.get('token');
   if (token) {
     const isJWT = token.split('.').length === 3;
     const authValue = isJWT ? token : `Bearer ${token}`;
     const tokenId = token.split('.')[0].replace(/^"|"$/g, '');
     authorizationUtil.setItems({
       Authorization: authValue,
       Token: tokenId,
       userInfo: JSON.stringify({
         email: 'ma.k@neusoft.com',
         name: 'Hero',
         avatar: '',
       }),
     });
     console.log('Set Authorization:', authValue, 'Token:', tokenId);
     navigate('/knowledge', { replace: true });
   } else {
     autoLogin();
   }
 }, [location.search, navigate]);

  return (
    <div className={styles.loginPage}>
      <div>Logging in...</div>
      <div className={styles.loginRight}>
        <RightPanel />
      </div>
    </div>
  );
};

export default Login;
