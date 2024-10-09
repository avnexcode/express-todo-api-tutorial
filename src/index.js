import app from "./app.js";
import Logging from "./helpers/Logging.js";
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    Logging.info(`Sever running on http://localhost:${PORT}`)
})