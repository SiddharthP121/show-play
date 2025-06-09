import axios from "axios";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const Add_video = () => {

    const [form, setForm] = useState({
        title: "",
        description: "",
        thumbnail: null,
        video: null
    })
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value, files} = e.target;
    setForm((form) => ({
      ...form,
      [name]: files?files[0]:value
    })
    )
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if(value) formData.append(key, value);
    });

    try {
      const res = await axios.post("http://localhost:8000/api/v1/videos", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
             Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )
     setMessage(res.data.message || "Video uploaded successfully")
     alert("video uploaded")
     navigate("/")
     
    } catch (error) {
      setMessage(error.response?.data.message || "unable to upload the video")
     alert("unable to upload video")
    }
    
  }
  

  return (
    <>
      <h1>Add a video</h1>
      <div className="video">
        <form className="videoAdd" onSubmit={handleSubmit}>
          <label htmlFor="title">
            Title:
            <input
              type="text"
              name="title"
              value={form.title}
              placeholder="Enter Title"
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="description">
            Description:
            <input
              type="text"
              placeholder="Enter Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="Thumbnail">
            Thumbnail:
            <input
              type="file"
              accept="image/*"
              placeholder="Enter Description"
              name="thumbnail"
              id="thumbnail"
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="video">
            Video:
            <input
              type="file"
              accept="video/*"
              placeholder="Enter Description"
              name="video"
              id="video"
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Publish Video</button>
          
         
        </form>
      </div>
    </>
  );
};

export default Add_video;
