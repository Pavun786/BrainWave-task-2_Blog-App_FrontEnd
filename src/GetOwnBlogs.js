import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaCommentDots } from "react-icons/fa"; 
import './App.css'; 
import { useNavigate } from "react-router-dom";
import {API} from "./Global.js"

function MyBlogs() {
  const [blogData, setBlogData] = useState([]);
  const [newCommand, setNewCommand] = useState(""); 
  const [replyCommand, setReplyCommand] = useState({}); 
  const [showCommands, setShowCommands] = useState({});
  const [showReplies, setShowReplies] = useState({}); 

  let userId = localStorage.getItem("userId")
 
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await fetch(`${API}/blog/allBlogs`, {
        method: "GET",
      });
      const res = await data.json();
  
     
      if (Array.isArray(res)) {
        setBlogData([...res]);
      } else {
        setBlogData([]); 
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogData([]); 
    }
  };
  

  const toggleCommands = (blogId) => {
    setShowCommands((prevState) => ({
      ...prevState,
      [blogId]: !prevState[blogId],
    }));
  };

  const toggleReplies = (commandId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [commandId]: !prevState[commandId], 
    }));
  };

  const likeFunction = async (id) => {
    await fetch(`${API}/like/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId, 
      }),
    });
    fetchBlogs();
  };

  const disLikeFunction = async (id) => {
    await fetch(`${API}/dislike/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId, 
      }),
    });
    fetchBlogs();
  };

  // Handle posting a new comment
  const handlePostCommand = async (blogId) => {

    await fetch(`${API}/blog/${blogId}/command`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        command: newCommand,
        commandBy: userId, 
      }),
    });
    setNewCommand(""); 
    fetchBlogs();
  };

  // Handle posting a reply to a command
  const handlePostReply = async (blogId, parentCommandId) => {
    await fetch(`${API}/blog/${blogId}/command`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        command: replyCommand[parentCommandId],
        commandBy: userId, 
        parentCommandId: parentCommandId, 
      }),
    });
    setReplyCommand((prevState) => ({ ...prevState, [parentCommandId]: "" })); 
    fetchBlogs();
  };

  // Recursive component to render replies and nested replies
  const RenderReplies = ({ replies, blogId }) => {
    return (
      <div className="replies-section">
        {replies.map((reply) => (
          <div key={reply._id} className="reply-box">
            <div className="comment-header">
              <img
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReNr2tV6uuvmORZKBUeu2Oxf9iH-wdYouxVw&"}
                alt="profile"
                className="profile-image"
              />
              <div className="comment-details">
                <p className="username">{reply.commandBy.userName}</p>
                <p className="timestamp">1 hour ago</p>
              </div>
            </div>
            <p className="comment-text">{reply.command}</p>

            <div className="comment-actions">
              <button className="action-btn">
                <FaThumbsUp /> 0
              </button>
              <button className="action-btn">
                <FaThumbsDown /> 0
              </button>
              <button
                className="reply-btn"
                onClick={() => toggleReplies(reply._id)}
              >
                {showReplies[reply._id] ? "Hide Replies" : "Show Replies"}
              </button>
            </div>

            {/* Nested replies */}
            {showReplies[reply._id] && (
              <>
                <div className="reply-input">
                  <input
                    type="text"
                    value={replyCommand[reply._id] || ""}
                    onChange={(e) =>
                      setReplyCommand({ ...replyCommand, [reply._id]: e.target.value })
                    }
                    placeholder="Write a reply..."
                  />
                  <button
                    className="post-reply-btn"
                    onClick={() => handlePostReply(blogId, reply._id)}
                  >
                    Post Reply
                  </button>
                </div>

                {/* Recursively render replies */}
                {reply.replies && reply.replies.length > 0 && (
                  <RenderReplies replies={reply.replies} blogId={blogId} />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const deleteBlog = async(id)=>{
  
     try{

        const data = await fetch(`${API}/blog/${id}`,{
            method : "DELETE"
        })
        const res = await data.json()

        if(data.status == 200){
            alert(res.message)
            fetchBlogs();
        }
        
     }catch(err){
        console.log(err)
     }
  }

  return (
    <div className="blog-main">
      <div className="blog-container">
        {blogData.length > 0 ? (
          blogData?.filter((ele) => ele.postedBy._id === userId).length > 0 ? (
            blogData?.filter((ele) => ele.postedBy._id === userId).map((blog) => (
              <div key={blog._id} className="blog-post">
                <h4 className="blog-desc">{blog.blogDiscription}</h4>
                <img src={blog.blogUrl} alt="Blog" className="blog-image" />
                <p>Posted by: {blog.postedBy.userName}</p>

                <div>
                    <button className="action-bt-edit" onClick={()=>navigate(`/edit/${blog._id}`)}>Edit</button>
                    <button className="action-bt-delete" onClick={()=>deleteBlog(blog._id)} >Delete</button>
                  </div>
  
                {/* Like and Dislike */}
                <div className="blog-actions">
                  
                  <button
                    className="action-btn"
                    onClick={() => likeFunction(blog._id)}
                  >
                    <FaThumbsUp /> {blog.like.length} Likes
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => disLikeFunction(blog._id)}
                  >
                    <FaThumbsDown /> {blog.disLike.length} Dislikes
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => toggleCommands(blog._id)}
                  >
                    <FaCommentDots /> {blog.commands.length} Comments
                  </button>
                 
                 
                </div>
  
                {/* Commands (Comments Section) */}
                {showCommands[blog._id] && (
                  <div className="commands-section">
                    <h3>Comments:</h3>
                    {blog.commands.length > 0 ? (
                      blog.commands.map((command) => (
                        <div key={command._id} className="command-box">
                          <div className="comment-header">
                            <img
                              src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReNr2tV6uuvmORZKBUeu2Oxf9iH-wdYouxVw&"} 
                              alt="profile"
                              className="profile-image"
                            />
                            <div className="comment-details">
                              <p className="username">{command.commandBy.userName}</p>
                              <p className="timestamp">2 hours ago</p>
                            </div>
                          </div>
                          <p className="comment-text">{command.command}</p>
  
                          <div className="comment-actions">
                            <button
                              className="reply-btn"
                              onClick={() => toggleReplies(command._id)}
                            >
                              {showReplies[command._id] ? "Hide Replies" : "Show Replies"}
                            </button>
                          </div>
  
                          {/* Show replies when toggled */}
                          {showReplies[command._id] && (
                            <>
                              <div className="reply-input">
                                <input
                                  type="text"
                                  value={replyCommand[command._id] || ""}
                                  onChange={(e) =>
                                    setReplyCommand({
                                      ...replyCommand,
                                      [command._id]: e.target.value,
                                    })
                                  }
                                  placeholder="Write a reply..."
                                />
                                <button
                                  className="post-reply-btn"
                                  onClick={() => handlePostReply(blog._id, command._id)}
                                >
                                  Post Reply
                                </button>
                              </div>
  
                              {/* Display Replies */}
                              {command.replies.length > 0 && (
                                <RenderReplies
                                  replies={command.replies}
                                  blogId={blog._id}
                                />
                              )}
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
  
                    {/* Input for New Command */}
                    <div className="new-comment-input">
                      <img
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReNr2tV6uuvmORZKBUeu2Oxf9iH-wdYouxVw&"}
                        alt="profile"
                        className="profile-image"
                      />
                      <input
                        type="text"
                        value={newCommand}
                        onChange={(e) => setNewCommand(e.target.value)}
                        placeholder="Add a comment..."
                      />
                      <button
                        className="post-comment-btn"
                        onClick={() => handlePostCommand(blog._id)}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No blogs found</p>
          )
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </div>
  );
  
}

export default MyBlogs;
