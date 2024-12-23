const db = require('../config/firebaseConfig');
const Blog = require('../models/blogModel');

const blogCollection = db.collection('blogs');
exports.getBlogs = async (req, res) => {
    try {
        const snapshot = await blogCollection.get();
        const blogs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Blogs</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #fff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                }
                .blog {
                    border-bottom: 1px solid #ddd;
                    padding: 10px 0;
                }
                .blog:last-child {
                    border-bottom: none;
                }
                .title {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #007bff;
                }
                .content {
                    margin: 10px 0;
                }
                .author {
                    font-size: 0.9em;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Blogs</h1>
                ${blogs
                    .map(
                        blog => `
                    <div class="blog">
                        <div class="title">${blog.title}</div>
                        <div class="content">${blog.content}</div>
                        <div class="author">By: ${blog.author}</div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        </body>
        </html>
        `;

        res.status(200).send(htmlResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newBlog = await blogCollection.add({ title, content, author });
        res.status(201).json({ id: newBlog.id, message: 'Blog created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await blogCollection.doc(req.params.id).get();
        if (!blog.exists) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json({ id: blog.id, ...blog.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        await blogCollection.doc(req.params.id).update({ title, content, author });
        res.status(200).json({ message: 'Blog updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await blogCollection.doc(req.params.id).delete();
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
