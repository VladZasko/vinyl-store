import {app} from "./app";
import {Server} from "http";
import {settings} from "./settings";

const port = settings.PORT

const server: Server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
