import { AzureFunction, Context } from '@azure/functions'
import SparkPost = require('sparkpost');

const sparkpostClient = new SparkPost(process.env.SparkpostApiKey, { origin: 'https://api.eu.sparkpost.com:443'});

const cosmosDbTrigger: AzureFunction = async function (context: Context, documents: any[]): Promise<void> {
    if (!!documents && documents.length > 0) {
        documents.filter(item => !!item.verification_code)
                .forEach(async item => {
                    context.log('Sending verification email: ', JSON.stringify(item));

                    await sparkpostClient.transmissions.send({
                        options: {
                            "click_tracking": false,
                            "transactional": true,
                        },
                        content: {
                            from: 'me@emailtoself.ch',
                            subject: "Just one more step before scheduling your email",
                            text: `Please click on the following link to verify your email address and you will be all set!\n https://www.emailtoself.ch/#/verify?id=${item.verification_code}`
                        },
                        recipients: [
                            {address: item.email}
                        ]
                    })
                    .then(data => {
                        context.log('Email sent', JSON.stringify(data));
                    })
                    .catch(err => {
                        context.log('Error sending email', JSON.stringify(err));
                    });
                });
    }
}

export default cosmosDbTrigger;
