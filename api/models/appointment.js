const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    title: { type: String, required: true},
    fromDate: { type: Date, required: true},
    toDate: { type: Date, required: true},
    updateDate: { type: Date, required: true, default: Date.now()},
    createdDate: { type: Date, required: true, default: Date.now()}
});

module.exports = mongoose.model('appointment', appointmentSchema);