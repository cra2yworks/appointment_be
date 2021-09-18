const moment = require("moment");
const mongoose = require("mongoose");
const Appointment = require("../models/appointment");
const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";


//get by id
exports.get = async (req, res, next) => {
    try {
        // console.log(req.params.id)
        let search = req.params.id === undefined ? {} : { _id: req.params.id };
        const result = await Appointment.find(search);

        if(result) {
            res.status(200).json(result.map(x=> { return {
                id: x._id,
                name: x.name,
                title: x.title,
                fromDate: moment(x.fromDate).format(DATEFORMAT),
                toDate: moment(x.toDate).format(DATEFORMAT),
                updateDate: moment(x.updateDate).format(DATEFORMAT),
                createdDate: moment(x.createdDate).format(DATEFORMAT)
            }
            }));
        } else {
            throw new Error('Fail to retreive Appointment.');
        }

    } catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

//add
exports.add = async (req, res, next) => {
    try {
  
        const appointment = new Appointment({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title || "",
            name: req.body.name,
            fromDate: moment(req.body.fromDate).toDate(),
            toDate: moment(req.body.toDate).toDate()
        });

        const newAppointment = await appointment.save();
        // console.log(newAppointment);
        if(newAppointment === null) throw new Error('Failed to create Appointment');

        console.log(`${newAppointment._id} created.`)
        res.status(201).json({message: "Appointment created", id:newAppointment._id});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

//update by id
exports.update = async (req, res, next) => {
    try {
        let id = req.body.id;
        // console.log(id)
        const result = await Appointment.findOneAndUpdate({ _id: id },
            { 
                title: req.body.title,
                fromDate: moment(req.body.fromDate).toDate(),
                toDate: moment(req.body.toDate).toDate(),
                updateDate: Date.now()
            }
        );

        if(result) {
            console.log(`${id} updated.`)
            res.status(200).json({message: 'Appointment updated.'});
        } else {
            throw new Error('Fail to update Appointment');
        }

    } catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

//delete by id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    // console.log(id)
    Appointment.remove({ _id: id }).exec()//Delete appointment
    .then(result => {
        console.log(`${id} deleted.`)
        res.status(200).json({message: "Appointment deleted"});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

//MiddleWare
exports.requireExist = async (req, res, next) => {
    try {
        let search = req.params.id === undefined ? {_id: req.body.id} : {_id: req.params.id};
        const appointment = await Appointment.find(search);
        if ( appointment === null || appointment.length === 0) throw new Error('Appointment Not Found');
        else return next();

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: error
        });
    }
};


exports.insertCheck = async (req, res, next) => {
    try {
        // console.log(req.body);
        const {fromDate, toDate} = req.body; 
        
        //Work hour check
        const TIMEFORMAT = 'HH:mm:ss';
        const getTime = date => moment({h: date.hours(), m: date.minutes()});
        beforeTime = getTime(moment('09:00:00', TIMEFORMAT));
        afterTime = getTime(moment('18:00:00', TIMEFORMAT));
        const checkWorkHours = date => getTime(moment(date)).isBetween(beforeTime, afterTime, null, "[]");
        const checkWeekDays = date => moment(date).isoWeekday() >= 1 && moment(date).isoWeekday() <=5;
        if( !checkWeekDays(fromDate) ||
            !checkWeekDays(toDate) ){
            throw new Error('Fail Work Day check.');
        }
        if( !checkWorkHours(fromDate) ||
            !checkWorkHours(toDate) ){
            throw new Error('Fail Work hour check.');
        }
         
        //advance booking Check
        const ADVMINBDAYS = 2;
        const ADVMAXDAYS = 21; //3 weeks

        // let advMinDate = moment().startOf("day").add(ADVMINDAYS, 'days');
        let advMaxDate = moment().endOf("day").add(ADVMAXDAYS, 'days');
        let advMinDate = moment().startOf("day");
        let businessDayCount = 0;
        while(businessDayCount < ADVMINBDAYS){ //Add business days
            if(checkWeekDays(advMinDate)){
                businessDayCount++;
            }
            advMinDate = advMinDate.add(1, 'days');
        }
        const advBookingCheck = date => moment(date).isBetween(advMinDate, advMaxDate, null, "[]");
        if( !advBookingCheck(fromDate) ){
            throw new Error(`Fail Advance Booking check. ${advMinDate.format("YYYY-MM-DD")} - ${advMaxDate.format("YYYY-MM-DD")}`);
        }

        //Conflict Check
        const appointment = await Appointment.find({ 
                fromDate: {
                    "$gte": new Date(fromDate), "$lt": new Date(toDate)
                }
        });
        if ( appointment !== null && appointment.length !== 0){
            throw new Error('Fail Appoinment Conflict Check.');
        }
        
        return next();

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: error
        });
    }
};


