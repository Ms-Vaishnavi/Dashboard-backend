const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = 3000 | process.env.PORT;

app.use(cors());

mongoose.connect("mongodb+srv://vaishnavi-admin:login%40DB@cluster0.l89bc9q.mongodb.net/Projects-Database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const projectsSchema = new mongoose.Schema({
    Project: {
        Title: String,
        Technologies: String,
    },
    Technical_Skillset: {
        Frontend: String,
        Backend: String
    },
    Other_Information: {
        Availability: String
    }
});

const Project = mongoose.model("Project", projectsSchema);

app.get('/', async (req, res) => {
    try {
        const allProjects = await Project.find({});
        res.json(allProjects);
    } catch (error) {
        console.error('Error fetching all projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/search', async (req, res) => {
    const searchTerm = req.query.searchTerm;

    const wordsArray = searchTerm.split(/[ ,;!?:]+/);

    const filteredWordsArray = wordsArray.filter(word => word.trim() !== '');

    try {

        const regexSearchTerms = wordsArray.map(term => new RegExp(term, 'i'));

        const searchResults = await Project.find({
            $or: [
                {
                    'Project.Title': { $in: regexSearchTerms },
                },
                {
                    'Project.Technologies': { $in: regexSearchTerms },
                },
                {
                    'Technical_Skillset.Frontend': { $in: regexSearchTerms },
                },
                {
                    'Technical_Skillset.Backend': { $in: regexSearchTerms },
                },
            ]
        });

        res.json(searchResults);
    } catch (error) {
        console.error('Error searching for projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ` + PORT);
});
