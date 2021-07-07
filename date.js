const getDate = ()=>{
    let today = new Date();

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }
    // var day = today.toLocaleDateString("hi-u-ca-indian",options)
    let day = today.toLocaleDateString("en-BZ", options)
    return day;
}
const getDay = ()=>{
    let today = new Date();

    let options = {
        weekday: 'long',
    }
    // var day = today.toLocaleDateString("hi-u-ca-indian",options)
    let day = today.toLocaleDateString("en-BZ", options)
    return day;
}

module.exports = {getDate,getDay}