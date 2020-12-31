import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient(process.env.CosmosDbConnection);
const database = client.database('EmailToSelf');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (!req.query.id) {
        context.res = {
            status: 400,
            body: "Invalid parameters"
        };
        return;
    }

    const result = await database
                    .container('ScheduledEmailRequests')
                    .items.query(`SELECT * from c WHERE c.verification_code="${req.query.id}"`)
                    .fetchAll();
                    
    if (result.resources.length !== 1) {
        context.res = {
            status: 400,
            body: {
                message: `Invalid verification code: ${req.query.id}`
            }
        };
        return;
    }

    const item = result.resources[0];
    item.verification_code = null;

    await database
        .container('ScheduledEmailRequests')
        .items.upsert(item);
    
    await database
        .container('ScheduledEmails')
        .items.create({
            email: item.email,
            subject: item.subject,
            message: item.message,
            when: item.when,
            verified_at: new Date().toISOString(),
            sent_at: null,
        });

        context.res = {
            body: {
                email: item.email,
                subject: item.subject,
                message: item.message,
                when: item.when,
            }
        };
};

export default httpTrigger;
