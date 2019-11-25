const Event = require('../../models/events');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch( err)  {
            throw err;
        }
    },
    createEvent: async args => {
        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.eventInput.title,
        //   description: args.eventInput.description,
        //   price: +args.eventInput.price,
        //   date: args.eventInput.date
        // };
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5dc42a5bd7a4f16acb48d64e'
        });
        let createdEvent;
        try{
            const result = await event.save();
            createdEvent = transformEvent(result);
            //     {
            //     ...result._doc,
            //     date: new Date(result._doc.date).toISOString(),
            //     creator: user.bind(this, result._doc.creator)
            // };

            const creator = await  User.findById('5dc42a5bd7a4f16acb48d64e');
            if(!creator) {
                throw new Error('User not found.')
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch(err) {
            console.log(err);
            throw err;
        }
        // return event;
    }
};
