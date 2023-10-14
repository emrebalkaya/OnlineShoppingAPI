import { AppDataSource } from "./data-source"
import app from "./app"

AppDataSource.initialize().then(async () => {
    app.listen(3000);
    console.log("Express server has started on port 3000.");
}).catch(error => console.log(error))
