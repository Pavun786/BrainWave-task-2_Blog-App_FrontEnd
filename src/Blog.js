// import { useEffect, useState } from "react";
// import { FaThumbsUp, FaThumbsDown, FaCommentDots } from "react-icons/fa"; // Importing Icons
// import './App.css'; // Add this for custom styles

// function Blog() {
//   const [blogData, setBlogData] = useState([]);

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     const data = await fetch("http://localhost:4600/blog/allBlogs", {
//       method: "GET",
//     });
//     const res = await data.json();
//     setBlogData([...res]);
//   };

//   const [showCommands, setShowCommands] = useState({});
//   const [showReplies, setShowReplies] = useState({});

//   const toggleCommands = (blogId) => {
//     setShowCommands((prevState) => ({
//       ...prevState,
//       [blogId]: !prevState[blogId],
//     }));
//   };

//   const toggleReplies = (commandId) => {
//     setShowReplies((prevState) => ({
//       ...prevState,
//       [commandId]: !prevState[commandId],
//     }));
//   };

//   const likeFunction = async(id)=>{
      
//      const likeData = await fetch(`http://localhost:4600/like/${id}`,{
//          method : "POST",
//          headers : {
//             "Content-type" : "application/json"
//          },
//          body: JSON.stringify( {
//             "userId" : "66e439161f43aa78f7d75ab2"
//          })
//      })

//      const res = await likeData.json()

//      fetchBlogs()
//   }

//   const disLikeFunction = async(id)=>{
    
//     const likeData = await fetch(`http://localhost:4600/dislike/${id}`,{
//         method : "POST",
//         headers : {
//            "Content-type" : "application/json"
//         },
//         body: JSON.stringify( {
//            "userId" : "66e439161f43aa78f7d75ab2"
//         })
//     })

//     const res = await likeData.json()

//     fetchBlogs() 
//   }

//   console.log(blogData)

//   return (
//     <div className="blog-container">
//       {blogData.length > 0 ? (
//         blogData.map((blog) => (
//           <div key={blog._id} className="blog-post">
//             <h2>{blog.blogDiscription}</h2>
//             <img src={blog.blogUrl} alt="Blog" className="blog-image" />
//             <p>Posted by: {blog.postedBy.userName}</p>

//             {/* Like and Dislike */}
//             <div className="blog-actions">
//               <button className="action-btn" onClick={()=>likeFunction(blog._id)}>
//                 <FaThumbsUp /> {blog.like.length} Likes
//               </button>
//               <button className="action-btn"onClick={()=>disLikeFunction(blog._id)}>
//                 <FaThumbsDown /> {blog.disLike.length} Dislikes
//               </button>
//               <button className="action-btn" onClick={() => toggleCommands(blog._id)}>
//                 <FaCommentDots /> {blog.commands.length} Comments
//               </button>
//             </div>

//             {/* Commands */}
//             {showCommands[blog._id] && (
//               <div className="commands-section">
//                 <h3>Comments:</h3>
//                 {blog.commands.length > 0 ? (
//                   blog.commands.map((command) => (
//                     <div key={command._id} className="command">
//                       <p>{command.commandBy.userName}: {command.command}</p>

//                       {/* Toggle for Replies */}
//                       <button
//                         className="action-btn"
//                         onClick={() => toggleReplies(command._id)}
//                       >
//                         {command.replies.length} Replies
//                       </button>

//                       {/* Replies to Commands */}
//                       {showReplies[command._id] && (
//                         <div className="replies">
//                           {command.replies.map((reply) => (
//                             <div key={reply._id} className="reply">
//                               <p>{reply.commandBy.userName}: {reply.command}</p>

//                               {/* Replies to Replies */}
//                               {reply.replies.length > 0 && (
//                                 <div className="nested-replies">
//                                   {reply.replies.map((nestedReply) => (
//                                     <p key={nestedReply._id}>
//                                       {nestedReply.commandBy.userName}: {nestedReply.command}
//                                     </p>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No comments yet.</p>
//                 )}
//               </div>
//             )}
//             <p>Created at: {new Date(blog.creationDate).toLocaleDateString()}</p>
//           </div>
//         ))
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default Blog;




import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaCommentDots } from "react-icons/fa"; // Importing Icons
import './App.css'; // Add this for custom styles
import {API} from "./Global.js"

function Blog() {
  const [blogData, setBlogData] = useState([]);
  const [newCommand, setNewCommand] = useState(""); // For new comments
  const [replyCommand, setReplyCommand] = useState({}); // For reply inputs
  const [showCommands, setShowCommands] = useState({});
  const [showReplies, setShowReplies] = useState({}); // This manages reply visibility

  let userId = localStorage.getItem("userId")


  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await fetch(`${API}/blog/allBlogs`, {
        method: "GET",
      });
      const res = await data.json();
  
      // Ensure the response is an array before setting it in state
      if (Array.isArray(res)) {
        setBlogData([...res]);
      } else {
        setBlogData([]); // Set to an empty array if the response is not an array
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogData([]); // Handle error by setting blogData to an empty array
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
      [commandId]: !prevState[commandId], // Toggles replies visibility
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
        userId: userId, // Sample userId
      }),
    });
    fetchBlogs();
  };

  // Handle posting a new comment
  const handlePostCommand = async (blogId) => {
    await fetch(`${API}/command/newCommand/${blogId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        command: newCommand,
        commandBy: userId, // Sample userId
      }),
    });
    setNewCommand(""); // Clear input after posting
    fetchBlogs();
  };

  // Handle posting a reply to a command
  const handlePostReply = async (blogId, parentCommandId) => {
    await fetch(`${API}/command/newCommand/${blogId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        command: replyCommand[parentCommandId],
        commandBy: userId, // Sample userId
        parentCommandId: parentCommandId, // The ID of the parent command
      }),
    });
    setReplyCommand((prevState) => ({ ...prevState, [parentCommandId]: "" })); // Clear input after posting
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
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvts5aHBstDkR8PigS4RmZkbZy78zpZoSuOw&s"}
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

  return (
    <div className="blog-main">
        <div className="blog-container">
      {blogData.length > 0 ? (
        blogData.map((blog) => (
          <div key={blog._id} className="blog-post">
            <h4 className="blog-desc">{blog.blogDiscription}</h4>
            <img src={blog.blogUrl} alt="Blog" className="blog-image" />
            <p>Posted by: {blog.postedBy.userName}</p>

            {/* Like and Dislike */}
            <div className="blog-actions">
              <button className="action-btn" onClick={() => likeFunction(blog._id)}>
                <FaThumbsUp /> {blog.like.length} Likes
              </button>
              <button className="action-btn" onClick={() => disLikeFunction(blog._id)}>
                <FaThumbsDown /> {blog.disLike.length} Dislikes
              </button>
              <button className="action-btn" onClick={() => toggleCommands(blog._id)}>
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
                          src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReNr2tV6uuvmORZKBUeu2Oxf9iH-wdYouxVw&"} // Placeholder for profile image
                          alt="profile"
                          className="profile-image"
                        />
                        <div className="comment-details">
                          <p className="username">{command.commandBy.userName}</p>
                          <p className="timestamp">{"now"}</p>
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
                                setReplyCommand({ ...replyCommand, [command._id]: e.target.value })
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
                            <RenderReplies replies={command.replies} blogId={blog._id} />
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
        <p>No Blogs Found</p>
      )}
    </div>
    </div>
  );
}

export default Blog;
