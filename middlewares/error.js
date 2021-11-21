module.exports.error = (err, req, res, next) => {
    console.log(`From global errorController ${err}`);
    return res.status(500).send("Something failed !!!")
}