import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography } from '@mui/material';
import "./App.css";
import { useNavigate } from 'react-router-dom';
import {API} from "./Global.js"

const CreateBlog = () => {
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate()

  
  const validationSchema = Yup.object({
    blogDiscription: Yup.string().required('Blog description is required'),
  });

 
  const formik = useFormik({
    initialValues: {
      blogDiscription: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('blogDiscription', values.blogDiscription);
      formData.append('postedBy', userId);
      if (file) {
        formData.append('file', file);
      }

      try {
        const response = await fetch(`${API}/blog/addBlog`, {
          method: "POST",
          body: formData, 
        });

        const data = await response.json();
        console.log(data);

        navigate("/blogs")
        
      } catch (error) {
        console.error(error);
        alert('Error creating blog');
      }
    },
  });

  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };

  return (
    <div className='create-blog-container'>
      <Typography variant="h6" gutterBottom>
        Create Blog
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            fullWidth
            id="blogDiscription"
            name="blogDiscription"
            label="Blog Description"
            variant="outlined"
            value={formik.values.blogDiscription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.blogDiscription && Boolean(formik.errors.blogDiscription)}
            helperText={formik.touched.blogDiscription && formik.errors.blogDiscription}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Button variant="" component="label">
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body2">File: {file.name}</Typography>}
        </div>

        <Button color="primary" variant="outlined" fullWidth type="submit">
          Create Blog
        </Button>
      </form>
    </div>
  );
};

export default CreateBlog;
