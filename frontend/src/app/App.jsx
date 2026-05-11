import { useState, useEffect } from 'react'
import './App.css'
import { RouterProvider } from 'react-router'
import AppRoutes from './AppRoutes'
import { useAuth } from '../features/auth/hook/useAuth'
import { useSelector } from 'react-redux'

function App() {


  // const user = useSelector(state => state.auth.user);
  // console.log(user);

  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);




  return (
    <>
      <RouterProvider router={AppRoutes} />
    </>
  )
}

export default App
