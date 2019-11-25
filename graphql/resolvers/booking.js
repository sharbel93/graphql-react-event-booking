const Event = require('../../models/events');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge');



module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        }  catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId});
        const booking = new Booking({
            user: '5dc42a5bd7a4f16acb48d64e',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async args => {
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            //     {
            //   ...booking.event._doc,
            //   _id: booking.event.id,
            //   creator: user.bind(this, booking.event._doc.creator)
            // };
            await  Booking.deleteOne({ _id: args.bookingId });
            return event;
        }catch (err) {
            throw err;
        }
    }
};

