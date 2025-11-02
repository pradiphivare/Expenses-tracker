const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	return res.json({ status: 'ok', time: new Date() });
});

app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));

const express = require(\"express\");\nconst app = express();\nconst port = process.env.PORT || 3000;\napp.use(express.json());\napp.get(\"/\", (req, res) => res.json({ status: \"ok\", time: new Date() }));\napp.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
