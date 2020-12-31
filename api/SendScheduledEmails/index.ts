import { AzureFunction, Context } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos';
import SparkPost = require('sparkpost');

const sparkpostClient = new SparkPost(process.env.SparkpostApiKey, { origin: 'https://api.eu.sparkpost.com:443'});

const client = new CosmosClient(process.env.CosmosDbConnection);
const database = client.database('EmailToSelf');

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var now = new Date().toISOString();
    
    const result = await database
                    .container('ScheduledEmails')
                    .items.query(`SELECT * from c WHERE c["when"] <= "${now}" AND IS_NULL(c.sent_at)`)
                    .fetchAll();

    context.log(`Found ${result.resources.length} emails to be sent`);

    result.resources.forEach(async item => {
        context.log(`Sending email: ${JSON.stringify(item)}`);

        await sparkpostClient.transmissions.send({
            options: {
                'click_tracking': false,
                'transactional': true,
            },
            content: {
                from: 'me@emailtoself.ch',
                subject: item.subject,
                text: item.message
            },
            recipients: [
                {address: item.email}
            ]
        }).then(async data => {
            item.sent_at = now;
            await database.container('ScheduledEmails').items.upsert(item);
            context.log('Email sent', JSON.stringify(data));
        })
        .catch(err => {
            context.log('Error sending email', JSON.stringify(err));
        });
        
    });
};

export default timerTrigger;
