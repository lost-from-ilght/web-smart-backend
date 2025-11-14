import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server started at port ${PORT}`);
    console.log(`🌐 Health check available at: http://localhost:${PORT}/health`);
});