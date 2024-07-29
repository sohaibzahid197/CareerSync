const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config({ path: "./config.env" });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.text({ type: '/' }));

app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

require("./database/connection");

const candidateProfileRouter = require("./router/candidateProfileRouter");
const employerProfileRouter = require("./router/employerProfileRouter");
const candidatePortfolioRouter = require("./router/candidatePortfolioRouter");
const testRouter = require("./router/testResults");

app.use(express.json());
app.use(require("./router/uploadResumeRoute"));
app.use(require("./router/authentication"));
app.use(require("./router/home"));
app.use(candidateProfileRouter);
app.use(employerProfileRouter);
app.use(require("./router/bookmarkedCandidateRouter"));
app.use(require("./router/candidateBookmarkRouter"));
app.use(candidatePortfolioRouter);
app.use(require("./router/zoomRouter"));
app.use(require("./router/emailRouter"));
app.use(testRouter);

const Candidate = require("./models/candidateSchema");

let previousCandidateCount = 0;

const getCandidateCount = async () => {
    try {
        const count = await Candidate.countDocuments();
        return count;
    } catch (error) {
        console.error('Error fetching candidate count:', error);
        return previousCandidateCount;
    }
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const sendJobUpdateNotification = () => {
    const message = 'Jobs have been updated!';
    io.emit('notify', message);
    console.log('Notification sent:', message);
};

const sendNotificationWhenCandidateJoins = (message) => {
    io.emit('notify', message);
    console.log('Notification sent to clients:', message);
};

const checkForNewCandidates = async () => {
    const currentCandidateCount = await getCandidateCount();
    if (currentCandidateCount > previousCandidateCount) {
        const message = 'A new candidate has registered!';
        sendNotificationToClients(message);
        previousCandidateCount = currentCandidateCount;
    }
};

const intervalTime = 1 * 60 * 1000;
setInterval(sendJobUpdateNotification, intervalTime);

const interval = 1 * 60 * 1000;
setInterval(checkForNewCandidates, interval);

(async () => {
    previousCandidateCount = await getCandidateCount();
})();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});