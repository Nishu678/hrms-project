//creating a global variable for mongoose connection ,connect db once and reuse ,
// by default in next js db connection create multiple times because of file route reload again abd again , so thats why app will be crashed
//store db connection and promise in global variable.

import { Connection } from "mongoose"

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}

export { }