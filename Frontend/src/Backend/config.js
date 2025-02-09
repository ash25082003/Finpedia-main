const BASE_URL = "http://localhost:8000/api/v1";

// Function to create a new post
export const createPost = async (postData) => {
  console.log(postData);
  try {
    const response = await fetch(`${BASE_URL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(postData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Function to update a post by ID
export const updatePost = async ({ id, postData }) => {
  try {
    const response = await fetch(`${BASE_URL}/post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(postData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Function to delete a post by ID
export const deletePost = async ({ id }) => {
  try {
    const response = await fetch(`${BASE_URL}/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Function to get a post by ID
export const getPostById = async ({ id }) => {
  try {
    const response = await fetch(`${BASE_URL}/post/${id}`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Function to get all posts
export const getAllPosts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/post?${queryParams}`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};


// Function to get posts by Industry ID
export const getPostsByIndustryId = async ({ industryId }) => {
  try {
    const response = await fetch(`${BASE_URL}/post/industry/${industryId}`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts by industry:", error);
    throw error;
  }
};

// Function to create a new comment
export const createComment = async (commentData) => {
  try {
    const response = await fetch(`${BASE_URL}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(commentData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// Function to update a comment by ID
export const updateComment = async ({ id, commentData }) => {
  try {
    const response = await fetch(`${BASE_URL}/comment/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(commentData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Function to delete a comment by ID
export const deleteComment = async ({ commentId }) => {
  try {
    const response = await fetch(`${BASE_URL}/comment/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Function to get a comment by ID
export const getCommentById = async ({ id }) => {
  try {
    const response = await fetch(`${BASE_URL}/comment/${id}`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
};

// Function to get all comments for a specific post
export const getCommentsByPostId = async ({ postId }) => {
  try {
    const response = await fetch(`${BASE_URL}/comment/post/${postId}`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching comments for post:", error);
    throw error;
  }
};

// Vote functions
export const togglePostVote = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/vote/toggle/post/${postId}`, {
      method: "POST",
      credentials: "include"
    });
    return await response.json();
  } catch (error) {
    console.error("Error toggling post vote:", error);
    throw error;
  }
};

export const toggleCommentVote = async (commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/vote/toggle/comment/${commentId}`, {
      method: "POST",
      credentials: "include"
    });
    return await response.json();
  } catch (error) {
    console.error("Error toggling comment vote:", error);
    throw error;
  }
};

export const getVotedPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/vote/posts`, {
      credentials: "include"
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching voted posts:", error);
    throw error;
  }
};

export const getVotedComments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/vote/comments`, {
      credentials: "include"
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching voted comments:", error);
    throw error;
  }
};

export const getPostVoteCount = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/vote/count/post/${postId}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting post vote count:", error);
    throw error;
  }
};

export const getCommentVoteCount = async (commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/vote/count/comment/${commentId}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting comment vote count:", error);
    throw error;
  }
};
