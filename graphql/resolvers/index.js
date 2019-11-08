const bcrypt = require('bcryptjs');
const Event = require('../../models/events');
const User = require('../../models/user');

const events = async eventIds => {
    try{
    const events = await Event.find({ _id: { $in: eventIds } });
            return events.map(event => {
                return { ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)}
                 });
        } catch(err) {
            throw err;
        }
};


const user = async userId => {
    try{
    const user = await User.findById(userId)
            return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) };
        }catch(err)  {
            throw err;
        }
};

module.exports = {
    events: async () => {
        try {
        const events = await Event.find();
                return events.map(event => {
                    return { ...event._doc,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator) };
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
                createdEvent = { ...result._doc,
                    date: new Date(result._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)};
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
    },
    createUser: async args => {
        try{
        const existingUser = await User.findOne({ email: args.userInput.email });
            if(existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save();
            return { ...result._doc, password: null }
        }catch(err) {
                throw err;
            }
    }
}
