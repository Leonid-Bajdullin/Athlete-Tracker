import 'reflect-metadata';

import { bootstrapMicroframework } from 'microframework-w3tec';

import { banner } from './lib/banner';
import { Logger } from './lib/logger';
// import { eventDispatchLoader } from './loaders/eventDispatchLoader';
// import { graphqlLoader } from './loaders/graphqlLoader';
// import { monitorLoader } from './loaders/monitorLoader';
// import { swaggerLoader } from './loaders/swaggerLoader';
// import { homeLoader } from './loaders/homeLoader';
import { publicLoader } from './loaders/publicLoader';
import { winstonLoader } from './loaders/winstonLoader';

import { expressLoader } from './loaders/expressLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { iocLoader } from './loaders/iocLoader';

/**
 * EXPRESS TYPESCRIPT BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename);

bootstrapMicroframework({
    /**
     * Loader is a place where you can configure all your modules during microframework
     * bootstrap process. All loaders are executed one by one in a sequential order.
     */
    loaders: [
        winstonLoader, //logger
        iocLoader,
        // eventDispatchLoader, //events dispatcher

        typeormLoader, //creates typeorm connection to database
        expressLoader, //creates an instance of express app

        // swaggerLoader, //API Tool to describe and document your api
        // monitorLoader,
        // homeLoader,

        publicLoader //loads static files from public folder
        // graphqlLoader,
    ]
})
    .then(() => banner(log))
    .catch((error) => log.error('Application is crashed: ' + error));
