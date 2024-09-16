import React from 'react';
// import Blog from './components/Blog';
import Blog from './Blog';

import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import CreateBlog from './CreateBlog';
import Navbar from './Navbar';
import MyBlogs from './GetOwnBlogs';
import ProtectedRoute from './ProtectedRoute';
import UpdateBlog from './EditBlog';

function App() {
  return (
   
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/blogs' element={
          <ProtectedRoute>
          <Blog/>
          </ProtectedRoute>
          }/>
        
        <Route path='/create-blog' element={
          <ProtectedRoute>
          <CreateBlog/>
          </ProtectedRoute>
          }/>
        <Route path='/my-blogs' element={
          <ProtectedRoute>
          <MyBlogs/>
          </ProtectedRoute>
          }/>

        <Route path='/edit/:id' element={<UpdateBlog/>}/>  
      </Routes>
    </div>
  );
}

export default App;
