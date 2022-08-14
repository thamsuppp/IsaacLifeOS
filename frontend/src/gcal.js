const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const fetchEvents = async () => {

    const CLIENT_ID = '337066080255-0lobd861jpv933q2sf7mq2iqcgoq8met.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REFRESH_TOKEN = '1//04kkUNxO43vVICgYIARAAGAQSNwF-L9Ir9VaXE9S9JQmNzA7M5yKkVzyE4zUTtngQFhPz8q6me2w6XO-iAGEWe3RLuornXHBoIws';

    // Declare a new OAuth2 client
    const oAuth2Client = new OAuth2(
        CLIENT_ID, // client ID
        CLIENT_SECRET // client secret
    )

    // Set the refresh token
    oAuth2Client.setCredentials({refresh_token: 
        REFRESH_TOKEN
    });

    // Declare calendar instance
    const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
    // Get calendar events
    var res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date(2022, 7, 1)).toISOString(),
        timeMax: (new Date(2022, 7, 31)).toISOString(),
    })

    const eventsRaw = res.data.items
    const events = eventsRaw.map(event => {
        return {
            title: event.summary,
            start: event.start.dateTime,
            end: event.end.dateTime
        }
    })

    return events;
}    

export {
    fetchEvents
}