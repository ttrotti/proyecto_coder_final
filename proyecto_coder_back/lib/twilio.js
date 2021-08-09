import twilio from 'twilio'
const twilioClient = twilio(process.env.TWILIO_ID, process.env.TWILIO_AUTH_TOKEN)
export const sendMessage = async (username, action) => {
    if(action == 'orden') {
        await User.findOne({username: username}, (err, docs) => {
            if(err) {
                console.log(err)
            } else {
                twilioClient.messages.create({
                    body: 'hola',
                    to: `${docs.telephone}`,
                    from: '+14156504059'
                });
            };
        });
    }
}