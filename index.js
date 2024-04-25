import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Art & Craft Server is Running!");
});

app.listen(port, () => {
    console.log(`Art & Craft Server is Running on Port: ${port}`);
});