const app = require("./index");

const {PORT = 4000} = process.env;

app.listen(PORT, () => {
	console.log(`Dogs are ready at http://localhost:${PORT}`);
});
