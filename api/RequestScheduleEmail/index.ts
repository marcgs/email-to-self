import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';

const client = new CosmosClient(process.env.CosmosDbConnection);
const database = client.database('EmailToSelf');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (!req.body.email || !req.body.subject || !req.body.message || !req.body.when) {
        context.res = {
            status: 400,
            body: "Invalid parameters"
        }
        return;
    }
    const data = {
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        when: new Date(req.body.when).toISOString(),
        verification_code: uuidv4()
    };

    context.log(`Schedule email request for ${JSON.stringify(data)}`);
    await database.container('ScheduledEmailRequests').items.create(data);
    context.res = {
        // status: 200, /* Defaults to 200 */
    };

};

export default httpTrigger;
