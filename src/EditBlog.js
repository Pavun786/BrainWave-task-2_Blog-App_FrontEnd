import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography } from '@mui/material';
import {API} from "./Global.js"

function UpdateBlog() {
  const [fileData, setFileData] = useState(null); // Renamed to avoid confusion
  const { id } = useParams();

  useEffect(() => {
    getFile();
  }, []);

  const getFile = async () => {
    try {
      const response = await fetch(`${API}/blog/${id}`, {
        method: "GET"
      });
      const data = await response.json();
      setFileData(data); // Store the fetched blog data
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="file-container">
      {fileData ? <UpdateBlogForm value={fileData} setValue={setFileData} /> : "Loading..."}
    </div>
  );
}

function UpdateBlogForm({ value, setValue }) {
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    blogDiscription: Yup.string().required('Blog description is required'),
  });

  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      blogDiscription: value?.blogDiscription || '', // Ensure value is defined
    },
    validationSchema: validationSchema,
    enableReinitialize: true, // Reinitialize form if the initialValues change
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('blogDiscription', values.blogDiscription);
      formData.append('postedBy', userId);
      if (file) {
        formData.append('file', file);
      }

      try {
        const response = await fetch(`${API}/blog/${value._id}`, {
          method: "PUT",
          body: formData, // Pass formData directly
        });

        const data = await response.json();
        console.log(data);
        alert("Blog updated successfully");
        navigate("/blogs");

      } catch (error) {
        console.error(error);
        alert('Error updating blog');
      }
    },
  });

  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };

  return (
    <div className='create-blog-container'>
      <Typography variant="h6" gutterBottom>
        Edit Blog
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
          <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body2">File: {file.name}</Typography>}
        </div>

        <Button color="primary" variant="outlined" fullWidth type="submit">
          Update Blog
        </Button>
      </form>
    </div>
  );
}

export default UpdateBlog;
