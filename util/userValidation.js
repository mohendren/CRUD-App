const users = require('./../model/user');
const attendances = require('./../model/attendance');
const validateUser = (email, password) => {
    var match = false;
    var i;
    for (var k in users) {
        if (users[k].email_id === email && users[k].key === password) {
            match = true;
            i = k;
        }
    }
    if (match === true) {
        var a = users[i];
        delete a.key;
        return a;
    }
    return match;
}

const authorizeParent = (email, childClass, standard, rollNo) => {
    console.log(email, childClass, standard, rollNo)
    var match = false;
    for (var k in users) {
        if (users[k].email_id === email && users[k].child_class === childClass
            && users[k].child_standard === standard && users[k].child_rollno === rollNo) {
            match = true
        }
    }
    return match;
}

const authorizeTeacher = (email, Class, standard) => {
    console.log(email, Class, standard)
    var match = false;
    for (var k in users) {
        if (users[k].email_id === email && users[k].class === Class && users[k].standard === standard) {
            match = true
            console.log('match', users[k])
        }
    }
    return match;
}

const getStudAttendance = (rollNo, Class, standard) => {
    console.log(rollNo, Class, standard)
    var result = [];
    var details = new Promise(resolve => {
        for (var j in attendances) {
            if (attendances[j].rollNo === rollNo && attendances[j].class === Class
                && attendances[j].standard === standard) {
                    result.push(attendances[j]);
            }
        }
        resolve(result)
    });
    return details;
}


const addAttendance = (data) => {
 delete data.token;
 return new Promise((resolve,reject)=>{
     var match = false;
      for(var j in attendances){
          if(attendances[j].rollNo === data.rollNo && attendances[j].class === data.class
            && attendances[j].standard === data.standard && attendances[j].date === data.date){
                match = true 
            }
      }
      if(match===false){
        attendances.push(data);
        resolve();
      }
      else {
          reject('Data Already Exist for this student')
      }
 })
}

module.exports = {
    validateUser, authorizeParent, getStudAttendance, authorizeTeacher,addAttendance
}